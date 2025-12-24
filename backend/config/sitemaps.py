"""
Sitemap configuration for AAA Accident Solutions LTD
"""

from django.contrib.sitemaps import Sitemap
from django.urls import reverse


class StaticViewSitemap(Sitemap):
    """Sitemap for static pages (React routes)"""

    priority = 0.8
    changefreq = "weekly"
    protocol = "https"

    def items(self):
        """Return list of all public page URLs"""
        return [
            # Main pages
            ("frontend-root", 1.0, "daily"),
            ("frontend-app", 0.9, "weekly"),  # Fallback route
            # Service pages (high priority)
            ("replacement-vehicle", 0.9, "weekly"),
            ("accident-claim-management", 0.9, "weekly"),
            ("car-recovery-and-storage", 0.9, "weekly"),
            ("accidental-repair", 0.9, "weekly"),
            ("personal-injury-claim", 0.9, "weekly"),
            ("pco-replacement", 0.8, "weekly"),
            ("insurance-services", 0.8, "weekly"),
            ("personal-assistance", 0.8, "weekly"),
            ("introducer-support", 0.8, "weekly"),
            # Information pages
            ("about", 0.7, "monthly"),
            ("what-we-do", 0.7, "monthly"),
            ("road-traffic-accidents", 0.7, "monthly"),
            ("what-to-do-after-accident", 0.8, "weekly"),
            # Fleet & Sales
            ("our-fleet", 0.8, "weekly"),
            ("car-sale-buy", 0.7, "weekly"),
            ("car-sales", 0.7, "weekly"),
            # Blog & Testimonials
            ("our-blogs", 0.8, "daily"),
            ("customer-testimonials", 0.7, "weekly"),
            # Support pages
            ("faqs", 0.7, "monthly"),
            ("contact", 0.8, "monthly"),
            ("make-claim", 0.9, "monthly"),
            # Legal pages
            ("terms-of-service", 0.5, "yearly"),
            ("privacy-policy", 0.5, "yearly"),
            ("cookie-policy", 0.5, "yearly"),
        ]

    def location(self, item):
        """Return the URL for each item"""
        url_name, priority, changefreq = item
        try:
            # Try to reverse the URL name
            return reverse(url_name)
        except:
            # If reverse fails, construct URL from name
            # Remove 'frontend-' prefix if exists
            path = url_name.replace("frontend-", "")
            if path == "root":
                return "/"
            if path == "app":
                return "/"
            # Convert URL name to path
            return "/" + path.replace("_", "-").replace("-", "-")

    def priority(self, item):
        """Return priority for each item"""
        url_name, priority, changefreq = item
        return priority

    def changefreq(self, item):
        """Return change frequency for each item"""
        url_name, priority, changefreq = item
        return changefreq


# Dictionary of sitemaps to include
sitemaps = {
    "static": StaticViewSitemap,
}
