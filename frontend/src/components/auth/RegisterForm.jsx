import { useState } from 'react';

import { useAuth } from '../../auth/AuthContext';

export default function RegisterForm({ onSuccess }) {
  const { register } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('customer');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [createdCredentials, setCreatedCredentials] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await register({ username, password, role });
      setCreatedCredentials({ username, password, role });
      setUsername('');
      setPassword('');
      setRole('customer');
      onSuccess?.();
    } catch (err) {
      setError(err?.response?.data?.error || 'Register failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow border border-gray-200 space-y-4">
        <h2 className="text-xl font-bold">Register</h2>
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
        <select
          className="border rounded px-3 py-2 text-sm w-full"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="admin">Admin</option>
          <option value="customer">Customer</option>
          <option value="sales">Sales</option>
        </select>
        <button
          disabled={submitting}
          className="bg-blue-600 disabled:opacity-60 text-white px-4 py-2 rounded text-sm font-semibold hover:bg-blue-700 w-full"
          type="submit"
        >
          {submitting ? 'Creating...' : 'Create account'}
        </button>
      </form>

      {createdCredentials ? (
        <div className="mt-4 bg-emerald-50 border border-emerald-200 rounded-lg p-4">
          <h3 className="font-bold text-emerald-900">Login credentials</h3>
          <p className="text-sm text-emerald-800 mt-1">Use these to sign in:</p>
          <div className="mt-3 space-y-2 text-sm text-emerald-900">
            <div>
              <span className="font-semibold">Username:</span>{' '}
              <span className="font-mono">{createdCredentials.username}</span>
            </div>
            <div>
              <span className="font-semibold">Password:</span>{' '}
              <span className="font-mono">{createdCredentials.password}</span>
            </div>
            <div>
              <span className="font-semibold">Role:</span>{' '}
              <span className="font-mono capitalize">{createdCredentials.role}</span>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

