import { supabase } from "./supabase";

export async function getInventorySummary() {

  const { data, error } = await supabase
    .from("products")
    .select(`
      id,
      name,
      stock_quantity,
      minimum_stock,
      cost_price
    `);

  if (error) throw error;

  const totalProducts = data.length;

  const lowStock = data.filter(
    p =>
      Number(p.stock_quantity) <=
      Number(p.minimum_stock)
  ).length;

  const outOfStock = data.filter(
    p =>
      Number(p.stock_quantity) === 0
  ).length;

  const inventoryValue = data.reduce(
    (sum, p) =>
      sum +
      Number(p.stock_quantity) *
      Number(p.cost_price),
    0
  );

  return {
    totalProducts,
    lowStock,
    outOfStock,
    inventoryValue,
  };
}

export async function getRecentMovements() {

  const { data, error } = await supabase
    .from("stock_movements")
    .select(`
      *,
      products(name)
    `)
    .order("created_at", {
      ascending: false,
    })
    .limit(10);

  if (error) throw error;

  return data;
}