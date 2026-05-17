const db= require('./database.js'); 
const Sequelize = require('sequelize');

const user = db.define('user', {
  id: {
    type: Sequelize.UUID,
    allowNull: false,
    unique: true,
    primaryKey : true
  },
  email: Sequelize.STRING,
  username: Sequelize.STRING,
  first_name: Sequelize.STRING,
  last_name: Sequelize.STRING,
}, {
  tableName: 'user',     
  timestamps: false,
  freezeTableName: true
});

module.exports = user;
