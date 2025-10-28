# Use Node.js base image
FROM node:18

# Set working directory
WORKDIR /app

# Copy server files and install dependencies
COPY server/package*.json ./server/
WORKDIR /app/server
RUN npm install

# Copy the rest of the server code
COPY server/ ./ 

# Copy React build from client
COPY client/build/ ../client/build/

# Expose the port (Koyeb will provide via PORT env)
EXPOSE 3000

# Run the server
CMD ["npm", "start"]
