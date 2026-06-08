import React, { useState, useEffect } from 'react';
import { fetchCustomers, createCustomer } from '../services/api';

function CustomerForm({ onSubmit }) {
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    status: 'active',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...form });
    setForm({ first_name: '', last_name: '', email: '', phone_number: '', status: 'active' });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-5 rounded-lg shadow border border-gray-200 space-y-3">
      <h3 className="font-bold text-lg">Register Customer</h3>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <input name="first_name" placeholder="First Name" value={form.first_name} onChange={handleChange} required className="border rounded px-3 py-2 text-sm" />
        <input name="last_name" placeholder="Last Name" value={form.last_name} onChange={handleChange} required className="border rounded px-3 py-2 text-sm" />
        <input name="email" placeholder="Email" type="email" value={form.email} onChange={handleChange} required className="border rounded px-3 py-2 text-sm" />
        <input name="phone_number" placeholder="Phone" value={form.phone_number} onChange={handleChange} required className="border rounded px-3 py-2 text-sm" />
        <select name="status" value={form.status} onChange={handleChange} className="border rounded px-3 py-2 text-sm">
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-semibold hover:bg-blue-700">
        Register
      </button>
    </form>
  );
}

export default function CustomerPanel() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    fetchCustomers()
      .then((res) => setCustomers(res.data))
      .catch((err) => console.error('Failed to fetch customers:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleAdd = (data) => {
    createCustomer(data)
      .then(() => load())
      .catch((err) => console.error('Failed to add customer:', err));
  };

  return (
    <section className="space-y-6">
      <CustomerForm onSubmit={handleAdd} />
      {loading ? (
        <p className="text-gray-500">Loading customers...</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow border border-gray-200">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-4 py-3">First Name</th>
                <th className="px-4 py-3">Last Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Username</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {customers.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-6 text-center text-gray-400">No customers found.</td></tr>
              ) : (
                customers.map((c) => (
                  <tr key={c.customer_id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 font-medium">{c.first_name}</td>
                    <td className="px-4 py-2">{c.last_name}</td>
                    <td className="px-4 py-2">{c.email}</td>
                    <td className="px-4 py-2">{c.phone_number}</td>
                    <td className="px-4 py-2">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                        c.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                      }`}>{c.status}</span>
                    </td>
                    <td className="px-4 py-2 text-gray-500">{c.username || '—'}</td>
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
