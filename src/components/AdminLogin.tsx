import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { setAuthToken } from '../api';
import { motion } from 'framer-motion';

export default function AdminLogin({ setIsAdmin }: { setIsAdmin: (v: boolean) => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/api/token/', { username, password });
      setAuthToken(res.data.token);
      setIsAdmin(true);
      navigate('/');
    } catch {
      setError('Invalid credentials');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex items-center justify-center bg-dark"
    >
      <div className="glass p-10 rounded-3xl w-full max-w-md">
        <h2 className="text-4xl font-heading mb-8">Admin Access</h2>
        <form onSubmit={handleLogin} className="space-y-6">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-2xl px-6 py-4 focus:outline-none focus:border-accent"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-2xl px-6 py-4 focus:outline-none focus:border-accent"
          />
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full py-4 bg-accent text-black font-semibold rounded-2xl hover:bg-cyan-300 transition-colors"
          >
            Sign in as Admin
          </button>
        </form>
      </div>
    </motion.div>
  );
}