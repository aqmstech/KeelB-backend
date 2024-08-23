FROM node:16.17.0

# Set working directory
WORKDIR /cancer-facility-backend

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Run any necessary build commands
RUN npm run compile

# Expose the port
EXPOSE 8000

# Install PM2 globally
RUN npm install -g pm2

# Start the application with PM2
CMD ["pm2-runtime", "start", "build/index.js", "--name", "cancer-facility-backend"]