/* SFCC Altar Servers Attendance System — backend/models/Attendance.js */
const db = require('../config/database');

class Attendance {
  static async saveBatch(meetingId, records, markedBy) {
    const client = await db.pool.connect();
    try {
      await client.query('BEGIN');
      for (const record of records) {
        await client.query(
          `INSERT INTO attendance (meeting_id, member_id, status, marked_by)
           VALUES ($1, $2, $3, $4)
           ON CONFLICT (meeting_id, member_id)
           DO UPDATE SET status = EXCLUDED.status, marked_by = EXCLUDED.marked_by, updated_at = CURRENT_TIMESTAMP`,
          [meetingId, record.member_id, record.status, markedBy]
        );
      }
      await client.query('COMMIT');
      return true;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  static async getByMeetingId(meetingId) {
    const query = `
      SELECT a.*, m.member_id as member_code, m.full_name, m.class_level, u.name as marked_by_name
      FROM attendance a
      JOIN members m ON a.member_id = m.id
      LEFT JOIN users u ON a.marked_by = u.id
      WHERE a.meeting_id = $1
      ORDER BY m.full_name ASC`;
    const result = await db.query(query, [meetingId]);
    return result.rows;
  }
}

module.exports = Attendance;