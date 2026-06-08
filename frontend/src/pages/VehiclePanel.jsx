import React, { useState, useEffect } from 'react';
import { fetchVehicles, createVehicle, deleteVehicle } from '../services/api';

function VehicleForm({ onSubmit }) {
  const [form, setForm] = useState({
    plate_number: '',
    brand: '',
    model: '',
    year_manufactured: '',
    vehicle_type: 'sedan',
    purchase_price: '',
    status: 'available',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...form,
      purchase_price: Number(form.purchase_price),
      year_manufactured: Number(form.year_manufactured),
    });
    setForm({
      plate_number: '',
      brand: '',
      model: '',
      year_manufactured: '',
      vehicle_type: 'sedan',
      purchase_price: '',
      status: 'available',
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-5 rounded-lg shadow border border-gray-200 space-y-3">
      <h3 className="font-bold text-lg">Add Vehicle</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <input
          name="plate_number"
          placeholder="Plate Number"
          value={form.plate_number}
          onChange={handleChange}
          required
          className="border rounded px-3 py-2 text-sm"
        />
        <input
          name="brand"
          placeholder="Brand"
          value={form.brand}
          onChange={handleChange}
          required
          className="border rounded px-3 py-2 text-sm"
        />
        <input
          name="model"
          placeholder="Model"
          value={form.model}
          onChange={handleChange}
          required
          className="border rounded px-3 py-2 text-sm"
        />
        <input
          name="year_manufactured"
          placeholder="Year"
          type="number"
          value={form.year_manufactured}
          onChange={handleChange}
          required
          className="border rounded px-3 py-2 text-sm"
        />
        <select
          name="vehicle_type"
          value={form.vehicle_type}
          onChange={handleChange}
          className="border rounded px-3 py-2 text-sm"
        >
          <option value="sedan">Sedan</option>
          <option value="suv">SUV</option>
          <option value="truck">Truck</option>
          <option value="hatchback">Hatchback</option>
          <option value="coupe">Coupe</option>
        </select>
        <input
          name="purchase_price"
          placeholder="Purchase Price"
          type="number"
          value={form.purchase_price}
          onChange={handleChange}
          required
          className="border rounded px-3 py-2 text-sm"
        />
        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="border rounded px-3 py-2 text-sm"
        >
          <option value="available">Available</option>
          <option value="sold">Sold</option>
          <option value="reserved">Reserved</option>
        </select>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-semibold hover:bg-blue-700 col-span-2 md:col-span-1"
        >
          Add Vehicle
        </button>
      </div>
    </form>
  );
}

export default function VehiclePanel() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    fetchVehicles()
      .then((res) => setVehicles(res.data))
      .catch((err) => console.error('Failed to fetch vehicles:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleAdd = (data) => {
    createVehicle(data)
      .then(() => load())
      .catch((err) => console.error('Failed to add vehicle:', err));
  };

  const handleDelete = (id) => {
    deleteVehicle(id)
      .then(() => load())
      .catch((err) => console.error('Failed to delete vehicle:', err));
  };

  return (
    <section className="space-y-6">
      <VehicleForm onSubmit={handleAdd} />
      {loading ? (
        <p className="text-gray-500">Loading vehicles...</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow border border-gray-200">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-4 py-3">Plate</th>
                <th className="px-4 py-3">Brand</th>
                <th className="px-4 py-3">Model</th>
                <th className="px-4 py-3">Promotion</th>
                <th className="px-4 py-3">Discount</th>
                <th className="px-4 py-3">Performance</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {vehicles.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-6 text-center text-gray-400">
                    No vehicles found.
                  </td>
                </tr>
              ) : (
                vehicles.map((v) => (
                  <tr key={v.vehicle_id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 font-medium">{v.plate_number}</td>
                    <td className="px-4 py-2">{v.brand}</td>
                    <td className="px-4 py-2">{v.model}</td>
                    <td className="px-4 py-2">{v.promo_title || '—'}</td>
                    <td className="px-4 py-2">{v.discount_value ?? '—'}</td>
                    <td className="px-4 py-2">{v.performance ?? '—'}</td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => handleDelete(v.vehicle_id)}
                        className="text-red-500 hover:underline text-xs font-semibold"
                      >
                        Delete
                      </button>
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
