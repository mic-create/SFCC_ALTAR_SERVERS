/* SFCC Altar Servers Attendance System — frontend/js/api.js */

const CONFIG = {
  API_BASE_URL: 'https://sfcc-altar-servers.onrender.com/api',
  STORAGE_TOKEN_KEY: 'sfcc_auth_token',
  STORAGE_USER_KEY: 'sfcc_user_info'
};

const API = {
  async request(endpoint, options = {}) {
    const token = localStorage.getItem(CONFIG.STORAGE_TOKEN_KEY);
    
    const headers = {
      ...options.headers
    };

    if (!(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
      ...options,
      headers
    };

    try {
      const response = await fetch(`${CONFIG.API_BASE_URL}${endpoint}`, config);
      const data = await response.json();

      if (response.status === 401 || response.status === 403) {
        if (!window.location.pathname.includes('login.html')) {
          localStorage.removeItem(CONFIG.STORAGE_TOKEN_KEY);
          localStorage.removeItem(CONFIG.STORAGE_USER_KEY);
          window.location.href = 'login.html';
        }
      }

      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  // Helper methods for quick invocation
  get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  },

  post(endpoint, body) {
    return this.request(endpoint, {
      method: 'POST',
      body: body instanceof FormData ? body : JSON.stringify(body)
    });
  },

  put(endpoint, body) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body)
    });
  },

  delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }
};