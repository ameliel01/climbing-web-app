const db = require('./database.js');
const { Sequelize } = require('sequelize');

const post = db.define('post', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: Sequelize.STRING(36),
    allowNull: false,
  },
  route_id: {
    type: Sequelize.INTEGER,
    allowNull: true,
    references: {
      model: 'routes',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  content: {
    type: Sequelize.TEXT,
    allowNull: true
  }
}, {
  tableName: 'post',
  timestamps: true,
  indexes: [
    {
      name: 'idx_posts_user_id',
      fields: ['user_id']
    },
    {
        name: 'idx_posts_route_id',
        fields: ['route_id']
    }
  ]
});

module.exports = post;
