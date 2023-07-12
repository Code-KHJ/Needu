const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Needu server API',
    version: '1.0.0',
    description: 'Needu server API DOCs'
  },
  host: 'http://localhost:3000', //'https://needu.site',
  basePath: '/',
};

const options = {
  swaggerDefinition,
  apis: [__dirname + '/../routes/*.js']
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;