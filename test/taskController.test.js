const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { MongoClient } = require('mongodb');
const express = require('express');
const { ObjectId } = require('mongodb');  
const taskRoutes = require('../routes/taskRoutes');

let mongoServer;
let app;
let db;
let connection;

describe('Task Management API', () => {
  // Set up the in-memory MongoDB server and Express app before all tests
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    connection = await MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    db = connection.db();

    app = express();
    app.use(express.json());
    app.use('/api', taskRoutes(db));
  });

  // Close MongoDB connection after all tests
  afterAll(async () => {
    await connection.close();
    await mongoServer.stop();
  });

  // Clear the tasks collection before each test
  beforeEach(async () => {
    await db.collection('tasks').deleteMany({});
  });

  // Test for GET /api/tasks
  describe('GET /api/tasks', () => {
    it('should return an empty array when no tasks exist', async () => {
      const response = await request(app).get('/api/tasks');
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual([]);
    });

    it('should return tasks when they exist', async () => {
      await db.collection('tasks').insertOne({ title: 'Test Task', status: 'pending', dueDate: new Date(), priority: 'medium' });

      const response = await request(app).get('/api/tasks');
      expect(response.statusCode).toBe(200);
      expect(response.body.length).toBe(1);
      expect(response.body[0].title).toBe('Test Task');
    });
  });

  // Test for POST /api/tasks
  describe('POST /api/tasks', () => {
    it('should create a new task', async () => {
      const task = {
        title: 'New Task',
        description: 'This is a new task',
        dueDate: '2024-12-31',
        priority: 'high',
        status: 'pending',
        subtasks: []
      };

      const response = await request(app).post('/api/tasks').send(task);
      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty('title', 'New Task');
      expect(response.body).toHaveProperty('status', 'pending');
    });

    it('should return validation error if required fields are missing', async () => {
      const task = {
        description: 'This is an incomplete task'
      };

      const response = await request(app).post('/api/tasks').send(task);
      expect(response.statusCode).toBe(400);
      expect(response.body.errors).toContain('Title is a required field.');
    });
  });

  // Test for GET /api/tasks/:id
  describe('GET /api/tasks/:id', () => {
    it('should return a task by ID', async () => {
      const task = { title: 'Test Task', status: 'pending', dueDate: new Date(), priority: 'medium' };
      const result = await db.collection('tasks').insertOne(task);

      const response = await request(app).get(`/api/tasks/${result.insertedId}`);
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('title', 'Test Task');
    });

    it('should return 404 if task is not found', async () => {
      const fakeId = '614c2f79a7a6a9e64b9e9331';
      const response = await request(app).get(`/api/tasks/${fakeId}`);
      expect(response.statusCode).toBe(404);
      expect(response.body).toHaveProperty('error', 'Task not found');
    });
  });

  // Test for PATCH /api/tasks/:id
  describe('PATCH /api/tasks/:id', () => {
    it('should update a task by ID', async () => {
      const task = { title: 'Task to Update', status: 'pending', dueDate: new Date(), priority: 'low' };
      const result = await db.collection('tasks').insertOne(task);
  
      const response = await request(app).patch(`/api/tasks/${result.insertedId}`).send({ status: 'completed' });
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('status', 'completed');
    });
  
    it('should return 404 if task to update is not found', async () => {
      const fakeId = new ObjectId();  // Generate a valid, non-existent ObjectId
      const response = await request(app).patch(`/api/tasks/${fakeId}`).send({ status: 'completed' });
      expect(response.statusCode).toBe(404);
      expect(response.body).toHaveProperty('error', 'Task not found');
    });
  });

  // Test for DELETE /api/tasks/:id
  describe('DELETE /api/tasks/:id', () => {
    it('should delete a task by ID', async () => {
      const task = { title: 'Task to Delete', status: 'pending', dueDate: new Date(), priority: 'medium' };
      const result = await db.collection('tasks').insertOne(task);

      const response = await request(app).delete(`/api/tasks/${result.insertedId}`);
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('message', 'Task successfully deleted');
    });

    it('should return 404 if task to delete is not found', async () => {
      const fakeId = '614c2f79a7a6a9e64b9e9331';
      const response = await request(app).delete(`/api/tasks/${fakeId}`);
      expect(response.statusCode).toBe(404);
      expect(response.body).toHaveProperty('error', 'Task not found');
    });
  });
});
