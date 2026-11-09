
function Sidebar({ activePage, onNavigate }) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: "▦" },
    { id: "tables", label: "Table Management", icon: "▤" },
    { id: "reservations", label: "Reservations", icon: "▣" },
    { id: "waitlist", label: "Waitlist", icon: "☷" },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-icon">T</div>
        <div>
          <h2>TableTurn</h2>
          <span>RESTAURANT MANAGEMENT</span>
        </div>
      </div>

      <div className="sidebar-section">
        <p className="sidebar-heading">MAIN MENU</p>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`sidebar-link ${
                activePage === item.id ? "active" : ""
              }`}
              onClick={() => onNavigate(item.id)}
            >
              <span className="sidebar-icon">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="sidebar-footer">
        <div className="admin-avatar">A</div>
        <div className="admin-info">
          <strong>Restaurant Admin</strong>
          <span>Management Panel</span>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
