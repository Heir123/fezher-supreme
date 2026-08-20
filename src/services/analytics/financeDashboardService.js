 import { supabase } from "@/services/supabase";

export async function getFinanceDashboard(startDate = null, endDate = null) {
  let salesQuery = supabase
    .from("sales")
    .select("*");

  let purchasesQuery = supabase
    .from("purchases")
    .select("*");

  // Apply date filtering when dates are provided.
  if (startDate) {
    salesQuery = salesQuery.gte("created_at", startDate);
    purchasesQuery = purchasesQuery.gte("created_at", startDate);
  }

  if (endDate) {
    salesQuery = salesQuery.lte("created_at", endDate);
    purchasesQuery = purchasesQuery.lte("created_at", endDate);
  }

  const [salesResult, purchasesResult] = await Promise.all([
    salesQuery,
    purchasesQuery,
  ]);

  if (salesResult.error) {
    throw salesResult.error;
  }

  if (purchasesResult.error) {
    throw purchasesResult.error;
  }

  const sales = salesResult.data || [];
  const purchases = purchasesResult.data || [];

  const revenue = sales.reduce(
    (sum, item) =>
      sum + Number(item.total_amount || 0),
    0
  );

  const receivedPurchases = purchases.filter(
    (item) =>
      String(item.status || "").toLowerCase() === "received"
  );

  const expenses = receivedPurchases.reduce(
    (sum, item) =>
      sum + Number(item.total_amount || 0),
    0
  );

  const profit = revenue - expenses;

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

  return {
    revenue,
    expenses,
    profit,

    totalSales: sales.length,
    totalPurchases: purchases.length,

    averageSale:
      sales.length > 0
        ? revenue / sales.length
        : 0,

    sales,
    purchases,
    financialTransactions,
  };
}