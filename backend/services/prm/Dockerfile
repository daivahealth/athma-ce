FROM node:18-alpine AS base

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy prisma schema
COPY prisma ./prisma/

# Generate Prisma client
RUN npx prisma generate

# Copy source
COPY . .

# Build TypeScript
RUN npm run build

# Production image
FROM node:18-alpine AS production

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --production

# Copy prisma
COPY prisma ./prisma/
RUN npx prisma generate

# Copy built app
COPY --from=base /app/dist ./dist

EXPOSE 3013

CMD ["npm", "start"]
