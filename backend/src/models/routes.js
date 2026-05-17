const Sequelize = require('sequelize')
const db = require('./database.js')

const TYPE_CHOICES = ['Indoor', 'Outdoor'];
const TYPE_OF_ROUTE_CHOICES = ['Dalle', 'Dévers', 'Verticale', 'Toit', 'Cheminée', 'Dièdre'];
const COTATION_CHOICES = [
    '4a', '4b', '4c',
    '5a', '5b', '5c',
    '6a', '6b', '6c',
    '7a', '7b', '7c',
    '8a', '8b', '8c',
    '9a', '9b', '9c'
];

const routes = db.define('routes', {
    id: {
        primaryKey: true,
        type: Sequelize.INTEGER,
        autoIncrement: true
    },
    userId: {
        type: Sequelize.STRING(128),
        required: true,
        maxlength: 100
    },
    date: {
        type: Sequelize.DATE,
        required: true
    },
    route: {
        type: Sequelize.STRING(128),
        enum: TYPE_CHOICES,
        default: TYPE_CHOICES[0]
    },
    typeOfRoute: {
        type: Sequelize.STRING(128),
        enum: TYPE_OF_ROUTE_CHOICES,
        default: TYPE_OF_ROUTE_CHOICES[2]
    },
    cotation: {
        type: Sequelize.STRING(128),
        required: true,
        enum: COTATION_CHOICES,
        default: COTATION_CHOICES[0]
    },
    feeling: {
        type: Sequelize.STRING(128),
    }
}, { timestamps: false })
module.exports = routes