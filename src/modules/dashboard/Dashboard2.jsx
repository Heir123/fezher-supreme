import { useEffect, useState } from "react";

import DashboardLayout from "@/layouts/DashboardLayout";

import DashboardHeader2 from "./DashboardHeader2";
import DashboardCards2 from "./DashboardCards2";
import DashboardCharts2 from "./DashboardCharts2";
import DashboardTopProducts2 from "./DashboardTopProducts2";
import DashboardLowStock2 from "./DashboardLowStock2";
import DashboardQuickActions2 from "./DashboardQuickActions2";
import DashboardActivity2 from "./DashboardActivity2";

import { getExecutiveDashboard } from "@/services/executiveDashboardService";
import { getTopSellingProducts } from "@/services/topProductsService";
import { getLowStockProducts } from "@/services/lowStockService";
import { getRecentActivities } from "@/services/recentActivityService";

export default function Dashboard2() {
  const [period, setPeriod] = useState("all");

  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState(null);

  const [topProducts, setTopProducts] = useState([]);

  const [lowStock, setLowStock] = useState([]);

  const [activities, setActivities] = useState([]);

  useEffect(() => {
    loadDashboard();
  }, [period]);

  async function loadDashboard() {
    try {
      setLoading(true);

      const [
        executive,
        products,
        stock,
        recent,
      ] = await Promise.all([
        getExecutiveDashboard(period),
        getTopSellingProducts(period),
        getLowStockProducts(),
        getRecentActivities(period),
      ]);

      setStats(executive);
      setTopProducts(products);
      setLowStock(stock);
      setActivities(recent);
    } catch (error) {
      console.error("Dashboard Error:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center min-h-screen">
          Loading Dashboard...
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">

        <DashboardHeader2
          period={period}
          onPeriodChange={setPeriod}
        />

        <DashboardCards2
          summary={stats || {}}
        />

        <DashboardCharts2
          salesData={stats?.monthlySales || []}
          financeData={[
            {
              name: "Revenue",
              value: stats?.revenue || 0,
            },
            {
              name: "Expenses",
              value: stats?.expenses || 0,
            },
          ]}
        />

        <DashboardTopProducts2
          products={topProducts}
        />

        <DashboardLowStock2
          products={lowStock}
        />

        <DashboardQuickActions2 />

        <DashboardActivity2
          activities={activities}
        />

      </div>
    </DashboardLayout>
  );
}