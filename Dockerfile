FROM node:18

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json first for caching
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps


# Copy all files (including src/)
COPY . . 

# Expose port 3000
EXPOSE 3000

# Start the React development server
CMD ["npm", "start"]
