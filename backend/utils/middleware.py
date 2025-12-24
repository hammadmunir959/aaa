import logging
import time
import uuid
from django.utils.deprecation import MiddlewareMixin
from django.http import HttpResponse
from django.conf import settings


class RequestIDMiddleware(MiddlewareMixin):
    """Add unique request ID to each request for logging."""
    
    def process_request(self, request):
        request.id = str(uuid.uuid4())[:8]
        return None


class SuppressPollingLogsMiddleware(MiddlewareMixin):
    """Suppress verbose logs for polling endpoints."""
    
    def process_request(self, request):
        # Add flag to suppress logs for polling endpoints
        polling_paths = ['/api/chatbot/messages/', '/health/', '/ready/', '/live/']
        request.suppress_logs = any(request.path.startswith(path) for path in polling_paths)
        return None


class CSRFExemptMiddleware(MiddlewareMixin):
    """Exempt API endpoints from CSRF protection."""
    
    def process_request(self, request):
        # Exempt all API endpoints from CSRF (except CSRF token endpoint which needs to set cookie)
        # We use JWT authentication for API endpoints, not session-based CSRF
        # The CSRF token endpoint needs to work normally to set cookies for any legacy endpoints
        if request.path.startswith('/api/') or request.path.startswith('/backup/'):
            # Don't exempt the CSRF token endpoint - it needs to work normally to set cookies
            if not request.path.endswith('/csrf/'):
                setattr(request, '_dont_enforce_csrf_checks', True)
        return None


class SecurityHeadersMiddleware(MiddlewareMixin):
    """Add security headers to responses."""
    
    def process_response(self, request, response):
        # Add security headers
        response['X-Content-Type-Options'] = 'nosniff'
        response['X-Frame-Options'] = 'DENY'
        response['X-XSS-Protection'] = '1; mode=block'
        response['Referrer-Policy'] = 'strict-origin-when-cross-origin'
        
        # Add Content Security Policy that allows reCAPTCHA and Google Maps
        # Define CSP directives
        # Use lists for directives that might need dynamic additions
        connect_src = [
            "'self'",
            "https://www.google.com",
            "https://lookerstudio.google.com",
            "https://aaa-as.co.uk",
            "https://www.aaa-as.co.uk"
        ]
        
        # In development, allow connections to localhost for API calls
        if settings.DEBUG:
            connect_src.extend([
                "http://localhost:8000",
                "http://127.0.0.1:8000",
                "ws://localhost:8000",
                "ws://127.0.0.1:8000"
            ])

        csp_directives = [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.google.com https://www.gstatic.com https://www.googletagmanager.com",
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
            "font-src 'self' https://fonts.gstatic.com",
            "img-src 'self' data: https:",
            "frame-src 'self' https://www.google.com https://maps.google.com https://lookerstudio.google.com https://accounts.google.com",
            f"connect-src {' '.join(connect_src)}",
            "object-src 'none'",
            "base-uri 'self'"
        ]
        csp_header = "; ".join(csp_directives)
        
        # Force override any existing CSP header
        response['Content-Security-Policy'] = csp_header
        
        # Add HSTS for HTTPS requests
        if request.is_secure():
            response['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains'
        
        return response


class SensitiveFileProtectionMiddleware(MiddlewareMixin):
    """Block access to sensitive files and directories."""
    
    # Patterns for sensitive files and directories
    SENSITIVE_PATTERNS = [
        r'\.env',  # .env, .env.local, .env.production, etc.
        r'\.git',  # .gitignore, .gitattributes, .git/
        r'\.htaccess',
        r'\.htpasswd',
        r'\.ini$',
        r'\.log$',
        r'\.sql$',
        r'\.sqlite',
        r'\.db$',
        r'\.conf$',
        r'\.config$',
        r'\.key$',
        r'\.pem$',
        r'\.crt$',
        r'\.p12$',
        r'\.pfx$',
        r'\.bak$',
        r'\.backup$',
        r'\.old$',
        r'\.orig$',
        r'\.save$',
        r'\.swp$',
        r'\.tmp$',
        r'\.temp$',
        r'\.lock$',
        r'/\.git/',
        r'/\.svn/',
        r'/\.hg/',
        r'/\.bzr/',
    ]
    
    def process_request(self, request):
        import re
        
        path = request.path
        
        # Check for hidden files/directories (starting with .)
        if '/' in path and any(part.startswith('.') for part in path.split('/') if part):
            # Allow .well-known for Let's Encrypt
            if not path.startswith('/.well-known/'):
                return HttpResponse('Not Found', status=404)
        
        # Check against sensitive file patterns
        for pattern in self.SENSITIVE_PATTERNS:
            if re.search(pattern, path, re.IGNORECASE):
                logging.warning(f"Blocked access attempt to sensitive file: {path} from {self._get_client_ip(request)}")
                return HttpResponse('Not Found', status=404)
        
        return None
    
    def _get_client_ip(self, request):
        """Extract client IP address from request."""
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip


class ForceJSONResponseMiddleware(MiddlewareMixin):
    """Ensure all API endpoints return JSON responses, even for errors."""
    
    def process_response(self, request, response):
        """Force JSON content type for API and common endpoint patterns."""
        # List of path prefixes that should return JSON (API endpoints called by frontend)
        # Frontend may call these without /api/ prefix due to VITE_API_URL configuration
        json_path_prefixes = [
            '/api/',
            '/auth/',
            '/theming/',
            '/analytics/',
            '/chatbot/',
            '/vehicles/',
            '/bookings/',
            '/inquiries/',
            '/testimonials/',
            '/blog/',
            '/car_sales/',
            '/cms/',
            '/newsletter/',
            '/gallery/',
            '/faq/',
            '/cookies/',
            '/backup/',
            '/metrics/',
            '/captcha/',
        ]
        
        # Check if this request path should return JSON
        should_return_json = any(request.path.startswith(prefix) for prefix in json_path_prefixes)
        
        if not should_return_json:
            return response
        
        # If response is already JSON, return as-is
        content_type = response.get('Content-Type', '')
        if 'application/json' in content_type:
            return response
        
        # If response is HTML and this is an API/auth endpoint, convert to JSON error
        if 'text/html' in content_type:
            import json
            from django.http import JsonResponse
            
            # Create a JSON error response
            error_data = {
                'error': 'Internal server error',
                'message': 'The server encountered an error processing your request',
                'status_code': response.status_code
            }
            
            # Try to extract error message from HTML if possible
            try:
                content = response.content.decode('utf-8')
                if 'Page not found' in content or response.status_code == 404:
                    error_data['error'] = 'Not found'
                    error_data['message'] = 'The requested resource was not found'
            except:
                pass
            
            return JsonResponse(error_data, status=response.status_code)
        
        return response