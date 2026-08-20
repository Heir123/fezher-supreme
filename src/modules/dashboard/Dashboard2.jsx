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

// Helper function to get date range based on period
function getDateRange(period) {
  const now = new Date();
  const endDate = new Date(now);
  let startDate = new Date(now);

  switch (period) {
    case "today":
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(23, 59, 59, 999);
      break;
    case "week":
      startDate.setDate(now.getDate() - 7);
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(23, 59, 59, 999);
      break;
    case "month":
      startDate.setMonth(now.getMonth() - 1);
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(23, 59, 59, 999);
      break;
    case "quarter":
      startDate.setMonth(now.getMonth() - 3);
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(23, 59, 59, 999);
      break;
    case "year":
      startDate.setFullYear(now.getFullYear() - 1);
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(23, 59, 59, 999);
      break;
    case "all":
    default:
      startDate = new Date(2020, 0, 1); // Start from 2020
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(23, 59, 59, 999);
      break;
  }

  return {
    startDate,
    endDate
  };
}

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

      const { startDate, endDate } = getDateRange(period);
      
      // Log to debug
      console.log("Date range:", { period, startDate: startDate.toISOString(), endDate: endDate.toISOString() });

      const [executive, products, stock, recent] = await Promise.all([
        getExecutiveDashboard({ period, startDate, endDate }),
        getTopSellingProducts({ startDate, endDate }),
        getLowStockProducts(),
        getRecentActivities({ startDate, endDate }),
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
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading Dashboard...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 p-6">
        <DashboardHeader2 period={period} onPeriodChange={setPeriod} />

        <DashboardCards2 summary={stats || {}} />

        <DashboardCharts2
          salesData={stats?.revenueTrend || []}
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DashboardTopProducts2 products={topProducts} />
          <DashboardLowStock2 products={lowStock} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <DashboardQuickActions2 />
          </div>
          <div className="lg:col-span-1">
            <DashboardActivity2 activities={activities} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}