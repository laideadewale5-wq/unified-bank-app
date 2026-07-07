import { useState, useEffect } from 'react'

function App() {
  const [accounts, setAccounts] = useState([])
  
  // State variables to hold the form input values
  const [bankName, setBankName] = useState('')
  const [accountType, setAccountType] = useState('')
  const [balance, setBalance] = useState('')
  
  const API_URL = 'http://18.130.41.51:8080/api/accounts'

  // Fetch accounts on load
  useEffect(() => {
    fetchAccounts();
  }, [])

  const fetchAccounts = () => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => setAccounts(data))
      .catch(err => console.error("Error fetching data:", err))
  }

  // Function to handle the form submission
  const handleAddAccount = (e) => {
    e.preventDefault(); // Prevents the page from refreshing when you submit the form

    // Create the data object to send to the backend
    const newAccount = {
      bank: bankName,
      type: accountType,
      balance: balance
    };

    // Make the POST request
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
        // Re-fetch the data to show the new account on the dashboard
        fetchAccounts();
      })
      .catch(err => console.error("Error adding account:", err));
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>🏦 Unified Banking Dashboard</h1>
      
      {/* Form to add a new account */}
      <form onSubmit={handleAddAccount} style={{ marginBottom: '30px', padding: '15px', border: '1px solid #ddd', borderRadius: '8px', maxWidth: '500px' }}>
        <h3>Add New Account</h3>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
          <input type="text" placeholder="Bank Name (e.g., Citi)" value={bankName} onChange={(e) => setBankName(e.target.value)} required />
          <input type="text" placeholder="Account Type (e.g., Checking)" value={accountType} onChange={(e) => setAccountType(e.target.value)} required />
          <input type="number" placeholder="Balance" value={balance} onChange={(e) => setBalance(e.target.value)} required />
          <button type="submit">Add</button>
        </div>
      </form>

      {/* Dashboard Display */}
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        {accounts.map(account => (
          <div key={account.id} style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px', minWidth: '200px' }}>
            <h3>{account.bank} - {account.type}</h3>
            <p style={{ fontSize: '24px', fontWeight: 'bold', color: account.balance < 0 ? 'red' : 'green' }}>
              ${account.balance.toFixed(2)}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App