import { useState } from 'react';

import { useAuth } from '../../auth/AuthContext';

export default function LoginForm({ onSuccess }) {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login({ username, password });
      setUsername('');
      setPassword('');
      onSuccess?.();
    } catch (err) {
      setError(err?.response?.data?.error || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow border border-gray-200 space-y-4">
      <h2 className="text-xl font-bold">Login</h2>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <input
        className="border rounded px-3 py-2 text-sm w-full"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <input
        className="border rounded px-3 py-2 text-sm w-full"
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button
        disabled={submitting}
        className="bg-blue-600 disabled:opacity-60 text-white px-4 py-2 rounded text-sm font-semibold hover:bg-blue-700 w-full"
        type="submit"
      >
        {submitting ? 'Signing in...' : 'Sign in'}
      </button>
    </form>
  );
}

