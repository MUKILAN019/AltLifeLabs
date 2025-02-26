# Use Node.js as the base image
FROM node:18

# Set the working directory inside the container
WORKDIR /src

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire frontend source code
COPY . .
# Expose the frontend port
EXPOSE 5173

# Command to serve the frontend using a simple server
CMD ["npm", "run", "dev"]
