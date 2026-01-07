FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
COPY tsconfig.json ./
RUN npm install
COPY . .
RUN npx tsc
CMD node dist/index.js
EXPOSE 3000