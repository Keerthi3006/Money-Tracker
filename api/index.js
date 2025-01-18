// index.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const Transaction = require('./models/transaction.js');
const mongoose = require('mongoose');
const app = express();

// Middleware for CORS and JSON parsing
app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log('Request headers:', req.headers);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log('Request body:', req.body);
  }
  next();
});

// Enhanced MongoDB connection
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: 'money_tracker' // Explicitly set database name
})
.then(() => {
  console.log('Connected to MongoDB successfully');
  const sanitizedUrl = process.env.MONGO_URL.replace(
    /(mongodb\+srv:\/\/[^:]+:)([^@]+)(@.+)/,
    '$1*****$3'
  );
  console.log('Using MongoDB URL:', sanitizedUrl);
})
.catch((err) => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

// MongoDB connection event handlers
mongoose.connection.on('error', err => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

mongoose.connection.on('connected', () => {
  console.log('MongoDB reconnected');
});

// Test routes
app.get('/api/test', (req, res) => {
  res.json({
    message: 'test okay3',
    timestamp: new Date().toISOString(),
    mongoStatus: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

app.get('/api/transaction/test', (req, res) => {
  res.json({
    message: 'Transaction endpoint is accessible',
    timestamp: new Date().toISOString()
  });
});

// POST new transaction
app.post('/api/transaction', async (req, res) => {
  console.log('\n=== New Transaction Request ===');
  console.log('Received at:', new Date().toISOString());
  console.log('Request body:', req.body);

  try {
    const {name, description, datetime, price} = req.body;
    
    // Validate required fields
    if (!name || !datetime || price === undefined) {
      console.log('Validation failed - Missing fields:', { name, datetime, price });
      return res.status(400).json({
        error: 'Missing required fields',
        received: { name, datetime, price }
      });
    }

    // Price validation and conversion
    const priceNum = Number(price);
    if (isNaN(priceNum)) {
      console.log('Invalid price value:', price);
      return res.status(400).json({
        error: 'Invalid price format',
        received: price
      });
    }

    // Create transaction
    const transaction = await Transaction.create({
      name,
      description,
      datetime: new Date(datetime),
      price: priceNum
    });

    console.log('Transaction created successfully:', transaction);
    res.status(201).json(transaction);
  } catch (error) {
    console.error('Transaction creation error:', error);
    res.status(500).json({
      error: 'Failed to create transaction',
      message: error.message,
      mongoState: mongoose.connection.readyState
    });
  }
});

// GET all transactions
app.get('/api/transaction', async (req, res) => {
  console.log('\n=== Fetch Transactions Request ===');
  console.log('Received at:', new Date().toISOString());

  try {
    const transactions = await Transaction.find().sort({datetime: -1});
    console.log(`Successfully fetched ${transactions.length} transactions`);
    res.json(transactions);
  } catch (error) {
    console.error('Transaction fetch error:', error);
    res.status(500).json({
      error: 'Failed to fetch transactions',
      message: error.message,
      mongoState: mongoose.connection.readyState
    });
  }
});

// Handle undefined routes
app.use((req, res) => {
  console.log(`404 - Route not found: ${req.method} ${req.url}`);
  res.status(404).json({
    error: 'Route not found',
    path: req.url,
    method: req.method
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
});

// Start server
const PORT = 4070;
app.listen(PORT, () => {
  console.log('\n=== Server Started ===');
  console.log(`Server running on port ${PORT}`);
  console.log(`Test endpoint: http://localhost:${PORT}/api/test`);
  console.log(`MongoDB status: ${mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'}`);
  console.log('========================\n');
});

// Handle process termination
process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    console.log('MongoDB connection closed through app termination');
    process.exit(0);
  } catch (err) {
    console.error('Error during app termination:', err);
    process.exit(1);
  }
});
