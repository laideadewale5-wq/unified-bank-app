import React from 'react';
import Connect from '@mono.co/connect.js';

const MonoConnectButton = ({ onLinkSuccess }) => {
  const handleLinkBank = () => {
    // 1. Initialize Mono with your specific Public Key
    const monoInstance = new Connect({
      key: 'test_pk_n0qzsei6bg4ksgt589mu',
      
      // ✅ FIX: Removed the curly braces to properly capture the string code!
      onSuccess: async (code) => {
        
        // Extra safety net: Ensure we extract the string code perfectly
        const actualCode = typeof code === 'string' ? code : code?.code || (code?.getAuthCode ? code.getAuthCode() : null);
        
        console.log("✅ Mono Code Extracted:", actualCode);
        
        try {
          // 2. Send the code directly to your AWS Fargate Backend
          const response = await fetch('http://bank-backend-alb-456735600.eu-west-2.elb.amazonaws.com/api/mono/sync', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code: actualCode }),
          });

          if (response.ok) {
            const newAccount = await response.json();
            console.log("✅ Account successfully synced to MongoDB:", newAccount);
            
            // 3. Trigger a dashboard refresh to show the new bank data
            if (onLinkSuccess) onLinkSuccess(); 
          } else {
            console.error("❌ Backend rejected the sync request. Check AWS logs.");
          }
        } catch (error) {
          console.error("❌ Network error connecting to AWS Load Balancer:", error);
        }
      },
      onClose: () => {
        console.log("Widget closed by user");
      }
    });

    // 4. Launch the widget!
    monoInstance.setup();
    monoInstance.open();
  };

  return (
    <button 
      onClick={handleLinkBank}
      style={{
        padding: '12px 24px',
        backgroundColor: '#0055BA',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        fontSize: '16px',
        fontWeight: 'bold',
        cursor: 'pointer'
      }}
    >
      Securely Link Bank
    </button>
  );
};

export default MonoConnectButton;