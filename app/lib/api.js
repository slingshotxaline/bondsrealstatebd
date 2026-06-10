const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// ── Token helpers ─────────────────────────────────────────────────────────────
const getToken   = () => typeof window !== "undefined" ? localStorage.getItem("bonds_token")   : null;
const getRefresh = () => typeof window !== "undefined" ? localStorage.getItem("bonds_refresh")  : null;
const setToken   = (t) => localStorage.setItem("bonds_token", t);

// ── Refresh interceptor ───────────────────────────────────────────────────────
let isRefreshing = false;
let refreshQueue = [];

const processQueue = (error, token = null) => {
  refreshQueue.forEach(({ resolve, reject }) =>
    error ? reject(error) : resolve(token)
  );
  refreshQueue = [];
};

const refreshAccessToken = async () => {
  const refreshToken = getRefresh();
  if (!refreshToken) throw new Error("No refresh token");

  const res  = await fetch(`${BASE_URL}/auth/refresh`, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify({ refreshToken }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error("Session expired. Please sign in again.");
  setToken(data.token);
  return data.token;
};

// ── Core request with auto-refresh on 401 ────────────────────────────────────
const request = async (endpoint, options = {}, _retry = false) => {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const res  = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers });
  const data = await res.json();

  if (res.status === 401 && !_retry) {
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        refreshQueue.push({ resolve, reject });
      }).then(newToken => {
        const retryHeaders = { ...headers, Authorization: `Bearer ${newToken}` };
        return request(endpoint, { ...options, headers: retryHeaders }, true);
      });
    }

    isRefreshing = true;
    try {
      const newToken = await refreshAccessToken();
      processQueue(null, newToken);
      isRefreshing = false;
      return request(endpoint, options, true);
    } catch (err) {
      processQueue(err);
      isRefreshing = false;
      localStorage.removeItem("bonds_token");
      localStorage.removeItem("bonds_refresh");
      throw new Error("Session expired. Please sign in again.");
    }
  }

  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
};

// ── Multipart with auto-refresh ───────────────────────────────────────────────
const requestForm = async (endpoint, formData, method = "POST", _retry = false) => {
  const token = getToken();
  const res   = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers: { ...(token && { Authorization: `Bearer ${token}` }) },
    body: formData,
  });
  const data = await res.json();

  if (res.status === 401 && !_retry) {
    try {
      await refreshAccessToken();
      return requestForm(endpoint, formData, method, true);
    } catch {
      localStorage.removeItem("bonds_token");
      localStorage.removeItem("bonds_refresh");
      throw new Error("Session expired. Please sign in again.");
    }
  }

  if (!res.ok) throw new Error(data.message || "Upload failed");
  return data;
};

// ── Auth ──────────────────────────────────────────────────────────────────────
export const authAPI = {
  login:          (body) => request("/auth/login",           { method: "POST", body: JSON.stringify(body) }),
  register:       (body) => request("/auth/register",        { method: "POST", body: JSON.stringify(body) }),
  getMe:          ()     => request("/auth/me"),
  updateProfile:  (body) => request("/auth/me",              { method: "PUT",  body: JSON.stringify(body) }),
  changePassword: (body) => request("/auth/change-password", { method: "PUT",  body: JSON.stringify(body) }),
  refresh:        (body) => request("/auth/refresh",         { method: "POST", body: JSON.stringify(body) }),
};

// ── Properties ────────────────────────────────────────────────────────────────
export const propertyAPI = {
  getAll:        (params = "") => request(`/properties?${params}`),
  getOne:        (id)          => request(`/properties/${id}`),
  getBySlug:     (slug)        => request(`/properties/slug/${slug}`),
  getMy:         (params = "") => request(`/properties/my?${params}`),
  create:        (formData)    => requestForm("/properties", formData),
  update:        (id, fd)      => requestForm(`/properties/${id}`, fd, "PUT"),
  delete:        (id)          => request(`/properties/${id}`, { method: "DELETE" }),
  submitInquiry: (id, body)    => request(`/properties/${id}/inquiries`, { method: "POST", body: JSON.stringify(body) }),
};

// ── User ──────────────────────────────────────────────────────────────────────
export const userAPI = {
  getInquiries:    (params = "") => request(`/user/inquiries?${params}`),
  getNotifications:(params = "") => request(`/user/notifications?${params}`),
  markAllRead:     ()            => request("/user/notifications/read-all", { method: "PATCH" }),
  markRead:        (id)          => request(`/user/notifications/${id}/read`, { method: "PATCH" }),
};

// ── Admin ─────────────────────────────────────────────────────────────────────
export const adminAPI = {
  // Properties
  getProperties:   (params = "") => request(`/admin/properties?${params}`),
  getStats:        ()            => request("/admin/properties/stats"),
  createProperty:  (fd)          => requestForm("/admin/properties", fd),
  approveProperty: (id)          => request(`/admin/properties/${id}/approve`,         { method: "PATCH" }),
  rejectProperty:  (id, body)    => request(`/admin/properties/${id}/reject`,          { method: "PATCH", body: JSON.stringify(body) }),
  toggleFeatured:  (id)          => request(`/admin/properties/${id}/toggle-featured`, { method: "PATCH" }),

  // Users
  getUsers:        (params = "") => request(`/admin/users?${params}`),
  getUser:         (id)          => request(`/admin/users/${id}`),
  updateUserStatus:(id, status)  => request(`/admin/users/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) }),
  deleteUser:      (id)          => request(`/admin/users/${id}`, { method: "DELETE" }),

  // Admins (superadmin only)
  getAdmins:       ()            => request("/admin/admins"),
  createAdmin:     (body)        => request("/admin/admins", { method: "POST", body: JSON.stringify(body) }),
  deleteAdmin:     (id)          => request(`/admin/admins/${id}`, { method: "DELETE" }),

  // Property inquiries
  getInquiries:    (params = "") => request(`/admin/inquiries?${params}`),
  updateInquiry:   (id, body)    => request(`/admin/inquiries/${id}`, { method: "PATCH", body: JSON.stringify(body) }),

  // Contact messages
  getContacts:      (params = "") => request(`/admin/contacts?${params}`),
  getContact:       (id)          => request(`/admin/contacts/${id}`),
  updateContact:    (id, body)    => request(`/admin/contacts/${id}`, { method: "PATCH", body: JSON.stringify(body) }),
  deleteContact:    (id)          => request(`/admin/contacts/${id}`, { method: "DELETE" }),
  getContactStats:  ()            => request("/admin/contacts/stats"),
};