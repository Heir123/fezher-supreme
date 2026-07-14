function Topbar() {
  return (
    <div
      style={{
        background: "white",
        padding: "20px",
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <h2>Dashboard</h2>

      <div>
        🔔 Notifications | 👤 Admin
      </div>
    </div>
  );
}

export default Topbar;