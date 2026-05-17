const db = require('./database.js');
const { Sequelize } = require('sequelize');

const room = db.define('room', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: Sequelize.STRING,
    allowNull: true
  },
  type: {
    type: Sequelize.ENUM('private', 'group'),
    allowNull: false
  }
}, {
  tableName: 'room',
  freezeTableName: true,   // Empêche Sequelize de chercher "rooms"
  timestamps: true         // Active createdAt /
});
module.exports = room;
