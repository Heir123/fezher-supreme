import { supabase } from "@/services/supabase";

export async function getFinanceDashboard() {
  const [
    salesResult,
    purchasesResult,
  ] = await Promise.all([
    supabase
      .from("sales")
      .select("*"),

    supabase
      .from("purchases")
      .select("*"),
  ]);

  if (salesResult.error) {
    console.error("Sales Error:", salesResult.error);
    throw salesResult.error;
  }

  if (purchasesResult.error) {
    console.error("Purchases Error:", purchasesResult.error);
    throw purchasesResult.error;
  }

  const sales = salesResult.data || [];
  const purchases = purchasesResult.data || [];

  const revenue = sales.reduce(
    (total, sale) =>
      total + Number(sale.total_amount || 0),
    0
  );

  const expenses = purchases.reduce(
    (total, purchase) =>
      total + Number(purchase.total_amount || 0),
    0
  );

  const profit = revenue - expenses;

  const totalSales = sales.length;
  const totalPurchases = purchases.length;

  const averageSale =
    totalSales > 0
      ? revenue / totalSales
      : 0;

  const averagePurchase =
    totalPurchases > 0
      ? expenses / totalPurchases
      : 0;

  return {
    revenue,
    expenses,
    profit,

    totalSales,
    totalPurchases,

    averageSale,
    averagePurchase,

    sales,
    purchases,
  };
}