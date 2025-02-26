# Use an official Node.js image as the base
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Clear npm cache
RUN npm cache clean --force

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Apply migrations (for production, use `prisma migrate deploy`)
RUN npx prisma migrate deploy

# Expose the port your app runs on
EXPOSE 6003

# Start the application
CMD ["npm","run", "dev"]