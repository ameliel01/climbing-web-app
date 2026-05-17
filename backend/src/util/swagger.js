const swaggerAutogen = require('swagger-autogen')();
const path = require('path');
const glob = require('glob');

const outputFile = path.join(__dirname, '../../swagger_output.json');
let allFiles = glob.sync(path.join(__dirname, '../routes/*.js'));
const endpointsFiles = allFiles.filter(file => !file.includes('router.js'));


const doc = {
  info: {
    title: 'REST API',
    description: '',
    version: '1.0.0',
  },
  host: 'localhost:8000',
  basePath: '/api',
  schemes: ['http'],
  securityDefinitions: {
    apiKeyAuth: {
      type: 'apiKey',
      in: 'header',
      name: 'x-access-token',
      description: 'Token JWT de l\'utilisateur'
    }
  }
};

swaggerAutogen(outputFile, endpointsFiles, doc);
