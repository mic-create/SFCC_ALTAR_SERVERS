/* SFCC Altar Servers Attendance System — backend/services/reportService.js */
const db = require('../config/database');

class ReportService {
  static async getOverviewStats() {
    const totalMembersQuery = "SELECT COUNT(*) FROM members WHERE status = 'ACTIVE'";
    const totalMeetingsQuery = "SELECT COUNT(*) FROM meetings";
    const avgAttendanceQuery = `
      SELECT ROUND(AVG(present_ratio) * 100, 1) as avg_percent
      FROM (
        SELECT meeting_id, 
               COUNT(*) FILTER (WHERE status = 'PRESENT')::DECIMAL / NULLIF(COUNT(*), 0) as present_ratio
        FROM attendance
        GROUP BY meeting_id
      ) sub;`;

    const recentMeetingsQuery = `
      SELECT m.id, m.title, m.date,
             COUNT(a.id) FILTER (WHERE a.status = 'PRESENT') as present,
             COUNT(a.id) as total
      FROM meetings m
      LEFT JOIN attendance a ON m.id = a.meeting_id
      GROUP BY m.id
      ORDER BY m.date DESC LIMIT 5`;

    const topAttendersQuery = `
      SELECT m.member_id, m.full_name, m.class_level,
             COUNT(a.id) FILTER (WHERE a.status = 'PRESENT') as attended,
             COUNT(a.id) as total_meetings,
             ROUND((COUNT(a.id) FILTER (WHERE a.status = 'PRESENT')::DECIMAL / NULLIF(COUNT(a.id), 0)) * 100, 1) as percentage
      FROM members m
      JOIN attendance a ON m.id = a.member_id
      GROUP BY m.id
      HAVING COUNT(a.id) > 0
      ORDER BY percentage DESC, attended DESC LIMIT 5`;

    const [membersRes, meetingsRes, avgRes, recentRes, topRes] = await Promise.all([
      db.query(totalMembersQuery),
      db.query(totalMeetingsQuery),
      db.query(avgAttendanceQuery),
      db.query(recentMeetingsQuery),
      db.query(topAttendersQuery)
    ]);

    return {
      totalActiveMembers: parseInt(membersRes.rows[0].count, 10),
      totalMeetings: parseInt(meetingsRes.rows[0].count, 10),
      averageAttendance: parseFloat(avgRes.rows[0]?.avg_percent || 0),
      recentMeetings: recentRes.rows,
      topAttenders: topRes.rows
    };
  }

  static async getMemberProfileReport(memberUuid) {
    const memberQuery = 'SELECT * FROM members WHERE id = $1';
    const memberRes = await db.query(memberQuery, [memberUuid]);
    if (memberRes.rows.length === 0) return null;

    const historyQuery = `
      SELECT m.id as meeting_id, m.title, m.date, m.time, a.status, a.marked_at
      FROM attendance a
      JOIN meetings m ON a.meeting_id = m.id
      WHERE a.member_id = $1
      ORDER BY m.date DESC`;
    const historyRes = await db.query(historyQuery, [memberUuid]);

    const totalMeetings = historyRes.rows.length;
    const attended = historyRes.rows.filter(r => r.status === 'PRESENT').length;
    const missed = totalMeetings - attended;
    const percentage = totalMeetings > 0 ? ((attended / totalMeetings) * 100).toFixed(1) : 0;

    return {
      member: memberRes.rows[0],
      stats: { totalMeetings, attended, missed, percentage },
      history: historyRes.rows
    };
  }
}

module.exports = ReportService;