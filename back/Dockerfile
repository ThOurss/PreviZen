# /server/Dockerfile


FROM node:18-alpine

# On crée le dossier de travail dans le conteneur
WORKDIR /app

# On copie d'abord les fichiers de dépendances (pour le cache)
COPY package*.json ./

# On installe les dépendances
RUN npm install

# On copie le reste du code
COPY . .

# On expose le port (par défaut 3000 ou 5000 pour Express)
EXPOSE 5000

# On lance node directement 
CMD ["node", "serveur.js"]