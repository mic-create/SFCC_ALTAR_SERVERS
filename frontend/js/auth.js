/* SFCC Altar Servers Attendance System — frontend/js/auth.js */

const Auth = {
  async login(email, password) {
    console.log("[AUTH DEBUG] Starting login for:", email);

    // Make API request to Render Express backend
    const response = await window.API.post('/auth/login', { email, password });

    console.log("[AUTH DEBUG] Login API Response:", response);

    // Extract token regardless of whether backend returns { token } or { data: { token } }
    const token = response.token || response.data?.token;
    const user = response.user || response.data?.user;

    if (token) {
      const tokenKey = window.CONFIG?.STORAGE_TOKEN_KEY || 'sfcc_auth_token';
      const userKey = window.CONFIG?.STORAGE_USER_KEY || 'sfcc_user_info';

      localStorage.setItem(tokenKey, token);
      if (user) {
        localStorage.setItem(userKey, JSON.stringify(user));
      }

      console.log("[AUTH DEBUG] Redirecting to dashboard.html...");
      window.location.href = 'dashboard.html';
      return response;
    } else {
      throw new Error(response.message || 'Invalid server response: Missing JWT token');
    }
  },

  logout() {
    localStorage.removeItem(window.CONFIG?.STORAGE_TOKEN_KEY || 'sfcc_auth_token');
    localStorage.removeItem(window.CONFIG?.STORAGE_USER_KEY || 'sfcc_user_info');
    window.location.href = 'login.html';
  }
};

window.Auth = Auth;