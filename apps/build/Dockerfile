
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install
RUN npm install typescript --save-dev  


COPY . .

RUN npx tsc -b


FROM node:18-alpine


WORKDIR /app
RUN apk add --no-cache docker-cli git



RUN mkdir -p /app/output
RUN mkdir -p /app/builded-folder

COPY package*.json ./
RUN npm ci --only=production


COPY --from=builder /app/dist ./dist



RUN chown -R node:node /app

ENV NODE_ENV=production
ENV OUTPUT_DIR=/app/output


CMD ["node", "dist/index.js"]