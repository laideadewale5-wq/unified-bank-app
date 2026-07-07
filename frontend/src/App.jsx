import { useState, useEffect } from 'react'

function App() {
  const [accounts, setAccounts] = useState([])
  
  // In a real DevOps environment, this URL will be dynamic based on your AWS load balancer!
  // For now, we point it to your local backend.
  const API_URL = 'http://18.170.23.41:8080/api/accounts'

  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => setAccounts(data))
      .catch(err => console.error("Error fetching data:", err))
  }, [])

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>🏦 Unified Banking Dashboard</h1>
      <div style={{ display: 'flex', gap: '20px' }}>
        {accounts.map(account => (
          <div key={account.id} style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px' }}>
            <h3>{account.bank} - {account.type}</h3>
            <p style={{ fontSize: '24px', fontWeight: 'bold' }}>
              ${account.balance.toFixed(2)}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App