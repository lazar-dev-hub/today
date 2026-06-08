import React, { useState, useEffect } from 'react';
import { fetchPromotions, createPromotion } from '../services/api';

function PromoForm({ onSubmit }) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    discount_type: 'percentage',
    discount_value: '',
    start_date: '',
    end_date: '',
    status: 'scheduled',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...form, discount_value: Number(form.discount_value) });
    setForm({
      title: '',
      description: '',
      discount_type: 'percentage',
      discount_value: '',
      start_date: '',
      end_date: '',
      status: 'scheduled',
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-5 rounded-lg shadow border border-gray-200 space-y-3">
      <h3 className="font-bold text-lg">Create Promotion</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <input name="title" placeholder="Title" value={form.title} onChange={handleChange} required className="border rounded px-3 py-2 text-sm" />
        <input name="description" placeholder="Description" value={form.description} onChange={handleChange} required className="border rounded px-3 py-2 text-sm" />
        <select name="discount_type" value={form.discount_type} onChange={handleChange} className="border rounded px-3 py-2 text-sm">
          <option value="percentage">Percentage</option>
          <option value="fixed">Fixed Amount</option>
        </select>
        <input name="discount_value" placeholder="Discount Value" type="number" value={form.discount_value} onChange={handleChange} required className="border rounded px-3 py-2 text-sm" />
        <input name="start_date" placeholder="Start Date" type="date" value={form.start_date} onChange={handleChange} required className="border rounded px-3 py-2 text-sm" />
        <input name="end_date" placeholder="End Date" type="date" value={form.end_date} onChange={handleChange} required className="border rounded px-3 py-2 text-sm" />
        <select name="status" value={form.status} onChange={handleChange} className="border rounded px-3 py-2 text-sm">
          <option value="scheduled">Scheduled</option>
          <option value="active">Active</option>
          <option value="ended">Ended</option>
        </select>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-semibold hover:bg-blue-700 col-span-2 md:col-span-1">
          Create
        </button>
      </div>
    </form>
  );
}

export default function PromoPanel() {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    fetchPromotions()
      .then((res) => setPromotions(res.data))
      .catch((err) => console.error('Failed to fetch promotions:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleAdd = (data) => {
    createPromotion(data)
      .then(() => load())
      .catch((err) => console.error('Failed to add promotion:', err));
  };

  return (
    <section className="space-y-6">
      <PromoForm onSubmit={handleAdd} />
      {loading ? (
        <p className="text-gray-500">Loading promotions...</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow border border-gray-200">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Value</th>
                <th className="px-4 py-3">Start</th>
                <th className="px-4 py-3">End</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {promotions.length === 0 ? (
                <tr><td colSpan={7} className="px-4 py-6 text-center text-gray-400">No promotions found.</td></tr>
              ) : (
                promotions.map((p) => (
                  <tr key={p.promotion_id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 font-medium">{p.title}</td>
                    <td className="px-4 py-2">{p.description}</td>
                    <td className="px-4 py-2">{p.discount_type}</td>
                    <td className="px-4 py-2">{p.discount_value}</td>
                    <td className="px-4 py-2">{p.start_date?.slice(0, 10)}</td>
                    <td className="px-4 py-2">{p.end_date?.slice(0, 10)}</td>
                    <td className="px-4 py-2">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                        p.status === 'active' ? 'bg-green-100 text-green-700' :
                        p.status === 'scheduled' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-600'
                      }`}>{p.status}</span>
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
