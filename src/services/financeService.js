 import { supabase } from "@/services/supabase";

export async function getFinanceSummary() {
  const [salesResult, purchasesResult] = await Promise.all([
    supabase
      .from("sales")
      .select(
        "id, invoice_number, total_amount, status, created_at"
      ),

    supabase
      .from("purchases")
      .select(
        "id, purchase_number, total_amount, status, created_at"
      ),
  ]);

  if (salesResult.error) {
    throw new Error(
      `Failed to load sales: ${salesResult.error.message}`
    );
  }

  if (purchasesResult.error) {
    throw new Error(
      `Failed to load purchases: ${purchasesResult.error.message}`
    );
  }

  const sales = salesResult.data || [];
  const purchases = purchasesResult.data || [];

  /*
   * -----------------------------------------
   * COMPLETED SALES
   * -----------------------------------------
   */
  const completedSales = sales.filter((sale) => {
    const status = String(sale.status || "")
      .trim()
      .toLowerCase();

    return (
      status === "paid" ||
      status === "completed" ||
      status === "finalized"
    );
  });

  /*
   * -----------------------------------------
   * REVENUE
   * -----------------------------------------
   */
  const revenue = completedSales.reduce(
    (sum, sale) =>
      sum + Number(sale.total_amount || 0),
    0
  );

  /*
   * -----------------------------------------
   * RECEIVED PURCHASES
   * -----------------------------------------
   */
  const receivedPurchases = purchases.filter((purchase) => {
    const status = String(purchase.status || "")
      .trim()
      .toLowerCase();

    return status === "received";
  });

  /*
   * -----------------------------------------
   * EXPENSES
   * -----------------------------------------
   */
  const expenses = receivedPurchases.reduce(
    (sum, purchase) =>
      sum + Number(purchase.total_amount || 0),
    0
  );

  /*
   * -----------------------------------------
   * OUTSTANDING INVOICES
   * -----------------------------------------
   */
  const outstandingSales = sales.filter((sale) => {
    const status = String(sale.status || "")
      .trim()
      .toLowerCase();

    return (
      status === "pending" ||
      status === "unpaid" ||
      status === "outstanding" ||
      status === "partial" ||
      status === "overdue"
    );
  });

  const outstandingInvoices = outstandingSales.reduce(
    (sum, sale) =>
      sum + Number(sale.total_amount || 0),
    0
  );

  const outstandingInvoiceCount =
    outstandingSales.length;

  /*
   * -----------------------------------------
   * NET PROFIT
   * -----------------------------------------
   */
  const profit = revenue - expenses;

  /*
   * -----------------------------------------
   * AVERAGE SALE
   * -----------------------------------------
   */
  const averageSale =
    completedSales.length > 0
      ? revenue / completedSales.length
      : 0;

  /*
   * -----------------------------------------
   * PROFIT MARGIN
   * -----------------------------------------
   */
  const profitMargin =
    revenue > 0
      ? (profit / revenue) * 100
      : 0;

  /*
   * -----------------------------------------
   * EXPENSE / REVENUE
   * -----------------------------------------
   */
  const expenseRevenueRatio =
    revenue > 0
      ? (expenses / revenue) * 100
      : 0;

  /*
   * -----------------------------------------
   * DAILY FINANCIAL TREND
   * -----------------------------------------
   *
   * Groups completed sales and received
   * purchases by calendar date.
   */
  const dailyMap = {};

  completedSales.forEach((sale) => {
    if (!sale.created_at) return;

    const date = new Date(sale.created_at)
      .toISOString()
      .split("T")[0];

    if (!dailyMap[date]) {
      dailyMap[date] = {
        date,
        revenue: 0,
        expenses: 0,
        profit: 0,
      };
    }

    dailyMap[date].revenue += Number(
      sale.total_amount || 0
    );
  });

  receivedPurchases.forEach((purchase) => {
    if (!purchase.created_at) return;

    const date = new Date(purchase.created_at)
      .toISOString()
      .split("T")[0];

    if (!dailyMap[date]) {
      dailyMap[date] = {
        date,
        revenue: 0,
        expenses: 0,
        profit: 0,
      };
    }

    dailyMap[date].expenses += Number(
      purchase.total_amount || 0
    );
  });

  const financialTrend = Object.values(dailyMap)
    .map((day) => ({
      ...day,
      profit: day.revenue - day.expenses,
    }))
    .sort(
      (a, b) =>
        new Date(a.date) - new Date(b.date)
    );

  /*
   * -----------------------------------------
   * FINANCIAL TRANSACTIONS
   * -----------------------------------------
   */
  const financialTransactions = [
    ...completedSales.map((sale) => ({
      id: sale.id,
      date: sale.created_at,
      type: "Revenue",
      reference:
        sale.invoice_number ||
        sale.order_number ||
        "-",
      status: sale.status || "Paid",
      amount: Number(sale.total_amount || 0),
    })),

    ...receivedPurchases.map((purchase) => ({
      id: purchase.id,
      date: purchase.created_at,
      type: "Expense",
      reference:
        purchase.purchase_number ||
        purchase.order_number ||
        "-",
      status: purchase.status || "Received",
      amount: Number(purchase.total_amount || 0),
    })),
  ].sort(
    (a, b) =>
      new Date(b.date) - new Date(a.date)
  );

  /*
   * -----------------------------------------
   * RETURN SUMMARY
   * -----------------------------------------
   */
  return {
    revenue,
    expenses,
    profit,

    outstandingInvoices,
    outstandingInvoiceCount,

    totalSales: completedSales.length,
    totalPurchases: receivedPurchases.length,

    averageSale,
    profitMargin,
    expenseRevenueRatio,

    completedSales,
    receivedPurchases,
    outstandingSales,

    financialTransactions,
    financialTrend,
  };
}