# Stage 1: Build React frontend
FROM node:18 AS builder
WORKDIR /app
COPY client/package*.json ./client/
RUN cd client && npm install
COPY client/ ./client
RUN cd client && npm run build

# Stage 2: Setup backend
FROM node:18
WORKDIR /app

# Copy server files and install dependencies
COPY server/package*.json ./server/
WORKDIR /app/server
RUN npm install

# Copy rest of server code
COPY server/ ./ 

# Copy React build from builder
COPY --from=builder /app/client/build ../client/build/

# Expose port
EXPOSE 3000

# Start the server
CMD ["npm", "start"]
