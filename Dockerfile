FROM node:lts-alpine

WORKDIR /app

# Dependencies
COPY package*.json ./
RUN npm ci

# Bundle
COPY . .
EXPOSE 3000
CMD ["node", "src/bin/www"]