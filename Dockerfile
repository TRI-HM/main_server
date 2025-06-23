# Dockerfile
# Use Node.js LTS version
FROM node:20-alpine

# Create app directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Copy initialization script
COPY init-db.sh /init-db.sh
RUN chmod +x /init-db.sh

# Build TypeScript code
# RUN npm run build

# Expose port
EXPOSE 9456

# Start the application
CMD ["npm", "start"]