import { supabase } from "./supabase";
import { getDateRange } from "./dateFilter";

export async function getTopSellingProducts(filter = "all") {

  let query = supabase
    .from("sale_items")
    .select(`
      product_id,
      quantity,
      unit_price,
      products (
        id,
        name
      )
    `);

  const startDate = getDateRange(filter);

  if (startDate) {
    query = query.gte(
      "created_at",
      startDate.toISOString()
    );
  }

  const { data, error } = await query;

  if (error) throw error;

  const productMap = {};

  data.forEach((item) => {

    const id = item.product_id;

    if (!productMap[id]) {

      productMap[id] = {
        id,
        name: item.products?.name || "Unknown Product",
        quantity: 0,
        revenue: 0,
      };

    }

    productMap[id].quantity += Number(item.quantity || 0);

    productMap[id].revenue +=
      Number(item.quantity || 0) *
      Number(item.unit_price || 0);

  });

  return Object.values(productMap)
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5);
}