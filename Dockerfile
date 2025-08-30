# Multi-stage Dockerfile for Ink Loves Tinder Dating App
# Stage 1: Build the React frontend
FROM node:18-alpine AS frontend-builder

WORKDIR /app/client

# Copy package files
COPY client/package*.json ./

# Install frontend dependencies
RUN npm install

# Copy frontend source code
COPY client/src ./src
COPY client/public ./public
COPY client/tailwind.config.js ./

# Build the React app
RUN npm run build

# Stage 2: Build the Node.js backend
FROM node:18-alpine AS backend-builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install backend dependencies
RUN npm install

# Copy backend source code
COPY server ./server

# Stage 3: Production runtime
FROM node:18-alpine AS production

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create app user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

WORKDIR /app

# Copy built frontend from frontend-builder
COPY --from=frontend-builder /app/client/build ./client/build

# Copy backend from backend-builder
COPY --from=backend-builder /app/node_modules ./node_modules
COPY --from=backend-builder /app/server ./server

# Copy package files
COPY package*.json ./

# Copy environment file template
COPY env.example .env

# Set ownership to nodejs user
RUN chown -R nodejs:nodejs /app

# Switch to nodejs user
USER nodejs

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/api/auth/me', (res) => { process.exit(res.statusCode === 401 ? 0 : 1) })" || exit 1

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start the application
CMD ["node", "server/index.js"]
