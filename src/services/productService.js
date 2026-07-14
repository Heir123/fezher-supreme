import { supabase } from "./supabase";

export async function getProducts() {
  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      companies(name),
      categories(name)
    `);

  console.log("Supabase Error:", error);
  console.log("Supabase Data:", data);

  if (error) throw error;

  return data;
}

export async function addProduct(product) {
  const { data, error } = await supabase
    .from("products")
    .insert([
      {
        name: product.name,
        sku: product.sku,
        description: product.description,
        price: product.price,
        stock: product.stock,
        company_id: product.company_id,
        category_id: product.category_id,
      },
    ])
    .select();

 console.log("Supabase data:", data);
console.log("Supabase error:", error);

if (error) throw error;

return data;
}

export async function updateProduct(id, product) {
  const { data, error } = await supabase
    .from("products")
    .update({
      name: product.name,
      sku: product.sku,
      description: product.description,
      price: product.price,
      stock: product.stock,
      company_id: product.company_id,
      category_id: product.category_id,
    })
    .eq("id", id)
    .select();

  if (error) {
    throw error;
  }

  return data;
}