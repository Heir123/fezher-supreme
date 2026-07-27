import { useEffect, useState } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { getFinanceSummary } from "@/services/financeService";

export default function FinanceDashboard() {
  const [summary, setSummary] = useState({
    revenue: 0,
    expenses: 0,
    profit: 0,
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const data = await getFinanceSummary();

      console.log("FINANCE DATA:", data);

      setSummary(data);
    } catch (error) {
      console.error("FINANCE ERROR:", error);
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">
            Finance Dashboard
          </h1>

          <p className="text-slate-500">
            Revenue, expenses and profit overview.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-gray-500">Revenue</h3>
            <p className="text-3xl font-bold text-green-600">
              R {summary.revenue.toFixed(2)}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-gray-500">Purchases</h3>
            <p className="text-3xl font-bold text-red-600">
              R {summary.expenses.toFixed(2)}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-gray-500">Profit</h3>
            <p className="text-3xl font-bold text-blue-600">
              R {summary.profit.toFixed(2)}
            </p>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}