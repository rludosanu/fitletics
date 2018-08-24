# Build on a Node.js 8 Alpine
# FROM resin/raspberry-pi-alpine-node
FROM node:alpine

# Create working directory for app
WORKDIR /app

# Copy files
COPY . .

# Install node modules
RUN ["npm", "install"]

# Open port 4000
EXPOSE 4000

# To be executed on container startup
CMD ["npm", "start"]
