FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Cloud Run defaults to port 8080
EXPOSE 8080

CMD ["npm", "start"]
