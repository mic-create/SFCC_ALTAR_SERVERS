/* SFCC Altar Servers Attendance System — frontend/js/config.js */

const IS_LOCAL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

const CONFIG = {
  // Dynamically points to localhost during development, Render in production
  API_BASE_URL: IS_LOCAL 
    ? 'http://localhost:5000/api' 
    : 'https://sfcc-altar-servers-1.onrender.com/api',
    
  STORAGE_TOKEN_KEY: 'sfcc_auth_token',
  STORAGE_USER_KEY: 'sfcc_user_info'
};

// Explicitly bind to window to prevent ReferenceErrors
window.CONFIG = CONFIG;