/* SFCC Altar Servers Attendance System — frontend/js/auth.js */

const Auth = {
  async login(email, password) {
    const errorMessage = document.getElementById('errorMessage');
    const submitBtn = document.getElementById('submitBtn');

    if (!email || !password) {
      if (errorMessage) errorMessage.textContent = 'Please enter both email and password.';
      return;
    }

    try {
      if (submitBtn) submitBtn.disabled = true;
      if (errorMessage) errorMessage.textContent = '';

      // API.post automatically targets https://sfcc-altar-servers-1.onrender.com/api
      const response = await window.API.post('/auth/login', { email, password });

      if (response.success && response.token) {
        localStorage.setItem(window.CONFIG.STORAGE_TOKEN_KEY, response.token);
        localStorage.setItem(window.CONFIG.STORAGE_USER_KEY, JSON.stringify(response.user));
        window.location.href = 'dashboard.html';
      } else {
        throw new Error(response.message || 'Login failed.');
      }
    } catch (err) {
      if (errorMessage) {
        errorMessage.textContent = err.message || 'Authentication failed. Please check your credentials.';
      }
    } finally {
      if (submitBtn) submitBtn.disabled = false;
    }
  },

  logout() {
    localStorage.removeItem(window.CONFIG.STORAGE_TOKEN_KEY);
    localStorage.removeItem(window.CONFIG.STORAGE_USER_KEY);
    window.location.href = 'login.html';
  }
};

// EXPLICIT GLOBAL EXPORT — Binds Auth to the window object so inline scripts can access it
window.Auth = Auth;