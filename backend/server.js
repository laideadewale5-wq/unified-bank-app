const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 8080; 

app.use(cors()); 
app.use(express.json());

// 1. Setup the Database Connection String (Angle brackets removed!)
const MONGO_URI = 'mongodb+srv://laideadewale5_db_user:Iwillsing123@cluster0.ogrjsbh.mongodb.net/bankDB?retryWrites=true&w=majority&appName=Cluster0';

// 2. Connect to MongoDB Atlas
mongoose.connect(MONGO_URI)
    .then(() => console.log('✅ Connected to MongoDB Atlas!'))
    .catch(err => console.error('❌ MongoDB connection error:', err));

// 3. Define the Blueprint (Schema) for an Account
const accountSchema = new mongoose.Schema({
    bank: String,
    type: String,
    balance: Number
});

// 4. Create the Model
const Account = mongoose.model('Account', accountSchema);

// GET Route: Fetch accounts from MongoDB
app.get('/api/accounts', async (req, res) => {
    try {
        const accounts = await Account.find(); // Pulls all records from DB
        res.json(accounts);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch accounts' });
    }
});

// POST Route: Save a new account to MongoDB
app.post('/api/accounts', async (req, res) => {
    try {
        const newAccount = new Account({
            bank: req.body.bank,
            type: req.body.type,
            balance: parseFloat(req.body.balance)
        });
        
        const savedAccount = await newAccount.save(); // Saves to DB permanently!
        res.status(201).json(savedAccount);
    } catch (err) {
        res.status(500).json({ error: 'Failed to save account' });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).send('OK'); 
});

app.listen(PORT, () => {
    console.log(`Backend API running on port ${PORT}`);
});