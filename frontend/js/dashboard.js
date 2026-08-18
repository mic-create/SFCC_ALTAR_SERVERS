/* SFCC Altar Servers Attendance System — frontend/js/dashboard.js */
document.addEventListener('DOMContentLoaded', async () => {
  if (window.location.pathname.includes('dashboard.html')) {
    await loadDashboardStats();
  }
});

async function loadDashboardStats() {
  try {
    const res = await API.request('/reports/overview');
    if (res.success) {
      const data = res.data;
      document.getElementById('stat-members').textContent = data.totalActiveMembers;
      document.getElementById('stat-meetings').textContent = data.totalMeetings;
      document.getElementById('stat-avg').textContent = `${data.averageAttendance}%`;

      // Render Recent Meetings
      const recentBody = document.getElementById('recent-meetings-body');
      if (recentBody) {
        recentBody.innerHTML = data.recentMeetings.map(m => `
          <tr>
            <td>${m.title}</td>
            <td>${new Date(m.date).toLocaleDateString()}</td>
            <td>${m.present} / ${m.total}</td>
            <td><span class="status-badge badge-active">${m.total > 0 ? ((m.present/m.total)*100).toFixed(0) : 0}%</span></td>
            <td><a href="attendance.html?meetingId=${m.id}" style="color:var(--accent-cyan)">Open</a></td>
          </tr>
        `).join('');
      }
    }
  } catch (err) {
    Components.showToast('Failed to load overview analytics.', 'error');
  }
}