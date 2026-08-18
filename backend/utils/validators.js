/* SFCC Altar Servers Attendance System — backend/utils/validators.js */
const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

const sanitizeInput = (str) => {
  if (typeof str !== 'string') return str;
  return str.replace(/[<>]/g, '');
};

module.exports = {
  isValidEmail,
  sanitizeInput
};