// src/lib/api.js

const API_BASE_URL = 'https://fezher-api.fietprojects.workers.dev';

// Generic fetch wrapper
const request = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
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

export default request;