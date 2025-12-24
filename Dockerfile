# Multi-stage build for complete application (Frontend + Backend)
# Stage 1: Build Frontend
FROM node:20-slim AS frontend-builder

WORKDIR /app/frontend

# Install system dependencies for node-gyp and native modules
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Copy package files
COPY frontend/package.json frontend/package-lock.json* frontend/bun.lockb* ./

# Install dependencies
RUN if [ -f package-lock.json ]; then \
    npm ci --legacy-peer-deps; \
    elif [ -f bun.lockb ]; then \
    npm install -g bun && bun install; \
    else \
    npm install --legacy-peer-deps; \
    fi

# Copy frontend source (excluding node_modules which is already installed)
# Use .dockerignore to control what gets excluded
COPY frontend/ ./

# Verify critical files exist (especially src/lib/utils.ts) before building
RUN echo "Verifying frontend source files..." && \
    if [ ! -f "src/lib/utils.ts" ]; then \
    echo "ERROR: src/lib/utils.ts not found!" && \
    echo "Contents of src/lib:" && \
    ls -la src/lib/ 2>/dev/null || echo "src/lib directory does not exist" && \
    echo "Contents of src:" && \
    ls -la src/ 2>/dev/null || echo "src directory does not exist" && \
    echo "Current directory contents:" && \
    ls -la && \
    echo "Tree structure:" && \
    find src -type f -name "*.ts" -o -name "*.tsx" | head -20 && \
    exit 1; \
    else \
    echo "✓ src/lib/utils.ts found" && \
    echo "✓ Frontend source files verified"; \
    fi

# Create the backend directory structure that vite.config.ts expects
# vite.config.ts outputs to ../backend/frontend_dist relative to frontend dir
RUN mkdir -p ../backend

# Build arguments for environment variables
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL:-http://localhost:8000}

# Build frontend (will output to ../backend/frontend_dist as configured in vite.config.ts)
RUN npm run build

# Verify build output and copy to staging location
RUN if [ -d "../backend/frontend_dist" ]; then \
    mkdir -p /app/frontend_dist && \
    cp -r ../backend/frontend_dist/* /app/frontend_dist/; \
    echo "Frontend built successfully"; \
    elif [ -d "dist" ]; then \
    mkdir -p /app/frontend_dist && \
    cp -r dist/* /app/frontend_dist/; \
    echo "Frontend built to dist, copied to staging"; \
    else \
    echo "ERROR: Frontend build output not found!" && \
    ls -la && \
    ls -la .. && \
    exit 1; \
    fi

# Stage 2: Python Dependencies Builder
FROM python:3.12-slim AS python-builder

WORKDIR /app

# Install system dependencies for building
RUN apt-get update && apt-get install -y \
    gcc \
    postgresql-client \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
COPY backend/requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir --user -r requirements.txt

# Stage 3: Final Production Image
FROM python:3.12-slim

WORKDIR /app

# Copy Python dependencies from builder
COPY --from=python-builder /root/.local /root/.local

# Install runtime dependencies
RUN apt-get update && apt-get install -y \
    postgresql-client \
    curl \
    nginx \
    && rm -rf /var/lib/apt/lists/*

# Make sure scripts in .local are usable
ENV PATH=/root/.local/bin:$PATH

# Copy backend code
COPY backend/ /app/backend/

# Pre-compile Python bytecode for faster startup
RUN python -m compileall /app/backend

# Copy built frontend from frontend-builder
COPY --from=frontend-builder /app/frontend_dist /app/backend/frontend_dist

# Set environment variables
ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=0
ENV DJANGO_SETTINGS_MODULE=config.settings.production

# Create directories for static files, media, and logs
RUN mkdir -p /app/backend/staticfiles/themes /app/media /app/logs

# Set working directory to backend for manage.py commands
WORKDIR /app/backend

# Create startup script
RUN echo '#!/bin/bash\n\
    set -e\n\
    echo "Waiting for database..."\n\
    until python manage.py check --database default 2>/dev/null; do\n\
    echo "Database is unavailable - sleeping"\n\
    sleep 2\n\
    done\n\
    echo "Running migrations..."\n\
    python manage.py migrate --noinput\n\
    echo "Collecting static files..."\n\
    python manage.py collectstatic --noinput\n\
    echo "Starting Gunicorn with optimized settings..."\n\
    exec gunicorn config.asgi:application \
    -k uvicorn.workers.UvicornWorker \
    --bind 0.0.0.0:8000 \
    --workers 2 \
    --threads 4 \
    --worker-connections 1000 \
    --timeout 300 \
    --graceful-timeout 30 \
    --max-requests 10000 \
    --max-requests-jitter 1000 \
    --access-logfile - \
    --error-logfile - \
    --log-level info\n\
    ' > /app/start.sh && chmod +x /app/start.sh

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:8000/admin/ || exit 1

# Default command
CMD ["/app/start.sh"]

