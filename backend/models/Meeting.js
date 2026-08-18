/* SFCC Altar Servers Attendance System — backend/models/Meeting.js */
const db = require('../config/database');

class Meeting {
  static async getAll() {
    const query = `
      SELECT m.*, 
             COUNT(a.id) FILTER (WHERE a.status = 'PRESENT') as present_count,
             COUNT(a.id) FILTER (WHERE a.status = 'ABSENT') as absent_count,
             COUNT(a.id) as total_marked
      FROM meetings m
      LEFT JOIN attendance a ON m.id = a.meeting_id
      GROUP BY m.id
      ORDER BY m.date DESC, m.time DESC`;
    const result = await db.query(query);
    return result.rows;
  }

  static async findById(id) {
    const query = `
      SELECT m.*, u.name as creator_name
      FROM meetings m
      LEFT JOIN users u ON m.created_by = u.id
      WHERE m.id = $1`;
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  static async create({ title, date, time, venue, description, created_by }) {
    const result = await db.query(
      `INSERT INTO meetings (title, date, time, venue, description, created_by)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [title, date, time, venue || 'St. Francis Catholic Church', description, created_by]
    );
    return result.rows[0];
  }
}

module.exports = Meeting;