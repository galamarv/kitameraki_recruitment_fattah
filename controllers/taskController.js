const { ObjectId } = require('mongodb');
const { validateCreateTask, validateUpdateTask, validateTaskId } = require('../validation/taskValidation');

// Get all tasks with optional filters and pagination (GET /api/tasks)
exports.getTasks = async (req, res, db) => {
  const { status, priority, sortBy = 'dueDate', sortOrder = 'asc', limit = 10, skip = 0 } = req.query;

  // Build query filters based on the parameters
  const match = {};
  if (status) match.status = status;
  if (priority) match.priority = priority;

  const sortOptions = {};
  sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;  // Ascending (1) or Descending (-1)

  try {
    const tasks = await db.collection('tasks')
      .find(match)
      .sort(sortOptions)
      .skip(parseInt(skip))
      .limit(parseInt(limit))
      .toArray();

    res.send(tasks);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

// Create a new task (POST /api/tasks)
exports.createTask = async (req, res, db) => {
  const { error } = validateCreateTask(req.body);  // Validate and sanitize the inputs
  if (error) {
    return res.status(400).send({ errors: error.details.map(err => err.message) });
  }

  const task = {
    title: req.body.title,
    description: req.body.description || '',
    dueDate: req.body.dueDate ? new Date(req.body.dueDate) : null,
    priority: req.body.priority || 'low',
    status: req.body.status || 'pending',
    subtasks: req.body.subtasks || []
  };

  try {
    const result = await db.collection('tasks').insertOne(task);
    const insertedTask = await db.collection('tasks').findOne({ _id: result.insertedId });
    res.status(201).send(insertedTask);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

// Get a task by ID (GET /api/tasks/:id)
exports.getTaskById = async (req, res, db) => {
  const { error } = validateTaskId(req.params.id);  // Validate the ID
  if (error) {
    return res.status(400).send({ error: 'Invalid task ID' });
  }

  try {
    const objectId = new ObjectId(req.params.id);
    const task = await db.collection('tasks').findOne({ _id: objectId });

    if (!task) {
      return res.status(404).send({ error: 'Task not found' });
    }

    res.send(task);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

// Update a task by ID (PATCH /api/tasks/:id)
exports.updateTask = async (req, res, db) => {
     // Validate the ID
     if (!ObjectId.isValid(req.params.id)) {
       return res.status(400).send({ error: 'Invalid task ID' });
     }
   
     const objectId = new ObjectId(req.params.id);
   
     // Proceed with task update
     try {
       const result = await db.collection('tasks').updateOne(
         { _id: objectId },
         { $set: req.body }
       );
   
       if (result.matchedCount === 0) {
         return res.status(404).send({ error: 'Task not found' });
       }
   
       const updatedTask = await db.collection('tasks').findOne({ _id: objectId });
       res.send(updatedTask);
     } catch (error) {
       res.status(500).send({ error: error.message });
     }
};
   
// Delete a task by ID (DELETE /api/tasks/:id)
exports.deleteTask = async (req, res, db) => {
  const { error } = validateTaskId(req.params.id);  // Validate the ID
  if (error) {
    return res.status(400).send({ error: 'Invalid task ID' });
  }

  const objectId = new ObjectId(req.params.id);

  try {
    const existingTask = await db.collection('tasks').findOne({ _id: objectId });

    if (!existingTask) {
      return res.status(404).send({ error: 'Task not found' });
    }

    await db.collection('tasks').deleteOne({ _id: objectId });

    res.send({ message: 'Task successfully deleted', deletedTask: existingTask });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};
