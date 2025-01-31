# Step 1: Build the React app
# Use an official Node.js image as the base image for building
FROM node:14-alpine as build

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json for dependency installation
COPY package*.json ./ 

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the React app for production
RUN npm run build

# Step 2: Serve the React app using Nginx
# Use the official Nginx image as the base for serving the built files
FROM nginx:alpine

# Copy the build files from the previous stage into the Nginx container
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80 to the outside world
EXPOSE 3001

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]

