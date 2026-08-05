import { useEffect, useState } from "react";

import DashboardLayout from "@/layouts/DashboardLayout";

import FinanceAnalyticsCards from "./FinanceAnalyticsCards";
import FinanceAnalyticsCharts from "./FinanceAnalyticsCharts";
import FinanceAnalyticsTable from "./FinanceAnalyticsTable";

import { getFinanceDashboard } from "@/services/analytics/financeDashboardService";

export default function FinanceAnalytics() {
  const [loading, setLoading] = useState(true);

  const [dashboard, setDashboard] = useState({
    revenue: 0,
    expenses: 0,
    profit: 0,
    sales: [],
    purchases: [],
  });

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      setLoading(true);

      const data = await getFinanceDashboard();

      setDashboard(data);
    } catch (error) {
      console.error("Finance Dashboard Error:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-screen">
          <div className="text-lg font-semibold">
            Loading Finance Analytics...
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">

        <div>
          <h1 className="text-3xl font-bold">
            Finance Analytics
          </h1>

          <p className="text-gray-500">
            Financial Intelligence Dashboard
          </p>
        </div>

        <FinanceAnalyticsCards
          dashboard={dashboard}
        />

        <FinanceAnalyticsCharts
          dashboard={dashboard}
        />

        <FinanceAnalyticsTable
          dashboard={dashboard}
        />

      </div>
    </DashboardLayout>
  );
}