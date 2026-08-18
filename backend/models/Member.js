/* SFCC Altar Servers Attendance System — backend/models/Member.js */
const db = require('../config/database');

class Member {
  static async getAll({ search, status, limit = 50, offset = 0 }) {
    let query = 'SELECT * FROM members WHERE 1=1';
    const params = [];
    let paramIndex = 1;

    if (search) {
      query += ` AND (full_name ILIKE $${paramIndex} OR member_id ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    if (status) {
      query += ` AND status = $${paramIndex}`;
      params.push(status);
      paramIndex++;
    }

    query += ` ORDER BY member_id ASC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);

    const result = await db.query(query, params);
    
    // Count total query
    let countQuery = 'SELECT COUNT(*) FROM members WHERE 1=1';
    const countParams = [];
    let cIdx = 1;
    if (search) {
      countQuery += ` AND (full_name ILIKE $${cIdx} OR member_id ILIKE $${cIdx})`;
      countParams.push(`%${search}%`);
      cIdx++;
    }
    if (status) {
      countQuery += ` AND status = $${cIdx}`;
      countParams.push(status);
    }
    
    const countResult = await db.query(countQuery, countParams);

    return {
      members: result.rows,
      total: parseInt(countResult.rows[0].count, 10)
    };
  }

  static async findById(id) {
    const result = await db.query('SELECT * FROM members WHERE id = $1', [id]);
    return result.rows[0];
  }

  static async findByMemberId(memberId) {
    const result = await db.query('SELECT * FROM members WHERE member_id = $1', [memberId]);
    return result.rows[0];
  }

  static async create({ member_id, full_name, class_level, status }) {
    const result = await db.query(
      `INSERT INTO members (member_id, full_name, class_level, status)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [member_id, full_name, class_level, status || 'ACTIVE']
    );
    return result.rows[0];
  }

  static async update(id, { full_name, class_level, status }) {
    const result = await db.query(
      `UPDATE members
       SET full_name = COALESCE($1, full_name),
           class_level = COALESCE($2, class_level),
           status = COALESCE($3, status)
       WHERE id = $4
       RETURNING *`,
      [full_name, class_level, status, id]
    );
    return result.rows[0];
  }

  static async toggleStatus(id, status) {
    const result = await db.query(
      'UPDATE members SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );
    return result.rows[0];
  }
}

module.exports = Member;