import { supabase } from "./supabase";

export async function getLowStockProducts() {
  const { data, error } = await supabase
    .from("products")
    .select(`
      id,
      name,
      stock_quantity,
      minimum_stock
    `)
    .order("stock_quantity", {
      ascending: true,
    });

  if (error) {
    console.error(
      "Low stock service error:",
      error
    );

    throw error;
  }

  const lowStockProducts =
    (data || []).filter((product) => {
      const stock = Number(
        product.stock_quantity || 0
      );

      const minimumStock = Number(
        product.minimum_stock || 5
      );

      return stock <= minimumStock;
    });

  console.log(
    "Low stock products:",
    lowStockProducts
  );

  return lowStockProducts;
}