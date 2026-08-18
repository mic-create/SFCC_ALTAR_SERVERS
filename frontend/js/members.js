/* SFCC Altar Servers Attendance System — frontend/js/members.js */
let currentMembers = [];

document.addEventListener('DOMContentLoaded', () => {
  if (window.location.pathname.includes('members.html')) {
    loadMembers();
    setupCSVUpload();
  }
});

async function loadMembers() {
  const tableBody = document.getElementById('members-table-body');
  if (!tableBody) return;

  try {
    const response = await API.request('/members');
    if (response.success) {
      currentMembers = response.data.members;
      renderMembersTable(currentMembers);
    }
  } catch (error) {
    Components.showToast('Failed to load member records', 'error');
  }
}

function renderMembersTable(members) {
  const tableBody = document.getElementById('members-table-body');
  if (members.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:2rem;">No altar servers registered yet.</td></tr>`;
    return;
  }

  tableBody.innerHTML = members.map(m => `
    <tr>
      <td><strong>${m.member_id}</strong></td>
      <td>${m.full_name}</td>
      <td>${m.class_level}</td>
      <td><span class="status-badge ${m.status === 'ACTIVE' ? 'badge-active' : 'badge-inactive'}">${m.status}</span></td>
      <td>
        <button onclick="toggleMemberStatus('${m.id}', '${m.status}')" class="btn-logout" style="font-size:0.75rem;">
          ${m.status === 'ACTIVE' ? 'Deactivate' : 'Reactivate'}
        </button>
      </td>
    </tr>
  `).join('');
}

async function toggleMemberStatus(id, currentStatus) {
  const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
  try {
    const res = await API.request(`/members/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status: newStatus })
    });
    if (res.success) {
      Components.showToast(`Member status updated to ${newStatus}`, 'info');
      loadMembers();
    }
  } catch (err) {
    Components.showToast(err.message, 'error');
  }
}

function setupCSVUpload() {
  const form = document.getElementById('csv-upload-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fileInput = document.getElementById('csv-file-input');
    if (!fileInput.files[0]) return;

    const formData = new FormData();
    formData.append('file', fileInput.files[0]);

    try {
      const res = await API.request('/members/import-preview', {
        method: 'POST',
        body: formData
      });

      if (res.success) {
        showCSVPreviewModal(res.data);
      }
    } catch (err) {
      Components.showToast(err.message, 'error');
    }
  });
}

function showCSVPreviewModal(importData) {
  const { validRecords, duplicateRecords, invalidRecords } = importData;
  alert(`CSV Parsed:\nValid: ${validRecords.length}\nDuplicates: ${duplicateRecords.length}\nInvalid: ${invalidRecords.length}`);
  
  if (validRecords.length > 0 && confirm(`Do you want to import ${validRecords.length} valid members?`)) {
    API.request('/members/import-confirm', {
      method: 'POST',
      body: JSON.stringify({ records: validRecords })
    }).then(res => {
      if (res.success) {
        Components.showToast(res.message, 'info');
        loadMembers();
      }
    });
  }
}