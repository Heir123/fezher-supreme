function Sidebar() {
  return (
    <div
      style={{
        width: "250px",
        background: "#0f172a",
        color: "white",
        minHeight: "100vh",
        padding: "20px",
      }}
    >
      <h2 style={{ color: "#3b82f6" }}>Fezher Supreme</h2>

      <hr />

      <p>🏠 Dashboard</p>
      <p>📦 Inventory</p>
      <p>🛒 Sales & POS</p>
      <p>👥 Customers</p>
      <p>🚚 Suppliers</p>
      <p>💰 Finance</p>
      <p>👨‍💼 Employees</p>
      <p>📊 Reports</p>
      <p>⚙️ Settings</p>
      <p>🚪 Logout</p>
    </div>
  );
}

export default Sidebar;