import { supabase } from "./supabase";
import { deleteProductImage } from "./storageService";
import { addStockMovement } from "./stockMovementService";
/* ==========================================================
   GET PRODUCTS
========================================================== */

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

  return data || [];
}

/* ==========================================================
   ADD PRODUCT
========================================================== */

export async function addProduct(product) {
  const payload = {
    company_id: product.company_id || null,
    category_id: product.category_id || null,
    supplier_id: product.supplier_id || null,

    name: product.name || "",
    sku: product.sku || "",
    barcode: product.barcode || "",

    description: product.description || "",

    brand: product.brand || "",
    unit: product.unit || "",

    image_url: product.image_url || "",

    cost_price: Number(product.cost_price || 0),
    selling_price: Number(product.selling_price || 0),

    stock_quantity: Number(product.stock_quantity || 0),
    minimum_stock: Number(product.minimum_stock || 0),

    weight: Number(product.weight || 0),
    length: Number(product.length || 0),
    width: Number(product.width || 0),
    height: Number(product.height || 0),

    tax_rate: Number(product.tax_rate || 0),
    reorder_level: Number(product.reorder_level || 0),

    status: product.status || "Active",

    notes: product.notes || "",
  };

  const { data, error } = await supabase
    .from("products")
    .insert(payload)
    .select()
    .single();

  if (error) throw error;

  return data;
}

/* ==========================================================
   UPDATE PRODUCT
========================================================== */

export async function updateProduct(id, product) {

  // Get current product
  const { data: oldProduct, error: fetchError } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (fetchError) throw fetchError;

  const payload = {
    company_id: product.company_id || null,
    category_id: product.category_id || null,
    supplier_id: product.supplier_id || null,

    name: product.name || "",
    sku: product.sku || "",
    barcode: product.barcode || "",

    description: product.description || "",

    brand: product.brand || "",
    unit: product.unit || "",

    image_url: product.image_url || "",

    cost_price: Number(product.cost_price || 0),
    selling_price: Number(product.selling_price || 0),

    stock_quantity: Number(product.stock_quantity || 0),
    minimum_stock: Number(product.minimum_stock || 0),

    weight: Number(product.weight || 0),
    length: Number(product.length || 0),
    width: Number(product.width || 0),
    height: Number(product.height || 0),

    tax_rate: Number(product.tax_rate || 0),
    reorder_level: Number(product.reorder_level || 0),

    status: product.status || "Active",

    notes: product.notes || "",
  };

  const { data, error } = await supabase
    .from("products")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  // Detect stock change
  const oldQty = Number(oldProduct.stock_quantity || 0);
  const newQty = Number(payload.stock_quantity || 0);

  if (oldQty !== newQty) {

    const difference = newQty - oldQty;
console.log("Stock changed:", oldQty, "->", newQty);
console.log("Difference:", difference);
    await addStockMovement({

      company_id: payload.company_id,

      product_id: id,

      movement_type: "Adjustment",

      quantity: difference,

      reference_type: "MANUAL",

      reference_id: null,

      notes: "Stock adjusted manually",

      unit_cost: payload.cost_price,

      total_value: difference * payload.cost_price,

    });

  }

  return data;
}
/* ==========================================================
   DELETE PRODUCT
========================================================== */

export async function deleteProduct(id) {
  // Get the image URL first
  const { data: product, error: fetchError } = await supabase
    .from("products")
    .select("image_url")
    .eq("id", id)
    .single();

  if (fetchError) throw fetchError;

  // Delete image from Storage
  if (product?.image_url) {
    await deleteProductImage(product.image_url);
  }

  // Delete product from database
  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", id);

  if (error) throw error;

  return true;
}

/* ==========================================================
   INVENTORY SUMMARY
========================================================== */

export async function getInventorySummary() {
  const { data, error } = await supabase
    .from("products")
    .select(`
      stock_quantity,
      minimum_stock
    `);

  if (error) throw error;

  const total = data.length;

  const inStock = data.filter(
    (p) => Number(p.stock_quantity) > Number(p.minimum_stock)
  ).length;

  const lowStock = data.filter(
    (p) =>
      Number(p.stock_quantity) > 0 &&
      Number(p.stock_quantity) <= Number(p.minimum_stock)
  ).length;

  const outOfStock = data.filter(
    (p) => Number(p.stock_quantity) === 0
  ).length;

  return {
    total,
    inStock,
    lowStock,
    outOfStock,
  };
}