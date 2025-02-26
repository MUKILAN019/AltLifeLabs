# Use Node.js as the base image
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire backend source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Expose the port your backend runs on
EXPOSE 6003

# Command to run the application
CMD ["npm", "run", "dev"]
