import { useEffect, useState } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";

import FinanceCards from "./FinanceCards";
import FinanceDashboardChart from "./FinanceDashboardChart";

import { getFinanceSummary } from "@/services/financeService";

export default function FinanceDashboard() {
  const [summary, setSummary] = useState({
    revenue: 0,
    expenses: 0,
    profit: 0,
    outstandingInvoices: 0,
    outstandingInvoiceCount: 0,
    totalSales: 0,
    totalPurchases: 0,
    averageSale: 0,
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const data = await getFinanceSummary();

      console.log("FINANCE DATA:", data);

      const completedSales = data.completedSales || [];
      const receivedPurchases = data.receivedPurchases || [];

      setSummary({
        ...data,

        // Total number of completed sales
        totalSales: completedSales.length,

        // Total number of received purchases
        totalPurchases: receivedPurchases.length,

        // Average sale value
        averageSale:
          completedSales.length > 0
            ? Number(data.revenue || 0) / completedSales.length
            : 0,
      });
    } catch (error) {
      console.error("FINANCE ERROR:", error);
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">
            Finance Dashboard
          </h1>

          <p className="text-slate-500">
            Revenue, expenses and profit overview.
          </p>
        </div>

        {/* Main Finance Cards */}
        <FinanceCards
          totalIncome={summary.revenue}
          totalExpenses={summary.expenses}
          profit={summary.profit}
          outstandingInvoices={summary.outstandingInvoices}
          totalSales={summary.totalSales}
          totalPurchases={summary.totalPurchases}
          averageSale={summary.averageSale}
        />

        {/* Finance Chart */}
        <FinanceDashboardChart
          summary={summary}
        />

      </div>
    </DashboardLayout>
  );
}