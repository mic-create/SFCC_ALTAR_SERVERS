/* SFCC Altar Servers Attendance System — frontend/js/attendance.js */
let currentAttendanceState = [];
let currentMeetingId = null;

document.addEventListener('DOMContentLoaded', () => {
  if (window.location.pathname.includes('attendance.html')) {
    const urlParams = new URLSearchParams(window.location.search);
    currentMeetingId = urlParams.get('meetingId');

    if (!currentMeetingId) {
      alert('No meeting selected.');
      window.location.href = 'meetings.html';
      return;
    }

    loadAttendanceData(currentMeetingId);
  }
});

async function loadAttendanceData(meetingId) {
  try {
    const res = await API.request(`/attendance/meeting/${meetingId}`);
    if (res.success) {
      currentAttendanceState = res.data;
      renderAttendanceList(currentAttendanceState);
    }
  } catch (err) {
    Components.showToast('Failed to load attendance sheet', 'error');
  }
}

function renderAttendanceList(list) {
  const container = document.getElementById('attendance-container');
  if (!container) return;

  container.innerHTML = list.map((item, index) => `
    <div class="attendance-item">
      <div>
        <strong>${item.code} - ${item.full_name}</strong>
        <span style="font-size:0.8rem; color:var(--text-muted); display:block;">${item.class_level}</span>
      </div>
      <div class="attendance-controls">
        <button 
          type="button"
          class="btn-att" 
          style="background: ${item.status === 'PRESENT' ? 'var(--status-present)' : 'rgba(255,255,255,0.1)'}; color:#fff;"
          onclick="setStatus(${index}, 'PRESENT')">
          PRESENT
        </button>
        <button 
          type="button"
          class="btn-att" 
          style="background: ${item.status === 'ABSENT' ? 'var(--status-absent)' : 'rgba(255,255,255,0.1)'}; color:#fff;"
          onclick="setStatus(${index}, 'ABSENT')">
          ABSENT
        </button>
      </div>
    </div>
  `).join('');
}

function setStatus(index, status) {
  currentAttendanceState[index].status = status;
  renderAttendanceList(currentAttendanceState);
}

async function saveAttendance() {
  try {
    const records = currentAttendanceState.map(i => ({
      member_id: i.member_id,
      status: i.status
    }));

    const res = await API.request(`/attendance/meeting/${currentMeetingId}`, {
      method: 'POST',
      body: JSON.stringify({ records })
    });

    if (res.success) {
      Components.showToast('Attendance successfully updated!', 'info');
    }
  } catch (err) {
    Components.showToast('Failed to save attendance', 'error');
  }
}