const express = require('express');
const connectToMongoDB = require('./config/db');
const taskRoutes = require('./routes/taskRoutes');
const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('./swagger'); 
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Swagger UI Setup
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

(async function () {
  const db = await connectToMongoDB();  // Wait for MongoDB to connect

  // Routes
  app.use('/api', taskRoutes(db));      // Pass the connected db to routes

  // Basic route for testing
  app.get('/', (req, res) => {
    res.send('Task Management API');
  });

  // Start the server
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
})();
