# Step 1: Use a lightweight Node.js image
FROM node:20-alpine

# Step 2: Set the working directory inside the container
WORKDIR /app

# Step 3: Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Step 4: Copy the rest of your application code
COPY . .

# Step 5: Expose the port your app runs on
EXPOSE 8080

# Step 6: Define the command to start the app
CMD ["node", "server.js"]