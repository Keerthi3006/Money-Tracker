const express = require('express');
const cors = require('cors');
require('dotenv').config();
const Transaction = require('./models/transaction.js');
const mongoose = require('mongoose');
const app = express();

app.use(cors());
app.use(express.json());

// Connect to MongoDB once at startup
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

app.get('/api/test', (req, res) => {
    res.json('test okay3');
});

// POST new transaction
app.post('/api/transaction', async (req, res) => {
    try {
        const {name, description, datetime, price} = req.body;
        
        // Validate required fields
        if (!name || !datetime || price === undefined) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const transaction = await Transaction.create({
            name, 
            description, 
            datetime, 
            price: Number(price)
        });
        
        res.json(transaction);
    } catch (error) {
        console.error('Transaction creation error:', error);
        res.status(500).json({ error: 'Failed to create transaction' });
    }
});

// GET all transactions
app.get('/api/transaction', async (req, res) => {
    try {
        const transactions = await Transaction.find().sort({datetime: -1});
        res.json(transactions);
    } catch (error) {
        console.error('Transaction fetch error:', error);
        res.status(500).json({ error: 'Failed to fetch transactions' });
    }
});

const PORT = 4060;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});