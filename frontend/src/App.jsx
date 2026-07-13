import { useState, useEffect } from 'react';
import MonoConnectButton from './MonoConnectButton'; // <-- Imports your custom Mono Widget button

function App() {
  const [accounts, setAccounts] = useState([]);
  
  // State variables to hold the manual form input values
  const [bankName, setBankName] = useState('');
  const [accountType, setAccountType] = useState('');
  const [balance, setBalance] = useState('');
  
  const API_URL = 'http://bank-backend-alb-456735600.eu-west-2.elb.amazonaws.com/api/accounts';

  // Fetch accounts on initial page load
  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = () => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => setAccounts(data))
      .catch(err => console.error("Error fetching data:", err));
  };

  // Function to handle manual form submission
  const handleAddAccount = (e) => {
    e.preventDefault(); // Prevents the page from refreshing

    const newAccount = {
      bank: bankName,
      type: accountType,
      balance: balance
    };

    // Make the POST request to save a manual account
    fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newAccount)
    })
      .then(res => res.json())
      .then(() => {
        // Clear the form fields
        setBankName('');
        setAccountType('');
        setBalance('');
        // Re-fetch data to show the new account on the dashboard
        fetchAccounts();
      })
      .catch(err => console.error("Error adding account:", err));
  };

  // 🗑️ 🎯 NEW ADDITION: Function to handle deleting an account from MongoDB
  const handleDeleteAccount = (accountId) => {
    if (!accountId) return;

    fetch(`${API_URL}/${accountId}`, {
      method: 'DELETE',
    })
      .then(res => {
        if (res.ok) {
          console.log(`🗑️ Successfully deleted account: ${accountId}`);
          // Re-fetch data to reflect the removal immediately on the layout
          fetchAccounts();
        } else {
          console.error("❌ Failed to delete account from backend service");
        }
      })
      .catch(err => console.error("❌ Network error while deleting account:", err));
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>🏦 Unified Banking Dashboard</h1>
      
      {/* Container to display Mono and manual options cleanly */}
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '30px' }}>
        
        {/* 1. Mono Integration Section */}
        <div style={{ padding: '15px', border: '1px solid #0055BA', borderRadius: '8px', minWidth: '300px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h3 style={{ marginTop: 0, color: '#0055BA' }}>Link Real Bank Account</h3>
          <p style={{ fontSize: '14px', color: '#555', marginBottom: '15px' }}>
            Securely link your real live bank details via Mono open banking.
          </p>
          {/* We pass fetchAccounts so the layout refreshes upon successful webhook synchronization */}
          <MonoConnectButton onLinkSuccess={fetchAccounts} />
        </div>

        {/* 2. Manual Backup Form */}
        <form onSubmit={handleAddAccount} style={{ padding: '15px', border: '1px solid #ddd', borderRadius: '8px', maxWidth: '500px' }}>
          <h3 style={{ marginTop: 0 }}>Add Manual Account Balance</h3>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
            <input type="text" placeholder="Bank Name (e.g., Citi)" value={bankName} onChange={(e) => setBankName(e.target.value)} required />
            <input type="text" placeholder="Account Type (e.g., Checking)" value={accountType} onChange={(e) => setAccountType(e.target.value)} required />
            <input type="number" placeholder="Balance" value={balance} onChange={(e) => setBalance(e.target.value)} required />
            <button type="submit">Add</button>
          </div>
        </form>

      </div>

      <hr style={{ border: '0', borderTop: '1px solid #eee', marginBottom: '30px' }} />

      {/* 3. Dashboard Display Grid */}
      <h2>Your Assets</h2>
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        {accounts.map(account => (
          <div key={account._id || account.id} style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px', minWidth: '200px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <h3>{account.bank} - {account.type}</h3>
              <p style={{ fontSize: '24px', fontWeight: 'bold', color: account.balance < 0 ? 'red' : 'green', margin: '10px 0' }}>
                ${typeof account.balance === 'number' ? account.balance.toFixed(2) : '0.00'}
              </p>
            </div>
            
            {/* 🗑️ 🎯 NEW ADDITION: Red removal button mapped to MongoDB _id */}
            <button 
              onClick={() => handleDeleteAccount(account._id || account.id)}
              style={{
                marginTop: '15px',
                padding: '6px 12px',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: 'bold',
                alignSelf: 'flex-start',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#bd2130'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#dc3545'}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;