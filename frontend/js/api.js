/* SFCC Altar Servers Attendance System — frontend/js/api.js */

const API = {
  async request(endpoint, options = {}) {
    const baseUrl = window.CONFIG ? window.CONFIG.API_BASE_URL : 'https://sfcc-altar-servers-1.onrender.com/api';
    const token = localStorage.getItem(window.CONFIG?.STORAGE_TOKEN_KEY || 'sfcc_auth_token');
    
    console.log("[API DEBUG] Fetching:", `${baseUrl}${endpoint}`);

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
      const response = await fetch(`${baseUrl}${endpoint}`, config);
      const data = await response.json();

      console.log("[API DEBUG] Response Status:", response.status, data);

      if (response.status === 401 || response.status === 403) {
        if (!window.location.pathname.includes('login.html')) {
          localStorage.removeItem(window.CONFIG?.STORAGE_TOKEN_KEY || 'sfcc_auth_token');
          localStorage.removeItem(window.CONFIG?.STORAGE_USER_KEY || 'sfcc_user_info');
          window.location.href = 'login.html';
        }
      }

      if (!response.ok) {
        throw new Error(data.message || data.error || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error('[API Error]:', error);
      throw error;
    }
  },

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

window.API = API;