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
      // Since REACT_APP_API_URL already includes /api
      const url = `${process.env.REACT_APP_API_URL}/transaction`;
      console.log('Fetching transactions from:', url);
      
      const response = await fetch(url);
      if (!response.ok) {
        console.error('Transactions response:', response.status, response.statusText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setTransactions(data);
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to fetch transactions');
    }
  }

  async function addNewTransaction(ev) {
    ev.preventDefault();
    setError('');

    try {
      if (!name || !datetime) {
        setError('Please fill in all required fields');
        return;
      }

      const priceMatch = name.match(/^([+-]?Rp\s*[\d.,]+)/);
      if (!priceMatch) {
        setError('Please enter a valid price format: +Rp 60.000');
        return;
      }

      const priceString = priceMatch[1]
        .replace('Rp', '')
        .replace(/\s/g, '')
        .replace(/\./g, '');
      const price = parseInt(priceString);

      if (isNaN(price)) {
        setError('Invalid price format');
        return;
      }

      const transactionName = name.substring(priceMatch[0].length).trim();
      
      // Use the same endpoint as GET but with POST method
      const url = `${process.env.REACT_APP_API_URL}/transaction`;
      console.log('Sending transaction to:', url);
      
      const transactionData = {
        price,
        name: transactionName,
        description,
        datetime
      };
      
      console.log('Transaction data:', transactionData);

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify(transactionData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server response:', response.status, errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const json = await response.json();
      console.log('Success response:', json);

      setName('');
      setDatetime('');
      setDescription('');
      
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