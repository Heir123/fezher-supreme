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
    .eq("status", "Active")
    .order("name", { ascending: true });

  if (error) throw error;

  return data;
}

/*
|--------------------------------------------------------------------------
| Add Supplier
|--------------------------------------------------------------------------
*/

export async function addSupplier(supplier) {
  // Automatically attach company_id
  const supplierData = {
    ...supplier,
    company_id: "196a067f-9cc4-4d99-88cd-f905b5a1ad3f",
  };

  console.log("Sending supplier:");
  console.table(supplierData);

  const { data, error } = await supabase
    .from("suppliers")
    .insert([supplierData])
    .select()
    .single();

  if (error) {
    console.error("Supabase Error:", error);
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
    console.error("DELETE ERROR:", error);
    console.log("Message:", error.message);
    console.log("Details:", error.details);
    console.log("Hint:", error.hint);
    console.log("Code:", error.code);

    alert(`
Message: ${error.message}

Details:
${error.details}

Hint:
${error.hint}

Code:
${error.code}
    `);

    throw error;
  }

  return true;
}