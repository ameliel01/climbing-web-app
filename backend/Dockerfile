# Étape 1 : Builder l'app
FROM node:18 AS build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Étape 2 : Servir le build avec HTTPS
FROM node:18-slim

WORKDIR /app
RUN npm install -g serve

# Copie du build
COPY --from=build /app .

# Copie des certificats SSL dans le conteneur
COPY cert.pem /etc/ssl/certs/
COPY key.pem /etc/ssl/private/

# Expose le port HTTPS (8000)
EXPOSE 8000

# Commande pour démarrer l'app en HTTPS
CMD ["npm", "start"]
