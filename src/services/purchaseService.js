import { supabase } from "./supabase";

// Get Purchase Orders
export async function getPurchaseOrders() {
  const { data, error } = await supabase
    .from("purchase_orders")
    .select(`
      *,
      suppliers(name),
      companies(name)
    `)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data || [];
}

// Create Purchase Order
export async function createPurchaseOrder(order) {
  const { data, error } = await supabase
    .from("purchase_orders")
    .insert(order)
    .select()
    .single();

  if (error) throw error;

  return data;
}

// Update Purchase Order
export async function updatePurchaseOrder(id, order) {
  const { data, error } = await supabase
    .from("purchase_orders")
    .update(order)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  return data;
}

// Delete Purchase Order
export async function deletePurchaseOrder(id) {
  const { error } = await supabase
    .from("purchase_orders")
    .delete()
    .eq("id", id);

  if (error) throw error;
}