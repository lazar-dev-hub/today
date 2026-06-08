import React, { useState, useEffect } from 'react';
import { fetchUsers, createUser } from '../services/api';

function UserForm({ onSubmit }) {
  const [form, setForm] = useState({ username: '', password: '', role: 'customer' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...form });
    setForm({ username: '', password: '', role: 'customer' });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-5 rounded-lg shadow border border-gray-200 space-y-3">
      <h3 className="font-bold text-lg">Create User</h3>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
        <input name="username" placeholder="Username" value={form.username} onChange={handleChange} required className="border rounded px-3 py-2 text-sm" />
        <input name="password" placeholder="Password" type="password" value={form.password} onChange={handleChange} required className="border rounded px-3 py-2 text-sm" />
        <select name="role" value={form.role} onChange={handleChange} className="border rounded px-3 py-2 text-sm">
          <option value="admin">Admin</option>
          <option value="customer">Customer</option>
          <option value="sales">Sales</option>
        </select>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-semibold hover:bg-blue-700">
          Create User
        </button>
      </div>
    </form>
  );
}

export default function UserPanel() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    fetchUsers()
      .then((res) => setUsers(res.data))
      .catch((err) => console.error('Failed to fetch users:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleAdd = (data) => {
    createUser(data)
      .then(() => load())
      .catch((err) => console.error('Failed to add user:', err));
  };

  return (
    <section className="space-y-6">
      <UserForm onSubmit={handleAdd} />
      {loading ? (
        <p className="text-gray-500">Loading users...</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow border border-gray-200">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Username</th>
                <th className="px-4 py-3">Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.length === 0 ? (
                <tr><td colSpan={3} className="px-4 py-6 text-center text-gray-400">No users found.</td></tr>
              ) : (
                users.map((u) => (
                  <tr key={u.user_id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 font-medium">{u.user_id}</td>
                    <td className="px-4 py-2">{u.username}</td>
                    <td className="px-4 py-2">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                        u.role === 'admin' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                      }`}>{u.role}</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
