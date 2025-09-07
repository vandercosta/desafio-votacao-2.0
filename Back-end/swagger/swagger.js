const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API MeuApp',
      version: '1.0.0',
      description: 'API de exemplo com usuários e data',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
    servers: [{ url: 'http://localhost:3000' }],
  },
  apis: ['./routes/*.js'], // lê comentários das rotas
};

module.exports = swaggerJsdoc(options);
