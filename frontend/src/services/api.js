import axios from 'axios';

const API_BASE_URL = 'http://localhost:4000/api';

const api = axios.create({ baseURL: API_BASE_URL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


// Vehicles
export const fetchVehicles = () => api.get('/vehicles-with-promotions');
export const createVehicle = (data) => api.post('/vehicles', data);
export const deleteVehicle = (id) => api.delete(`/vehicles/${id}`);

// Customers
export const fetchCustomers = () => api.get('/customers');
export const createCustomer = (data) => api.post('/customers', data);

// Users
export const fetchUsers = () => api.get('/users');
export const createUser = (data) => api.post('/users', data);

// Promotions
export const fetchPromotions = () => api.get('/promotions');
export const createPromotion = (data) => api.post('/promotions', data);
export const linkPromotionVehicle = (data) => api.post('/promotions/link-vehicle', data);

export default api;
