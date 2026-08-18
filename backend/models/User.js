/* SFCC Altar Servers Attendance System — backend/models/User.js */
const db = require('../config/database');

class User {
  static async findByEmail(email) {
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0];
  }

  static async findById(id) {
    const result = await db.query('SELECT id, name, email, role, is_active, created_at FROM users WHERE id = $1', [id]);
    return result.rows[0];
  }

  static async create({ name, email, passwordHash, role }) {
    const result = await db.query(
      `INSERT INTO users (name, email, password_hash, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, email, role, created_at`,
      [name, email, passwordHash, role || 'ATTENDANCE_OFFICER']
    );
    return result.rows[0];
  }
}

module.exports = User;