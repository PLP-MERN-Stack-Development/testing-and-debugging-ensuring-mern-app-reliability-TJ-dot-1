const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Import middleware
const { logger, requestLogger } = require('./middleware/logger');
const { errorHandler, asyncHandler, notFoundHandler } = require('./middleware/errorHandler');

// Middleware
app.use(requestLogger);
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'MERN Server is running!' });
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// User routes
const User = require('./models/User');

app.get('/api/users', asyncHandler(async (req, res) => {
  const users = await User.find().select('-password');
  res.json(users);
}));

app.post('/api/users', asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    const error = new Error('Email already exists');
    error.status = 400;
    throw error;
  }

  // Create new user
  const user = new User({ name, email, password });
  await user.save();

  // Return user without password
  const userResponse = user.toObject();
  delete userResponse.password;

  res.status(201).json(userResponse);
}));

// Bug routes
const Bug = require('./models/Bug');

app.get('/api/bugs', asyncHandler(async (req, res) => {
  const bugs = await Bug.find();
  res.json(bugs);
}));

app.post('/api/bugs', asyncHandler(async (req, res) => {
  const { title, description, status } = req.body;
  const bug = new Bug({ title, description, status });
  await bug.save();
  res.status(201).json(bug);
}));

app.put('/api/bugs/:id', asyncHandler(async (req, res) => {
  const { title, description, status } = req.body;
  const bug = await Bug.findByIdAndUpdate(
    req.params.id,
    { title, description, status },
    { new: true, runValidators: true }
  );
  if (!bug) {
    const error = new Error('Bug not found');
    error.status = 404;
    throw error;
  }
  res.json(bug);
}));

app.delete('/api/bugs/:id', asyncHandler(async (req, res) => {
  const bug = await Bug.findByIdAndDelete(req.params.id);
  if (!bug) {
    const error = new Error('Bug not found');
    error.status = 404;
    throw error;
  }
  res.json({ message: 'Bug deleted successfully' });
}));

// Database connection
const connectDB = async () => {
  try {
    if (process.env.MONGODB_URI) {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('MongoDB Connected');
    } else {
      console.error('No MongoDB URI provided');
    }
  } catch (error) {
    console.error('Database connection failed:', error.message);
  }
};

connectDB();

// Error handling middleware (must be last)
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
    console.log(`👥 Users API: http://localhost:${PORT}/api/users`);
    console.log(`🐛 Bugs API: http://localhost:${PORT}/api/bugs`);
  });
}

module.exports = app;