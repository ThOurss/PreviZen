# /client/Dockerfile

FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Port par défaut de React
EXPOSE 3000

# Démarrage
CMD ["npm", "start"]