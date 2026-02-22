# Stage 1: Build
FROM node:24-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY turbo.json ./
COPY backend/package*.json ./backend/
COPY frontend/package*.json ./frontend/

# Install dependencies (ignoring scripts to speed up)
RUN npm ci --ignore-scripts

# Copy source code
COPY . .

# Generate Prisma client and build backend
WORKDIR /app/backend
RUN npx prisma generate
RUN npm run build
RUN npx tsc prisma/seed.ts --outDir dist/prisma --skipLibCheck --esModuleInterop || true

# Stage 2: Production
FROM node:24-alpine AS production

WORKDIR /app

# Install openssl for Prisma
RUN apk add --no-cache openssl

# Copy package files
COPY backend/package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev

# Copy Prisma schema and generated client
COPY --from=builder /app/backend/prisma ./prisma
COPY --from=builder /app/backend/prisma.config.ts ./prisma.config.ts

# Copy built code
COPY --from=builder /app/backend/dist ./dist

# Create uploads directory with proper permissions
RUN mkdir -p /app/uploads && chown -R node:node /app/uploads

# Copy entrypoint script
COPY backend/docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

USER node

EXPOSE 4000

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["node", "dist/src/main.js"]
