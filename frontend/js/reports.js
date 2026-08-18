/* SFCC Altar Servers Attendance System — frontend/js/reports.js */
document.addEventListener('DOMContentLoaded', async () => {
  if (window.location.pathname.includes('reports.html')) {
    try {
      const res = await API.request('/reports/overview');
      if (res.success) {
        renderTopAttenders(res.data.topAttenders);
      }
    } catch (err) {
      Components.showToast('Failed to load report analytics', 'error');
    }
  }
});

function renderTopAttenders(list) {
  const body = document.getElementById('top-attenders-body');
  if (!body) return;

  body.innerHTML = list.map(m => `
    <tr>
      <td>${m.member_id}</td>
      <td>${m.full_name}</td>
      <td>${m.class_level}</td>
      <td>${m.attended} / ${m.total_meetings}</td>
      <td><strong>${m.percentage}%</strong></td>
    </tr>
  `).join('');
}