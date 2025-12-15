FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

FROM node:18-alpine
WORKDIR /app
COPY --from=build /app .
RUN npm prune --omit=dev
EXPOSE 3000
CMD ["node", "server.js"]
