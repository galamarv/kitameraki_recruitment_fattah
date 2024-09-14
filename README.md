# Task Management API

This is a simple Task Management API built with **Node.js**, **Express**, and **MongoDB**. It supports creating, updating, fetching, and deleting tasks, and uses **Swagger** for API documentation.

## Features

- **CRUD operations** for tasks
- Input validation with **Joi**
- **MongoDB** for data storage
- API documentation using **Swagger (OpenAPI)**
- In-memory testing with **Jest** and **mongodb-memory-server**

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or higher)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) or a local MongoDB instance

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/galamarv/kitameraki_recruitment_fattah.git
cd kitameraki_recruitment_fattah
```

### 2. Install dependencies

```bash
npm install
```
### 3. Create a .env file
Create a .env file in the root directory and add your MongoDB connection string:
```bash
MONGO_URL=mongodb+srv://<username>:<password>@cluster0.mongodb.net/<dbname>?retryWrites=true&w=majority
PORT=3000
```

## Running the Application

You can run the application in two different modes:

### 1. Start Mode
This runs the application in a production-like environment.
```bash
npm start
```

### 2. Development Mode
This runs the application with nodemon, allowing for automatic server restarts when files are modified.
```bash
npm run dev
```

## Running Tests
The project uses Jest for testing, including in-memory MongoDB provided by mongodb-memory-server.

To run the tests:
```bash
npm test
```
This will run all the tests and generate a report in the terminal.

## API Documentation
API documentation is available via Swagger. After starting the application, you can access the Swagger UI at:
```bash
http://localhost:3000/api-docs
```
This will provide an interactive interface for testing the API.

## Project Structure
```bash
├── config
│   └── db.js              # MongoDB connection setup
├── controllers
│   └── taskController.js   # Task-related logic
├── routes
│   └── taskRoutes.js       # API route definitions
├── swaggerDocs
│   └── tasks.yaml          # OpenAPI specification for the API
├── validation
│   └── taskValidation.js   # Input validation using Joi
├── tests
│   └── taskController.test.js # Jest tests for the API
├── .env                    # Environment variables (not included in repo)
├── app.js                  # Main entry point of the application
├── swagger.js              # Swagger configuration
├── package.json            # Project dependencies and scripts
└── README.md               # Project documentation
```

