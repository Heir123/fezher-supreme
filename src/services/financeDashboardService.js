import { supabase } from "@/services/supabase";

export async function getFinanceDashboard(
  startDate = null,
  endDate = null
) {
  // ---------------------------------------
  // SALES QUERY
  // ---------------------------------------
  let salesQuery = supabase
    .from("sales")
    .select("*");

  // ---------------------------------------
  // PURCHASES QUERY
  // ---------------------------------------
  let purchasesQuery = supabase
    .from("purchases")
    .select("*");

  // ---------------------------------------
  // DATE FILTERS
  // ---------------------------------------
  if (startDate) {
    salesQuery = salesQuery.gte(
      "created_at",
      startDate
    );

    purchasesQuery = purchasesQuery.gte(
      "created_at",
      startDate
    );
  }

  if (endDate) {
    salesQuery = salesQuery.lte(
      "created_at",
      endDate
    );

    purchasesQuery = purchasesQuery.lte(
      "created_at",
      endDate
    );
  }

  // ---------------------------------------
  // LOAD DATA
  // ---------------------------------------
  const [
    salesResult,
    purchasesResult,
  ] = await Promise.all([
    salesQuery,
    purchasesQuery,
  ]);

  // ---------------------------------------
  // ERROR HANDLING
  // ---------------------------------------
  if (salesResult.error) {
    throw salesResult.error;
  }

  if (purchasesResult.error) {
    throw purchasesResult.error;
  }

  // ---------------------------------------
  // NORMALIZE DATA
  // ---------------------------------------
  const sales = salesResult.data || [];
  const purchases = purchasesResult.data || [];

  // ---------------------------------------
  // REVENUE
  // ---------------------------------------
  const revenue = sales.reduce(
    (sum, item) =>
      sum + Number(item.total_amount || 0),
    0
  );

  // ---------------------------------------
  // RECEIVED PURCHASES ONLY
  // ---------------------------------------
  const receivedPurchases = purchases.filter(
    (item) =>
      String(item.status || "").toLowerCase() ===
      "received"
  );

  // ---------------------------------------
  // EXPENSES
  // ---------------------------------------
  const expenses = receivedPurchases.reduce(
    (sum, item) =>
      sum + Number(item.total_amount || 0),
    0
  );

  // ---------------------------------------
  // PROFIT
  // ---------------------------------------
  const profit = revenue - expenses;

  // ---------------------------------------
  // AVERAGE SALE
  // ---------------------------------------
  const averageSale =
    sales.length > 0
      ? revenue / sales.length
      : 0;

  // ---------------------------------------
  // PROFIT MARGIN
  // ---------------------------------------
  const profitMargin =
    revenue > 0
      ? (profit / revenue) * 100
      : 0;

  // ---------------------------------------
  // EXPENSE / REVENUE
  // ---------------------------------------
  const expenseRatio =
    revenue > 0
      ? (expenses / revenue) * 100
      : 0;

  // ---------------------------------------
  // FINANCIAL TRANSACTIONS
  // ---------------------------------------
  const financialTransactions = [
    ...sales.map((sale) => ({
      id: sale.id,
      date: sale.created_at,
      type: "Revenue",
      reference:
        sale.invoice_number ||
        sale.order_number ||
        "-",
      status: sale.status || "Paid",
      amount: Number(
        sale.total_amount || 0
      ),
    })),

    ...receivedPurchases.map((purchase) => ({
      id: purchase.id,
      date: purchase.created_at,
      type: "Expense",
      reference:
        purchase.purchase_number ||
        purchase.order_number ||
        "-",
      status:
        purchase.status || "Received",
      amount: Number(
        purchase.total_amount || 0
      ),
    })),
  ].sort(
    (a, b) =>
      new Date(b.date) -
      new Date(a.date)
  );

  // ---------------------------------------
  // RETURN DASHBOARD DATA
  // ---------------------------------------
  return {
    revenue,
    expenses,
    profit,

    totalSales: sales.length,

    totalPurchases:
      purchases.length,

    averageSale,

    profitMargin,

    expenseRatio,

    sales,

    purchases,

    financialTransactions,
  };
}