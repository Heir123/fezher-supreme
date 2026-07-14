import { supabase } from "./supabase";

/*
|--------------------------------------------------------------------------
| Get All Customers
|--------------------------------------------------------------------------
*/

export async function getCustomers() {
  const { data, error } = await supabase
    .from("customers")
    .select("*")
    .order("name", { ascending: true });

  if (error) {
    console.error("getCustomers:", error);
    throw error;
  }

  return data;
}

/*
|--------------------------------------------------------------------------
| Add Customer
|--------------------------------------------------------------------------
*/

export async function addCustomer(customer) {
  const { data, error } = await supabase
    .from("customers")
    .insert([customer])
    .select()
    .single();

  if (error) {
    console.error("addCustomer:", error);
    throw error;
  }

  return data;
}

/*
|--------------------------------------------------------------------------
| Update Customer
|--------------------------------------------------------------------------
*/

export async function updateCustomer(id, customer) {
  const { data, error } = await supabase
    .from("customers")
    .update(customer)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("updateCustomer:", error);
    throw error;
  }

  return data;
}

/*
|--------------------------------------------------------------------------
| Delete Customer
|--------------------------------------------------------------------------
*/

export async function deleteCustomer(id) {
  const { error } = await supabase
    .from("customers")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("deleteCustomer:", error);
    throw error;
  }

  return true;
}