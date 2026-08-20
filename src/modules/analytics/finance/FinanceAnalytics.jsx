 import { useEffect, useState } from "react";

import DashboardLayout from "@/layouts/DashboardLayout";

import FinanceAnalyticsCards from "./FinanceAnalyticsCards";
import FinanceAnalyticsCharts from "./FinanceAnalyticsCharts";
import FinanceAnalyticsTable from "./FinanceAnalyticsTable";

import { getFinanceDashboard } from "@/services/analytics/financeDashboardService";

export default function FinanceAnalytics() {
  const [loading, setLoading] = useState(true);

  const [period, setPeriod] = useState("all");

  const [dashboard, setDashboard] = useState({
    revenue: 0,
    expenses: 0,
    profit: 0,
    totalSales: 0,
    totalPurchases: 0,
    averageSale: 0,
    sales: [],
    purchases: [],
    financialTransactions: [],
  });

  useEffect(() => {
    loadDashboard();
  }, [period]);

  function getDateRange() {
    const now = new Date();

    if (period === "all") {
      return {
        startDate: null,
        endDate: null,
      };
    }

    if (period === "today") {
      const start = new Date(now);
      start.setHours(0, 0, 0, 0);

      const end = new Date(now);
      end.setHours(23, 59, 59, 999);

      return {
        startDate: start.toISOString(),
        endDate: end.toISOString(),
      };
    }

    if (period === "month") {
      const start = new Date(
        now.getFullYear(),
        now.getMonth(),
        1
      );

      const end = new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        0,
        23,
        59,
        59,
        999
      );

      return {
        startDate: start.toISOString(),
        endDate: end.toISOString(),
      };
    }

    if (period === "year") {
      const start = new Date(
        now.getFullYear(),
        0,
        1
      );

      const end = new Date(
        now.getFullYear(),
        11,
        31,
        23,
        59,
        59,
        999
      );

      return {
        startDate: start.toISOString(),
        endDate: end.toISOString(),
      };
    }

    return {
      startDate: null,
      endDate: null,
    };
  }

  async function loadDashboard() {
    try {
      setLoading(true);

      const { startDate, endDate } =
        getDateRange();

      const data = await getFinanceDashboard(
        startDate,
        endDate
      );

      setDashboard(data);
    } catch (error) {
      console.error(
        "Finance Dashboard Error:",
        error
      );
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

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

          <div>
            <h1 className="text-3xl font-bold">
              Finance Analytics
            </h1>

            <p className="text-gray-500">
              Financial Intelligence Dashboard
            </p>
          </div>

          <div>
            <select
              value={period}
              onChange={(e) =>
                setPeriod(e.target.value)
              }
              className="border border-gray-300 rounded-lg px-4 py-2 bg-white shadow-sm"
            >
              <option value="all">
                All Time
              </option>

              <option value="today">
                Today
              </option>

              <option value="month">
                This Month
              </option>

              <option value="year">
                This Year
              </option>
            </select>
          </div>

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