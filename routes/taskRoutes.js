const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

module.exports = (db) => {
  // Get all tasks with optional filters and pagination
  router.get('/tasks', (req, res) => taskController.getTasks(req, res, db));

  // Get a task by ID
  router.get('/tasks/:id', (req, res) => taskController.getTaskById(req, res, db));

  // Create a new task
  router.post('/tasks', (req, res) => taskController.createTask(req, res, db));

  // Update a task by ID
  router.patch('/tasks/:id', (req, res) => taskController.updateTask(req, res, db));

  // Delete a task by ID
  router.delete('/tasks/:id', (req, res) => taskController.deleteTask(req, res, db));

  return router;
};
