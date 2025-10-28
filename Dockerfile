# Stage 1: Backend + React build
FROM node:22
WORKDIR /app

# Copy backend
COPY server ./server
WORKDIR /app/server
RUN npm install

# Copy React build
COPY client/build ../client/build

EXPOSE 3000
CMD ["npm", "start"]
