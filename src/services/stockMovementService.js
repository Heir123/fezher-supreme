import { supabase } from "./supabase";

/*
---------------------------------------
Record Stock Movement
---------------------------------------
*/

export async function addStockMovement({
  company_id,
  product_id,
  movement_type,
  quantity,
  reference_type = null,
  reference_id = null,
  notes = "",
  unit_cost = 0,
  total_value = 0,
  warehouse_id = null,
  batch_number = null,
  expiry_date = null,
}) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("stock_movements")
    .insert([
      {
        company_id,
        product_id,
        movement_type,
        quantity,
        reference_type,
        reference_id,
        notes,
        unit_cost,
        total_value,
        warehouse_id,
        batch_number,
        expiry_date,
        created_by: user?.id || null,
      },
    ])
    .select();

  if (error) throw error;

  return data;
}

/*
---------------------------------------
Get Product History
---------------------------------------
*/

export async function getProductStockHistory(productId) {
  const { data, error } = await supabase
    .from("stock_movements")
    .select("*")
    .eq("product_id", productId)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data || [];
}