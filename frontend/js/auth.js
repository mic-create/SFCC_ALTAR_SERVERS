/* SFCC Altar Servers Attendance System — frontend/js/auth.js */
const Auth = {
  init() {
    const token = localStorage.getItem(CONFIG.STORAGE_TOKEN_KEY);
    const isLoginPage = window.location.pathname.includes('login.html');

    if (!token && !isLoginPage) {
      window.location.href = 'login.html';
      return;
    }

    if (token && isLoginPage) {
      window.location.href = 'dashboard.html';
      return;
    }

    this.renderUserInfo();
  },

  async login(email, password) {
    try {
      const response = await API.request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });

      if (response.success) {
        localStorage.setItem(CONFIG.STORAGE_TOKEN_KEY, response.data.token);
        localStorage.setItem(CONFIG.STORAGE_USER_KEY, JSON.stringify(response.data.user));
        window.location.href = 'dashboard.html';
      }
    } catch (error) {
      Components.showToast(error.message, 'error');
    }
  },

  logout() {
    localStorage.removeItem(CONFIG.STORAGE_TOKEN_KEY);
    localStorage.removeItem(CONFIG.STORAGE_USER_KEY);
    window.location.href = 'login.html';
  },

  getUser() {
    const userStr = localStorage.getItem(CONFIG.STORAGE_USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  },

  renderUserInfo() {
    const user = this.getUser();
    if (!user) return;

    const userNameEl = document.getElementById('user-display-name');
    const userRoleEl = document.getElementById('user-display-role');

    if (userNameEl) userNameEl.textContent = user.name;
    if (userRoleEl) userRoleEl.textContent = user.role;
  }
};

document.addEventListener('DOMContentLoaded', () => Auth.init());