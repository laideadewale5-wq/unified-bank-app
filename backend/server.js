const express = require('express');
const cors = require('cors');

const app = express();
// AWS ECS often uses port 80 or 8080. We use a fallback just in case.
const PORT = process.env.PORT || 8080; 

// Middleware
app.use(cors()); // Allows your Vercel frontend to make requests here
app.use(express.json());

// Mock Data: Simulating different bank accounts
const mockAccounts = [
    { id: 1, bank: "Chase", type: "Checking", balance: 1250.50 },
    { id: 2, bank: "Amex", type: "Credit Card", balance: -450.00 },
    { id: 3, bank: "Ally", type: "Savings", balance: 5000.00 }
];

// Endpoint to fetch unified accounts
app.get('/api/accounts', (req, res) => {
    res.json(mockAccounts);
});

// IMPORTANT FOR DEVOPS: Health check endpoint for AWS ECS
app.get('/health', (req, res) => {
    res.status(200).send('OK'); 
});

app.listen(PORT, () => {
    console.log(`Backend API running on port ${PORT}`);
});