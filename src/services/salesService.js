import { supabase } from "./supabase";

/*
|--------------------------------------------------------------------------
| Get Sales
|--------------------------------------------------------------------------
*/

export async function getSales() {
  const { data, error } = await supabase
    .from("sales")
    .select(`
      *,
      customers(name)
    `)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data;
}

/*
|--------------------------------------------------------------------------
| Create Sale
|--------------------------------------------------------------------------
*/

export async function createSale(saleData) {
  const { data, error } = await supabase
    .from("sales")
    .insert([saleData])
    .select()
    .single();

  if (error) throw error;

  return data;
}

/*
|--------------------------------------------------------------------------
| Get Sale Items
|--------------------------------------------------------------------------
*/

export async function getSaleItems(saleId) {
  const { data, error } = await supabase
    .from("sale_items")
    .select(`
      *,
      products(name)
    `)
    .eq("sale_id", saleId);

  if (error) throw error;

  return data;
}
export async function reduceProductStock(
  productId,
  quantity
) {
  const { data: product, error: fetchError } =
    await supabase
      .from("products")
      .select("stock_quantity")
      .eq("id", productId)
      .single();

  if (fetchError) throw fetchError;

  const newStock =
    Number(product.stock_quantity) -
    Number(quantity);

  const { error } = await supabase
    .from("products")
    .update({
      stock_quantity: newStock,
    })
    .eq("id", productId);

  if (error) throw error;

  return true;
}