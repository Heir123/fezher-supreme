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

  if (salesResult.error) throw salesResult.error;
  if (purchasesResult.error) throw purchasesResult.error;

  const sales = salesResult.data || [];
  const purchases = purchasesResult.data || [];

  const revenue = sales.reduce(
    (sum, item) => sum + Number(item.total_amount || 0),
    0
  );

  const expenses = purchases.reduce(
    (sum, item) => sum + Number(item.total_amount || 0),
    0
  );

  const profit = revenue - expenses;

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
  };

}