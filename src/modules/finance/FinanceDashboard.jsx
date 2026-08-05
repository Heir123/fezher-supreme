import { useEffect, useState } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import FinanceCards from "./FinanceCards";
import { getFinanceSummary } from "@/services/financeService";

export default function FinanceDashboard() {
  const [summary, setSummary] = useState({
    revenue: 0,
    expenses: 0,
    profit: 0,
    outstandingInvoices: 0,
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

        <FinanceCards
          totalIncome={summary.revenue}
          totalExpenses={summary.expenses}
          profit={summary.profit}
          outstandingInvoices={summary.outstandingInvoices}
        />
      </div>
    </DashboardLayout>
  );
}