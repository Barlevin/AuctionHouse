# Stage 1: Build React frontend
FROM node:18-alpine AS builder
WORKDIR /app

# Install dependencies needed for building
RUN apk add --no-cache git python3 make g++

# Copy client package files
COPY client/package*.json ./client/
WORKDIR /app/client

# Install all dependencies (including dev dependencies)
RUN npm install --verbose

# Copy client source code
COPY client/ ./

# Set environment variables for build
ENV CI=false
ENV GENERATE_SOURCEMAP=false

# Build the React app with detailed output
RUN npm run build --verbose

# Verify build was created
RUN echo "=== Build verification ===" && \
    ls -la build/ && \
    echo "=== Build contents ===" && \
    find build/ -type f && \
    echo "=== Checking index.html ===" && \
    test -f build/index.html && echo "SUCCESS: index.html exists" || echo "ERROR: index.html not found"

# Stage 2: Setup backend
FROM node:18-alpine
WORKDIR /app

# Install dependencies for server
COPY server/package*.json ./server/
WORKDIR /app/server
RUN npm install

# Copy server code
COPY server/ ./

# Copy React build from builder stage
COPY --from=builder /app/client/build ./client/build/

# Debug: List all files to verify structure
RUN echo "=== App directory structure ===" && \
    find /app -type f -name "*.html" && \
    echo "=== Client build directory ===" && \
    ls -la client/build/ && \
    echo "=== Checking index.html ===" && \
    test -f client/build/index.html && echo "index.html exists" || echo "index.html NOT FOUND"

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Change ownership of the app directory
RUN chown -R nodejs:nodejs /app

# Switch to non-root user
USER nodejs

# Expose port (Koyeb will set PORT environment variable)
EXPOSE 3000

# Start the server
CMD ["npm", "start"]
