import { useEffect, useState } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import DashboardCard from "./DashboardCard";
import QuickActions from "./QuickActions";
import { getDashboardStats } from "../../services/dashboardService";
import DashboardStats from "./DashboardStats";
import InventoryDashboard from "./InventoryDashboard";
import RecentActivity from "./RecentActivity";
import DashboardCharts from "./DashboardCharts";
export default function Dashboard() {
 const [stats, setStats] = useState({
  totalRevenue: 0,
  totalSales: 0,
  totalProducts: 0,
  totalCustomers: 0,
  lowStockProducts: 0,
});

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
  try {
   const data = await getDashboardStats();
console.log("Dashboard Data:", data);


    console.log("Dashboard Data:", data);

    setStats(data);
  } catch (error) {
    console.error(error);
    alert("Failed to load dashboard.");
  } finally {
    setLoading(false);
  }
}

  if (loading) {
  return (
    <DashboardLayout>
      <div className="flex items-center justify-center h-full">
        <p className="text-lg">Loading Dashboard...</p>
      </div>
    </DashboardLayout>
  );
}

  return (
  <DashboardLayout>

    <div className="space-y-8">

      <div>
        <h1 className="text-3xl font-bold">
          Dashboard
        </h1>
 <InventoryDashboard />

        <p className="text-gray-500">
          Welcome to Fezher Supreme ERP V2
        </p>
      </div>

     <DashboardStats
  totalRevenue={stats.totalRevenue}
  totalSales={stats.totalSales}
  totalProducts={stats.totalProducts}
  totalCustomers={stats.totalCustomers}
  lowStockProducts={stats.lowStockProducts}
/>

      </div>

      <QuickActions />
<RecentActivity />
<DashboardCharts />
      </DashboardLayout>
);
}