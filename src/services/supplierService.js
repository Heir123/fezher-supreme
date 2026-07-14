import { supabase } from "./supabase";

/*
|--------------------------------------------------------------------------
| Get All Suppliers
|--------------------------------------------------------------------------
*/

export async function getSuppliers() {
  const { data, error } = await supabase
    .from("suppliers")
    .select("*")
    .order("name", { ascending: true });

  console.log("Suppliers data:", data);
  console.log("Suppliers error:", error);

  if (error) throw error;

  return data;
}

/*
|--------------------------------------------------------------------------
| Add Supplier
|--------------------------------------------------------------------------
*/

export async function addSupplier(supplier) {
  const { data, error } = await supabase
    .from("suppliers")
    .insert([supplier])
    .select()
    .single();

  if (error) {
    console.error("addSupplier:", error);
    throw error;
  }

  return data;
}

/*
|--------------------------------------------------------------------------
| Update Supplier
|--------------------------------------------------------------------------
*/

export async function updateSupplier(id, supplier) {
  const { data, error } = await supabase
    .from("suppliers")
    .update(supplier)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("updateSupplier:", error);
    throw error;
  }

  return data;
}

/*
|--------------------------------------------------------------------------
| Delete Supplier
|--------------------------------------------------------------------------
*/

export async function deleteSupplier(id) {
  const { error } = await supabase
    .from("suppliers")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("deleteSupplier:", error);
    throw error;
  }

  return true;
}