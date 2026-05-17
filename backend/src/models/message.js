
const db = require('./database.js'); // adapte ce chemin selon ton projet
const { Sequelize } = require('sequelize');

const message = db.define('message', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  content: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  userId: {
    type: Sequelize.UUID,
    allowNull: false
  },
  roomId: {
    type: Sequelize.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'message',
  timestamps: true,          // createdAt & updatedAt
  freezeTableName: true      // évite la pluralisation en 'messages'
});

module.exports = message;
