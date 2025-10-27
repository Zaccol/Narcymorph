# Base stage
FROM node:18-alpine AS base
WORKDIR /app

# Install dependencies for Prisma (OpenSSL)
RUN apk add --no-cache openssl

# Dependencies stage
FROM base AS dependencies
COPY package*.json ./
RUN npm ci

# Development stage
FROM base AS development
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .

# Generate Prisma Client
RUN npx prisma generate

EXPOSE 4000
CMD ["npm", "run", "start:dev"]

# Build stage
FROM base AS build
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build the application
RUN npm run build

# Production dependencies
RUN npm ci --only=production && npm cache clean --force

# Production stage
FROM base AS production
ENV NODE_ENV=production

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma
COPY package*.json ./

# Generate Prisma Client for production
RUN npx prisma generate

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001
USER nestjs

EXPOSE 4000
CMD ["node", "dist/main.js"]
