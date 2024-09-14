const swaggerJsDoc = require('swagger-jsdoc');

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Task Management API',
      version: '1.0.0',
      description: 'API for managing tasks',
      contact: {
        name: 'Fattah Rizki',
        email: 'fattah.rizki@gmail.com',
      },
      servers: [
        {
          url: 'http://localhost:3000/api',
          description: 'Development server',
        },
      ],
    },
  },
  apis: ['./swaggerDocs/tasks.yaml'],  // Point to YAML file here
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
module.exports = swaggerDocs;
