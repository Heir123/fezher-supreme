// src/lib/api.js

// Single source of truth for the backend API
const API_BASE_URL = 'https://fezher-api.fietprojects.workers.dev';

// Generic fetch wrapper to handle JSON responses and errors
const request = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        // If you have a token, send it here for protected routes
        ...(localStorage.getItem('authToken') && { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }),
        ...options.headers,
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'API request failed');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// --- Auth Endpoints ---
export const loginUser = async (email, password, organizationSlug) => {
  return request('/api/auth/login', {
    method: 'POST',
    body: { email, password, organizationSlug },
  });
};

export const signupUser = async (email, password, organizationSlug) => {
  return request('/api/auth/signup', {
    method: 'POST',
    body: { email, password, organizationSlug },
  });
};

// --- Organization Endpoints ---
export const checkOrganization = async (organizationSlug) => {
  return request(`/api/organizations/slug/${organizationSlug}`);
};

// --- Data Endpoints (Add as you build more features) ---
export const fetchDashboardData = async () => {
  return request('/api/dashboard');
};

export default request;