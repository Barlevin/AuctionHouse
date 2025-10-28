# Stage 1: Build React frontend
FROM node:18-alpine AS builder
WORKDIR /app/client

# Install dependencies needed for building
RUN apk add --no-cache git

# Copy package files and install dependencies
COPY client/package*.json ./
RUN npm ci --silent

# Copy source code
COPY client/ ./

# Build the React app with verbose output
RUN npm run build 2>&1 || (echo "Build failed, showing error:" && cat /tmp/build.log && exit 1)

# Verify build was created
RUN ls -la build/ && test -f build/index.html && echo "Build verification successful"

# Stage 2: Setup backend
FROM node:18-alpine
WORKDIR /app

# Install dependencies for server
COPY server/package*.json ./server/
WORKDIR /app/server
RUN npm ci --only=production --silent

# Copy server code
COPY server/ ./

# Copy React build from builder stage
COPY --from=builder /app/client/build ./client/build/

# Verify the build files exist
RUN ls -la client/build/ && test -f client/build/index.html && echo "Server build verification successful"

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
