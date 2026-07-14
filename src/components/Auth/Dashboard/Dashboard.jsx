import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import StatCard from "./StatCard";

function Dashboard() {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />

      <div style={{ flex: 1, background: "#f1f5f9", minHeight: "100vh" }}>
        <Topbar />

        <div
          style={{
            padding: "30px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
            gap: "20px",
          }}
        >
          <StatCard title="Today's Sales" value="R12,500" />
          <StatCard title="Products" value="1,245" />
          <StatCard title="Customers" value="845" />
          <StatCard title="Invoices" value="215" />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;