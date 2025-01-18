import './App.css';
import { useEffect, useState } from "react";

function App() {
  const [name, setName] = useState('');
  const [datetime, setDatetime] = useState('');
  const [description, setDescription] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    getTransactions().catch(error => 
      console.error('Failed to fetch transactions:', error)
    );
  }, []);

  async function getTransactions() {
    try {
      const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:4070/api';
      const url = `${baseUrl}/transaction`;
      console.log('API URL:', url); // Debug log
      
      const response = await fetch(url);
      const text = await response.text();
      console.log('Raw response:', text); // Debug log
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = JSON.parse(text);
      setTransactions(data);
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to fetch transactions');
    }
  }

 // App.js
 async function addNewTransaction(ev) {
  ev.preventDefault();
  setError('');

  try {
    // Basic validation
    if (!name || !datetime) {
      setError('Please fill in all required fields');
      return;
    }

    // Improved price parsing regex
    // Matches formats like: +Rp 60.000, -Rp 60.000, Rp 60.000
    const priceRegex = /^([+-])?Rp\s*([\d.,]+)/;
    const matches = name.match(priceRegex);

    if (!matches) {
      setError('Please enter a valid price format (e.g., +Rp 60.000 or -Rp 60.000)');
      return;
    }

    // Extract sign and number parts
    const sign = matches[1] === '-' ? -1 : 1;
    const priceString = matches[2]
      .replace(/\./g, '') // Remove thousand separators
      .replace(/,/g, '.'); // Convert decimal comma to dot if present

    // Parse the price
    const price = sign * parseFloat(priceString);

    if (isNaN(price)) {
      setError('Invalid price value');
      return;
    }

    // Get the transaction name by removing the price part
    const transactionName = name.substring(matches[0].length).trim();
    
    if (!transactionName) {
      setError('Please enter a description after the price');
      return;
    }

    // Prepare transaction data
    const transactionData = {
      price,
      name: transactionName,
      description,
      datetime
    };

    // Construct the URL
    const baseUrl = process.env.REACT_APP_API_URL?.replace(/\/$/, '') || 'http://localhost:4070/api';
    const url = `${baseUrl}/transaction`;
    
    console.log('Sending transaction:', transactionData);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(transactionData)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `HTTP error! status: ${response.status}`);
    }

    const json = await response.json();
    console.log('Transaction added successfully:', json);

    // Clear form
    setName('');
    setDatetime('');
    setDescription('');
    
    // Refresh transactions list
    await getTransactions();
  } catch (error) {
    console.error('Error adding transaction:', error);
    setError(`Failed to add transaction: ${error.message}`);
  }
}
  const balance = transactions.reduce((sum, transaction) => 
    sum + (typeof transaction.price === 'number' ? transaction.price : parseFloat(transaction.price) || 0)
  , 0);

  return (
    <main>
      <h1>Rp {balance.toLocaleString('id-ID')}</h1>
      {error && (
        <div style={{ color: '#c11', textAlign: 'center', margin: '10px 0', padding: '10px' }}>
          {error}
        </div>
      )}
      <form onSubmit={addNewTransaction}>
        <div className="basic">
          <input
            type="text"
            value={name}
            onChange={ev => setName(ev.target.value)}
            placeholder={'+Rp 60.000 PC Gaming'}
            required
          />
          <input
            type="datetime-local"
            value={datetime}
            onChange={ev => setDatetime(ev.target.value)}
            required
          />
        </div>
        <div className="description">
          <input
            type="text"
            placeholder={'description'}
            value={description}
            onChange={ev => setDescription(ev.target.value)}
          />
        </div>
        <button type="submit">Add new transaction</button>
      </form>
      <div className="transactions">
        {transactions.length > 0 && transactions.map(transaction => (
          <div className="transaction" key={transaction.id}>
            <div className="left">
              <div className="name">{transaction.name}</div>
              <div className="description">{transaction.description}</div>
            </div>
            <div className="right">
              <div className={"price " + (transaction.price < 0 ? 'red' : 'green')}>
                Rp {Math.abs(transaction.price).toLocaleString('id-ID')}
              </div>
              <div className="datetime">
                {new Date(transaction.datetime).toLocaleString('id-ID')}
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

export default App;
