global.crypto = require('crypto');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const axios = require('axios'); 

const app = express();
const PORT = process.env.PORT || 8080; 

app.use(cors()); 
app.use(express.json());

// 1. Setup the Database Connection String
const MONGO_URI = 'mongodb+srv://laideadewale5_db_user:rORLOwWHhlKu0eNm@cluster0.ogrjsbh.mongodb.net/bankDB?retryWrites=true&w=majority&appName=Cluster0';

// 2. Connect to MongoDB Atlas
mongoose.connect(MONGO_URI)
    .then(() => console.log('✅ Connected to MongoDB Atlas!'))
    .catch(err => console.error('❌ MongoDB connection error:', err));

// 3. Define the Blueprint (Schema) - 🎯 ADDED accountId
const accountSchema = new mongoose.Schema({
    accountId: String, // This will hold Mono's unique ID
    bank: String,
    type: String,
    balance: Number
});

// 4. Create the Model
const Account = mongoose.model('Account', accountSchema);

// GET Route: Fetch accounts from MongoDB
app.get('/api/accounts', async (req, res) => {
    try {
        const accounts = await Account.find();
        res.json(accounts);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch accounts' });
    }
});

// POST Route: Save a manual account to MongoDB
app.post('/api/accounts', async (req, res) => {
    try {
        const newAccount = new Account({
            bank: req.body.bank,
            type: req.body.type,
            balance: parseFloat(req.body.balance)
        });
        
        const savedAccount = await newAccount.save();
        res.status(201).json(savedAccount);
    } catch (err) {
        res.status(500).json({ error: 'Failed to save account' });
    }
});

// 🔗 POST Route: Sync Bank Account via Mono API V2
app.post('/api/mono/sync', async (req, res) => {
  const { code } = req.body;
  
  const MONO_SECRET_KEY = 'test_sk_klx1jnvxvk4awc4m8l6a'; 

  if (!code) {
    return res.status(400).json({ error: 'Mono auth code is required' });
  }

  try {
    // Step 1: Exchange the temporary frontend code for a permanent Account ID 
    const authResponse = await axios.post('https://api.withmono.com/v2/accounts/auth', 
      { code: code },
      { 
        headers: { 
            'mono-sec-key': MONO_SECRET_KEY,
            'accept': 'application/json',
            'Content-Type': 'application/json'
        } 
      }
    );
    
    const accountId = authResponse.data?.id || authResponse.data?.data?.id;

    if (!accountId) {
        return res.status(500).json({ error: 'Failed to extract Account ID from Mono' });
    }

    // Step 2: Fetch the real bank details
    const detailsResponse = await axios.get(`https://api.withmono.com/v2/accounts/${accountId}`, 
      { 
        headers: { 
            'mono-sec-key': MONO_SECRET_KEY,
            'accept': 'application/json'
        } 
      }
    );

    const payloadData = detailsResponse.data?.data || detailsResponse.data;
    const accountInfo = payloadData.account || payloadData;

    // Step 3: Format the exact data variables
    const rawBalance = accountInfo.balance ? accountInfo.balance / 100 : 0; 
    const formattedBank = accountInfo.institution?.name || accountInfo.institution?.bank_name || 'Mono Linked Bank';
    const formattedType = accountInfo.type ? accountInfo.type.replace('_', ' ') : 'Account';

    // 🎯 THE FIX: Check if the account already exists before saving!
    let existingAccount = await Account.findOne({ accountId: accountId });

    if (existingAccount) {
        // If it exists, just update the balance to the latest amount
        existingAccount.balance = rawBalance;
        const updatedAccount = await existingAccount.save();
        console.log("🔄 Updated existing account balance");
        return res.status(200).json(updatedAccount);
    } else {
        // If it does not exist, save a brand new entry
        const newAccount = new Account({
            accountId: accountId,
            bank: formattedBank,
            type: formattedType,
            balance: rawBalance
        });
        const savedAccount = await newAccount.save();
        console.log("✅ Created new bank account");
        return res.status(201).json(savedAccount);
    }

  } catch (error) {
    console.error('❌ Mono API Error:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Failed to securely sync bank account' });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).send('OK'); 
});

app.listen(PORT, () => {
    console.log(`Backend API running on port ${PORT}`);
});