const db = require('./database');
const { Sequelize } = require('sequelize');

const Like = db.define('Like', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: Sequelize.STRING(36),
    allowNull: false,
  },
  post_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'post',
      key: 'id'
    },
    onDelete: 'CASCADE'
  }
}, {
  tableName: 'like',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: [ 'user_id','post_id']
    }
  ]
});

module.exports = Like;
