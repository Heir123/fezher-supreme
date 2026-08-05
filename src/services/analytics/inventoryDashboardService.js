import { supabase } from "@/services/supabase";

export async function getInventoryDashboard() {

  const { data, error } = await supabase
    .from("products")
    .select("*");

  if (error) throw error;

  const products = data || [];

  const totalProducts = products.length;

  const totalStock = products.reduce(
    (sum, product) =>
      sum + Number(product.stock_quantity || 0),
    0
  );

  const inventoryValue = products.reduce(
    (sum, product) =>
      sum +
      Number(product.stock_quantity || 0) *
      Number(product.cost_price || 0),
    0
  );

  const lowStock = products.filter(
    (product) =>
      Number(product.stock_quantity || 0) <=
      Number(product.minimum_stock || 0)
  ).length;

  return {
    products,
    totalProducts,
    totalStock,
    inventoryValue,
    lowStock,
  };
}