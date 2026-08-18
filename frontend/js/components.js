/* SFCC Altar Servers Attendance System — frontend/js/components.js */
const Components = {
  showToast(message, type = 'info') {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;

    container.appendChild(toast);

    setTimeout(() => {
      toast.remove();
    }, 4000);
  },

  renderSidebar(activePage) {
    const sidebarHtml = `
      <aside class="sidebar">
        <div class="sidebar-header">
          <img src="assets/images/logo.png" alt="SFCC Logo" class="sidebar-logo" onerror="this.src='https://via.placeholder.com/42/00f0ff/000000?text=SFCC'">
          <div class="sidebar-title">
            <h1>SFCC ALTAR SERVERS</h1>
            <span>ATTENDANCE SYSTEM</span>
          </div>
        </div>
        <ul class="nav-links">
          <li class="nav-item ${activePage === 'dashboard' ? 'active' : ''}">
            <a href="dashboard.html">Dashboard</a>
          </li>
          <li class="nav-item ${activePage === 'members' ? 'active' : ''}">
            <a href="members.html">Members</a>
          </li>
          <li class="nav-item ${activePage === 'meetings' ? 'active' : ''}">
            <a href="meetings.html">Meetings</a>
          </li>
          <li class="nav-item ${activePage === 'reports' ? 'active' : ''}">
            <a href="reports.html">Reports</a>
          </li>
        </ul>
      </aside>
    `;
    return sidebarHtml;
  }
};