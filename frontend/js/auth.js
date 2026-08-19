/* SFCC Altar Servers Attendance System — frontend/js/auth.js */

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');

  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const emailInput = document.getElementById('email');
      const passwordInput = document.getElementById('password');
      const submitBtn = document.getElementById('submitBtn');
      const errorMessage = document.getElementById('errorMessage');

      const email = emailInput.value.trim();
      const password = passwordInput.value;

      if (!email || !password) {
        if (errorMessage) errorMessage.textContent = 'Please enter both email and password.';
        return;
      }

      try {
        if (submitBtn) submitBtn.disabled = true;
        if (errorMessage) errorMessage.textContent = '';

        // Call Express backend endpoint: POST /api/auth/login
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
    });
  }
});