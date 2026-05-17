# Étape 1 : Builder l'app
FROM node:18 AS build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Étape 2 : Servir le build via 'serve' en HTTPS
FROM node:18-slim

WORKDIR /app
RUN npm install -g serve

# Copie du build
COPY --from=build /app/build .

# Copie des certificats SSL
COPY cert.pem .
COPY key.pem .

# Serveur écoute sur le port HTTPS (443)
EXPOSE 443

# Commande avec HTTPS activé
CMD ["serve", "-s", ".", "-l", "tcp://0.0.0.0:443", "--ssl-cert", "cert.pem", "--ssl-key", "key.pem"]
