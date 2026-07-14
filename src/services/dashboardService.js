import { supabase } from "./supabase";

export async function getDashboardStats() {
  const [
    { count: products },
    { count: customers },
    { count: suppliers },
    { count: sales },
  ] = await Promise.all([
    supabase
      .from("products")
      .select("*", { count: "exact", head: true }),

    supabase
      .from("customers")
      .select("*", { count: "exact", head: true }),

    supabase
      .from("suppliers")
      .select("*", { count: "exact", head: true }),

    supabase
      .from("sales")
      .select("*", { count: "exact", head: true }),
  ]);

  return {
    products: products ?? 0,
    customers: customers ?? 0,
    suppliers: suppliers ?? 0,
    sales: sales ?? 0,
  };
}