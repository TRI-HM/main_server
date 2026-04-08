# Dockerfile - Multi-stage build for minimal image size
# Stage 1: Build stage
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Install all dependencies (including dev for ts-node compilation)
RUN npm ci --silent

# Copy source code
COPY src/ ./src/

# Build TypeScript (if needed later)
# RUN npm run build

# Stage 2: Production stage
FROM node:20-alpine AS production

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

WORKDIR /usr/src/app

# Copy from builder stage
COPY --from=builder --chown=nextjs:nodejs /usr/src/app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /usr/src/app/package*.json ./
COPY --chown=nextjs:nodejs . .

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 9456

# Use dumb-init and limit Node.js memory
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "--max-old-space-size=400", "-r", "ts-node/register", "src/app.ts"]