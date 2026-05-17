// Charger les variables d'environnement depuis le fichier .env
require('dotenv').config();

const Sequelize = require('sequelize');

// Construire la configuration de la base de données à partir des variables d'environnement
const DB = {
  dialect: process.env.DB_DIALECT || 'postgres', // Utilisez 'postgres' par défaut si DB_DIALECT n'est pas défini
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  username: process.env.DB_USERNAME || 'keycloak',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_DATABASE || 'keycloak',
  logging: (...msg) => console.log(msg)
};




const db = new Sequelize(DB);

module.exports = db;

