import { supabase } from "@/services/supabase";

export async function addOpportunity(opportunity) {
  const { data, error } = await supabase
    .from("opportunities")
    .insert([opportunity])
    .select();

  if (error) throw error;

  return data;
}

export async function getOpportunities() {
  const { data, error } = await supabase
    .from("opportunities")
    .select(`
      *,
      leads (
        id,
        customer_name,
        email,
        phone
      )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("GET OPPORTUNITIES ERROR:", error);
    throw error;
  }

  return data || [];
}