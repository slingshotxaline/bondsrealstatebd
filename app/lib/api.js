const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const getToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('bonds_token');
};

const request = async (endpoint, options = {}) => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
};

// Multipart (file upload)
const requestForm = async (endpoint, formData, method = 'POST') => {
  const token = getToken();
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers: { ...(token && { Authorization: `Bearer ${token}` }) },
    body: formData,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Upload failed');
  return data;
};

// ── Auth ──────────────────────────────────────────────────────────────────────
export const authAPI = {
  login: (body) => request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  register: (body) => request('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  getMe: () => request('/auth/me'),
  updateProfile: (body) => request('/auth/me', { method: 'PUT', body: JSON.stringify(body) }),
  changePassword: (body) => request('/auth/change-password', { method: 'PUT', body: JSON.stringify(body) }),
  refresh: (body) => request('/auth/refresh', { method: 'POST', body: JSON.stringify(body) }),
};

// ── Properties ────────────────────────────────────────────────────────────────
export const propertyAPI = {
  getAll: (params = '') => request(`/properties?${params}`),
  getOne: (id) => request(`/properties/${id}`),
  getMy: (params = '') => request(`/properties/my?${params}`),
  create: (formData) => requestForm('/properties', formData),
  update: (id, formData) => requestForm(`/properties/${id}`, formData, 'PUT'),
  delete: (id) => request(`/properties/${id}`, { method: 'DELETE' }),
  submitInquiry: (id, body) => request(`/properties/${id}/inquiries`, { method: 'POST', body: JSON.stringify(body) }),
};

// ── User ──────────────────────────────────────────────────────────────────────
export const userAPI = {
  getInquiries: (params = '') => request(`/user/inquiries?${params}`),
  getNotifications: (params = '') => request(`/user/notifications?${params}`),
  markAllRead: () => request('/user/notifications/read-all', { method: 'PATCH' }),
  markRead: (id) => request(`/user/notifications/${id}/read`, { method: 'PATCH' }),
};

// ── Admin ─────────────────────────────────────────────────────────────────────
export const adminAPI = {
  // Properties
  getProperties: (params = '') => request(`/admin/properties?${params}`),
  getStats: () => request('/admin/properties/stats'),
  createProperty: (formData) => requestForm('/admin/properties', formData),
  approveProperty: (id) => request(`/admin/properties/${id}/approve`, { method: 'PATCH' }),
  rejectProperty: (id, body) => request(`/admin/properties/${id}/reject`, { method: 'PATCH', body: JSON.stringify(body) }),
  toggleFeatured: (id) => request(`/admin/properties/${id}/toggle-featured`, { method: 'PATCH' }),
  // Users
  getUsers: (params = '') => request(`/admin/users?${params}`),
  getUser: (id) => request(`/admin/users/${id}`),
  updateUserStatus: (id, status) => request(`/admin/users/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  deleteUser: (id) => request(`/admin/users/${id}`, { method: 'DELETE' }),
  // Admins
  getAdmins: () => request('/admin/admins'),
  createAdmin: (body) => request('/admin/admins', { method: 'POST', body: JSON.stringify(body) }),
  deleteAdmin: (id) => request(`/admin/admins/${id}`, { method: 'DELETE' }),
  // Inquiries
  getInquiries: (params = '') => request(`/admin/inquiries?${params}`),
  updateInquiry: (id, body) => request(`/admin/inquiries/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
};