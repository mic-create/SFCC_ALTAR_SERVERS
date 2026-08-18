/* SFCC Altar Servers Attendance System — frontend/js/meetings.js */
document.addEventListener('DOMContentLoaded', () => {
  if (window.location.pathname.includes('meetings.html')) {
    loadMeetings();
    setupCreateMeetingForm();
  }
});

async function loadMeetings() {
  const container = document.getElementById('meetings-list');
  if (!container) return;

  try {
    const res = await API.request('/meetings');
    if (res.success) {
      if (res.data.length === 0) {
        container.innerHTML = `<div class="tech-card">No meetings recorded yet.</div>`;
        return;
      }

      container.innerHTML = res.data.map(m => `
        <div class="tech-card" style="margin-bottom: 1rem;">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <div>
              <h3 style="color:#fff;">${m.title}</h3>
              <p style="font-size:0.8rem; color:var(--text-muted);">${new Date(m.date).toDateString()} at ${m.time} | ${m.venue}</p>
            </div>
            <div>
              <a href="attendance.html?meetingId=${m.id}" class="btn-primary" style="text-decoration:none; font-size:0.8rem;">Mark Attendance</a>
            </div>
          </div>
        </div>
      `).join('');
    }
  } catch (err) {
    Components.showToast('Failed to load meetings', 'error');
  }
}

function setupCreateMeetingForm() {
  const form = document.getElementById('create-meeting-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('meeting-title').value;
    const date = document.getElementById('meeting-date').value;
    const time = document.getElementById('meeting-time').value;
    const venue = document.getElementById('meeting-venue').value;

    try {
      const res = await API.request('/meetings', {
        method: 'POST',
        body: JSON.stringify({ title, date, time, venue })
      });

      if (res.success) {
        Components.showToast('Meeting created successfully', 'info');
        form.reset();
        loadMeetings();
      }
    } catch (err) {
      Components.showToast(err.message, 'error');
    }
  });
}