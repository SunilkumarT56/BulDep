# -----------------------------
# 1. Builder Stage
# -----------------------------
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npx tsc -b


# -----------------------------
# 2. Runtime Stage
# -----------------------------
FROM node:18-alpine

WORKDIR /app

# Install git
RUN apk update && apk add --no-cache git

# Create output directory
RUN mkdir -p /app/output

# Copy package files AS ROOT
COPY package*.json ./

# Fix permissions BEFORE switching user
RUN chown -R node:node /app

# Switch user
USER node

# Install production deps
RUN npm install --only=production

# Copy compiled JS
COPY --from=builder /app/dist ./dist

ENV NODE_ENV=production
EXPOSE 6000

CMD ["node", "dist/index.js"]