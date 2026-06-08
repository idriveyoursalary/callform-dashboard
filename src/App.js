import { useState, useEffect } from 'react';

const API = 'https://api.callform.ca';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      const res = await fetch(`${API}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('clientId', data.clientId);
        onLogin(data.token);
      } else {
        setError('Invalid username or password');
      }
    } catch {
      setError('Connection error');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#0f172a' }}>
      <div style={{ background: '#1e293b', padding: '40px', borderRadius: '16px', width: '360px' }}>
        <h1 style={{ color: '#38bdf8', marginBottom: '8px', fontSize: '24px' }}>Callform</h1>
        <p style={{ color: '#94a3b8', marginBottom: '32px' }}>Sign in to your dashboard</p>
        {error && <p style={{ color: '#f87171', marginBottom: '16px' }}>{error}</p>}
        <input
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          style={{ width: '100%', padding: '12px', borderRadius: '8px', border: 'none', background: '#0f172a', color: 'white', marginBottom: '12px', boxSizing: 'border-box' }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={{ width: '100%', padding: '12px', borderRadius: '8px', border: 'none', background: '#0f172a', color: 'white', marginBottom: '20px', boxSizing: 'border-box' }}
        />
        <button
          onClick={handleLogin}
          style={{ width: '100%', padding: '12px', borderRadius: '8px', border: 'none', background: '#38bdf8', color: '#0f172a', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px' }}
        >
          Sign In
        </button>
      </div>
    </div>
  );
}

function Dashboard({ token, onLogout }) {
  const [calls, setCalls] = useState([]);

  useEffect(() => {
    fetch(`${API}/calls`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setCalls(Array.isArray(data) ? data : []));
  }, [token]);

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '40px', background: '#0f172a', minHeight: '100vh', color: 'white' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ color: '#38bdf8', marginBottom: '4px' }}>Callform Dashboard</h1>
          <p style={{ color: '#94a3b8' }}>Live call log</p>
        </div>
        <button onClick={onLogout} style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: '#1e293b', color: '#94a3b8', cursor: 'pointer' }}>Logout</button>
      </div>
      <div style={{ background: '#1e293b', borderRadius: '12px', padding: '24px' }}>
        <h2 style={{ marginBottom: '16px', fontSize: '18px' }}>Recent Calls</h2>
        {calls.length === 0 ? (
          <p style={{ color: '#64748b' }}>No calls yet.</p>
        ) : (
          calls.map(call => (
            <div key={call.id} style={{ background: '#0f172a', borderRadius: '8px', padding: '16px', marginBottom: '12px' }}>
              <p><strong>From:</strong> {call.from}</p>
              <p><strong>To:</strong> {call.to}</p>
              <p><strong>Time:</strong> {new Date(call.timestamp).toLocaleString()}</p>
              <p><strong>Status:</strong> {call.status}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('clientId');
    setToken(null);
  };

  return token ? <Dashboard token={token} onLogout={handleLogout} /> : <Login onLogin={setToken} />;
}

export default App;