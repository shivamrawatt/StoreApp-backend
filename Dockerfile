# Use Node 20 Alpine base image
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy rest of project files
COPY . .

# Expose backend port
EXPOSE 5000

# Start server
CMD ["node", "src/server.js"]