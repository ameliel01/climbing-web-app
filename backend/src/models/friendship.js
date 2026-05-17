const Sequelize = require('sequelize');
const db = require('./database.js');
const STATUS = ['pending','accepted','rejected','blocked'];

const friendship = db.define('friendship', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    follower_id: {
        type: Sequelize.STRING(36),
        allowNull: false
    },
    followed_id: {
        type: Sequelize.STRING(36),
        allowNull: false
    },
    status: {
            type: Sequelize.STRING(128),
            required: true,
            enum: STATUS,
            default: STATUS[0]
        },
}, {
    tableName:'friendship',
    indexes: [
        {
            unique: true,
            fields: ['follower_id', 'followed_id']
        }
    ]
}, { timestamps: false });
module.exports = friendship;
