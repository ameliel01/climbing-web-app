const db = require('./database.js');
const { Sequelize } = require('sequelize');

const roomuser = db.define('roomuser', {
  roomId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    onDelete: 'CASCADE'
  
  },
  userId: {
    type: Sequelize.UUID,
    allowNull: false
  },
  role: {
    type: Sequelize.STRING,
    allowNull: true,
    validate: {
      isIn: [['administrator', 'member']]
    }
  }
}, {
  tableName: 'roomuser',
  timestamps: false,
  freezeTableName: true
});
module.exports = roomuser;
