const { Sequelize } = require('sequelize');
const db = require('./database.js');

const Comment = db.define('Comment', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: Sequelize.STRING(36),
    allowNull: false
  },
  post_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'post',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  content: {
    type: Sequelize.TEXT,
    allowNull: false
  }
}, {
  tableName: 'comment',
  timestamps: true
});

module.exports = Comment;
