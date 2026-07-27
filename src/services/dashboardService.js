import { supabase } from "./supabase";

export async function getDashboardStats() {
  const { data: sales = [] } = await supabase
    .from("sales")
    .select("*");

  const { data: products = [] } = await supabase
    .from("products")
    .select("*");

  const { data: customers = [] } = await supabase
    .from("customers")
    .select("*");

  const totalRevenue = sales.reduce(
    (sum, sale) => sum + Number(sale.total_amount || 0),
    0
  );

  const lowStockProducts = products.filter(
    (product) =>
      Number(product.stock_quantity || 0) <=
      Number(product.minimum_stock || 5)
  ).length;

  return {
    totalRevenue,
    totalSales: sales.length,
    totalProducts: products.length,
    totalCustomers: customers.length,
    lowStockProducts,
  };
}