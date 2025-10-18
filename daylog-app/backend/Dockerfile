FROM oven/bun:1

WORKDIR /app

# Set production environment
ENV NODE_ENV=production

# Copy package files
COPY package.json bun.lock ./

# Install dependencies
RUN bun install

# Copy source code
COPY . .

# Build the application
RUN bun run build

# Expose port
EXPOSE 3000

# Start the application
CMD ["bun", "run", "start"]
