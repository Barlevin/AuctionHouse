# Stage 1: Build React frontend
FROM node:18-alpine AS builder
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client/ ./
RUN npm run build

# Stage 2: Setup backend
FROM node:18-alpine
WORKDIR /app

# Copy server files and install dependencies
COPY server/package*.json ./server/
WORKDIR /app/server
RUN npm install

# Copy rest of server code
COPY server/ ./

# Copy React build from builder stage
COPY --from=builder /app/client/build ./client/build/

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001
USER nodejs

# Expose port (Koyeb will set PORT environment variable)
EXPOSE 3000

# Start the server
CMD ["npm", "start"]
