# Base image
FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm install

# Generate Prisma client
RUN npx prisma generate

# Copy app source
COPY . .

# Build app
RUN npm run build

# Expose port
EXPOSE 8888

# Start command will be provided by docker-compose