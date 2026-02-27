FROM node:18-alpine

WORKDIR /app

COPY server/package*.json ./

RUN npm ci --only=production

COPY server/ ./

EXPOSE 3038

CMD ["node", "server.js"]
