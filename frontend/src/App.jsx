import { useState, useEffect } from 'react';
import MonoConnectButton from './MonoConnectButton';

function App() {
  const [accounts, setAccounts] = useState([]);
  const [bankName, setBankName] = useState('');
  const [accountType, setAccountType] = useState('');
  const [balance, setBalance] = useState('');
  
  const API_URL = 'http://bank-backend-alb-456735600.eu-west-2.elb.amazonaws.com/api/accounts';

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = () => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => setAccounts(data))
      .catch(err => console.error("Error fetching data:", err));
  };

  const handleAddAccount = (e) => {
    e.preventDefault();
    const newAccount = {
      bank: bankName,
      type: accountType,
      balance: balance
    };

    fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newAccount)
    })
      .then(res => res.json())
      .then(() => {
        setBankName('');
        setAccountType('');
        setBalance('');
        fetchAccounts();
      })
      .catch(err => console.error("Error adding account:", err));
  };

  const handleDeleteAccount = (accountId) => {
    if (!accountId) return;
    fetch(`${API_URL}/${accountId}`, { method: 'DELETE' })
      .then(res => {
        if (res.ok) {
          fetchAccounts();
        } else {
          console.error("❌ Failed to delete account");
        }
      })
      .catch(err => console.error("❌ Network error:", err));
  };

  // Calculate quick stats for financial dashboard feel
  const totalBalance = accounts.reduce((sum, acc) => sum + (acc.balance || 0), 0);

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#0B0F19', 
      color: '#F3F4F6', 
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      padding: '40px 20px'
    }}>
      {/* Container Wrapper */}
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Header Region */}
        <header style={{ display: 'flex', justifyContent: 'between', alignItems: 'center', marginBottom: '40px', borderBottom: '1px solid #1E293B', paddingBottom: '20px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: '700', margin: '0 0 4px 0', letterSpacing: '-0.5px' }}>
              ⚙️ Unified Banking Operations
            </h1>
            <p style={{ color: '#9CA3AF', margin: 0, fontSize: '14px' }}>DevOps Sandbox Environment & Asset Hub</p>
          </div>
          
          {/* Quick Metrics Badge */}
          <div style={{ background: 'linear-gradient(135deg, #1E1B4B 0%, #311042 100%)', padding: '12px 24px', borderRadius: '12px', border: '1px solid #3730A3', textAlign: 'right' }}>
            <span style={{ fontSize: '11px', textTransform: 'uppercase', color: '#A5B4FC', fontWeight: '600', letterSpacing: '1px' }}>Net Assets aggregated</span>
            <div style={{ fontSize: '22px', fontWeight: '700', color: '#6EE7B7', marginTop: '2px' }}>
              ${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
        </header>

        {/* Action Panel Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '25px', marginBottom: '45px' }}>
          
          {/* 1. Mono Integration Box */}
          <div style={{ background: '#111827', border: '1px solid #1F2937', padding: '25px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <div style={{ background: '#0055BA', width: '8px', height: '8px', borderRadius: '50%' }}></div>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: '#F9FAFB' }}>Link Institutional Node</h3>
            </div>
            <p style={{ fontSize: '13px', color: '#9CA3AF', lineHeight: '1.6', marginBottom: '20px' }}>
              Establish a secure, encrypted socket connection via the Mono Open Banking runtime protocol layer.
            </p>
            <div style={{ width: '100%' }}>
              <MonoConnectButton onLinkSuccess={fetchAccounts} />
            </div>
          </div>

          {/* 2. Manual Account Creation Box */}
          <div style={{ background: '#111827', border: '1px solid #1F2937', padding: '25px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '18px', fontWeight: '600', color: '#F9FAFB' }}>Inject Mock Balance Node</h3>
            <form onSubmit={handleAddAccount} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <input 
                  type="text" placeholder="Institution (e.g. Citi)" value={bankName} onChange={(e) => setBankName(e.target.value)} required 
                  style={{ backgroundColor: '#1F2937', border: '1px solid #374151', padding: '10px', borderRadius: '8px', color: '#fff', fontSize: '13px' }}
                />
                <input 
                  type="text" placeholder="Type (e.g. Checking)" value={accountType} onChange={(e) => setAccountType(e.target.value)} required 
                  style={{ backgroundColor: '#1F2937', border: '1px solid #374151', padding: '10px', borderRadius: '8px', color: '#fff', fontSize: '13px' }}
                />
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input 
                  type="number" placeholder="Balance Allocation Amount" value={balance} onChange={(e) => setBalance(e.target.value)} required 
                  style={{ backgroundColor: '#1F2937', border: '1px solid #374151', padding: '10px', borderRadius: '8px', color: '#fff', fontSize: '13px', flex: 1 }}
                />
                <button type="submit" style={{ backgroundColor: '#3B82F6', color: 'white', border: 'none', padding: '0 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}>
                  Inject
                </button>
              </div>
            </form>
          </div>

        </div>

        {/* Assets Visualization Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', margin: 0 }}>Active Active Data Clusters ({accounts.length})</h2>
          <span style={{ flex: 1, height: '1px', backgroundColor: '#1E293B' }}></span>
        </div>

        {/* Dashboard Grid Display */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
          {accounts.map(account => (
            <div 
              key={account._id || account.id} 
              style={{ 
                background: 'linear-gradient(145deg, #111827 0%, #1F2937 100%)', 
                border: '1px solid #374151', 
                padding: '20px', 
                borderRadius: '14px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 10px 15px -3px rgba(0,0,0,0.3)',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* Decorative Card Stripe */}
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: account.accountId ? 'linear-gradient(90deg, #0055BA, #3B82F6)' : 'linear-gradient(90deg, #4B5563, #9CA3AF)' }}></div>
              
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                  <span style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#9CA3AF', fontWeight: '500' }}>
                    {account.bank}
                  </span>
                  <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '12px', background: account.accountId ? '#1E3A8A' : '#374151', color: account.accountId ? '#93C5FD' : '#D1D5DB', fontWeight: '600' }}>
                    {account.accountId ? 'API Link' : 'Static'}
                  </span>
                </div>
                <h4 style={{ margin: '0 0 16px 0', fontSize: '15px', color: '#E5E7EB', fontWeight: '400' }}>{account.type}</h4>
                <div style={{ fontSize: '26px', fontWeight: '700', color: account.balance < 0 ? '#EF4444' : '#10B981' }}>
                  ${typeof account.balance === 'number' ? account.balance.toLocaleString('en-US', { minimumFractionDigits: 2 }) : '0.00'}
                </div>
              </div>

              <button 
                onClick={() => handleDeleteAccount(account._id || account.id)}
                style={{
                  marginTop: '20px',
                  padding: '8px 0',
                  backgroundColor: 'transparent',
                  color: '#F87171',
                  border: '1px solid #EF4444',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: '600',
                  width: '100%',
                  transition: 'all 0.2s ease',
                  textAlign: 'center'
                }}
                onMouseOver={(e) => { e.target.style.backgroundColor = '#7F1D1D'; e.target.style.color = '#FCA5A5'; }}
                onMouseOut={(e) => { e.target.style.backgroundColor = 'transparent'; e.target.style.color = '#F87171'; }}
              >
                Terminate Node
              </button>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default App;