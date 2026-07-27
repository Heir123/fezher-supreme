import { supabase } from "./supabase";

/*
|--------------------------------------------------------------------------
| Get Products
|--------------------------------------------------------------------------
*/

export async function getProducts() {
  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      companies(name),
      categories(name),
       suppliers(name)
    `)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data;
}

/*
|--------------------------------------------------------------------------
| Add Product
|--------------------------------------------------------------------------
*/

export async function addProduct(product) {
  const payload = {
    company_id: product.company_id,
    category_id: product.category_id || null,
    supplier_id: product.supplier_id || null,

    name: product.name,
    sku: product.sku || null,
    description: product.description || null,

    cost_price: Number(product.cost_price || 0),
    selling_price: Number(product.selling_price || 0),

    stock_quantity: Number(product.stock_quantity || 0),
    minimum_stock: Number(product.minimum_stock || 0),
  };

  const { data, error } = await supabase
    .from("products")
    .insert([payload])
    .select()
    .single();

  if (error) {
    console.error("Add Product Error:", error);
    throw error;
  }

  return data;
}

/*
|--------------------------------------------------------------------------
| Update Product
|--------------------------------------------------------------------------
*/

export async function updateProduct(id, product) {
  const payload = {
    company_id: product.company_id,
    category_id: product.category_id || null,
    supplier_id: product.supplier_id || null,

    name: product.name,
    sku: product.sku || null,
    description: product.description || null,

    cost_price: Number(product.cost_price || 0),
    selling_price: Number(product.selling_price || 0),

    stock_quantity: Number(product.stock_quantity || 0),
    minimum_stock: Number(product.minimum_stock || 0),
  };

  const { data, error } = await supabase
    .from("products")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Update Product Error:", error);
    throw error;
  }

  return data;
}

/*
|--------------------------------------------------------------------------
| Delete Product
|--------------------------------------------------------------------------
*/

export async function deleteProduct(id) {
  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", id);

  if (error) throw error;

  return true;
}