import { supabase } from "./supabase";

/*
|--------------------------------------------------------------------------
| Company ID
|--------------------------------------------------------------------------
*/

const COMPANY_ID = "196a067f-9cc4-4d99-88cd-f905b5a1ad3f";

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

  if (error) throw error;

  return data;
}

/*
|--------------------------------------------------------------------------
| Add Customer
|--------------------------------------------------------------------------
*/

export async function addCustomer(customer) {
  const payload = {
    company_id: COMPANY_ID,
    ...customer,
  };

  console.log("Saving Customer:", payload);

  const { data, error } = await supabase
    .from("customers")
    .insert([payload])
    .select()
    .single();

  if (error) {
    console.error(error);
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
  const payload = {
    company_id: COMPANY_ID,
    ...customer,
  };

  const { data, error } = await supabase
    .from("customers")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

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

  if (error) throw error;

  return true;
}