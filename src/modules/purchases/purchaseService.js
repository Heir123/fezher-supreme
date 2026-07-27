import { supabase } from "./supabase";

export async function getPurchases() {
  const { data, error } = await supabase
    .from("purchases")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data;
}