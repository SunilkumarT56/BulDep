
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


COPY package*.json ./
RUN npm ci --only=production


COPY --from=builder /app/dist ./dist



RUN chown -R node:node /app

ENV PORT=5001


CMD ["node", "dist/index.js"]