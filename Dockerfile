FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache python3 make g++
RUN npm install -g @anthropic-ai/claude-code
RUN npm init -y && npm install express

COPY server.js .

EXPOSE 3000

CMD ["node", "server.js"]