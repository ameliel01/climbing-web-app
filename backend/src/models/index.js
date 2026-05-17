const Sequelize = require('sequelize');
const db = require('./database'); // ta connexion Sequelize ici

const Post = require('./post'); // ← Ce fichier contient déjà le .define()
const Route = require('./routes');
const Comment = require('./comment');
const Like = require('./like');
const Room = require('./room');
const Message = require('./message');
const RoomUser = require('./roomuser');
const User = require('./user');

Route.hasOne(Post, { foreignKey: 'route_id', onDelete: 'CASCADE' });

Post.belongsTo(Route, { foreignKey: 'route_id', onDelete: 'CASCADE' });
Post.hasMany(Comment, { foreignKey: 'post_id', as: 'comment' });
Post.hasMany(Like, { foreignKey: 'post_id', as: 'like' });

Comment.belongsTo(Post, { foreignKey: 'post_id' });

Room.belongsToMany(User, { through: RoomUser, foreignKey: 'roomId', otherKey: 'userId' });
Room.hasMany(Message, { foreignKey: 'roomId', onDelete: 'CASCADE' });

RoomUser.belongsTo(Room, { foreignKey: 'roomId', onDelete: 'CASCADE'  });

Message.belongsTo(User, { foreignKey: 'userId' });
Message.belongsTo(Room, { foreignKey: 'roomId' });

Like.belongsTo(Post, { foreignKey: 'post_id' });

User.belongsToMany(Room, { through: RoomUser, foreignKey: 'userId', otherKey: 'roomId' });
User.hasMany(Message, { foreignKey: 'userId' });



module.exports = {
  sequelize: db,
  Room,
  RoomUser,
  User,
  Message,
  Sequelize,
  Comment,
  Like,
  Post,
  Route
};

