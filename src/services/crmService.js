import { supabase } from "@/services/supabase";

export async function addLead(lead) {
  const { data, error } = await supabase
    .from("leads")
    .insert([lead])
    .select();

  if (error) {
    console.error(error);
    throw error;
  }

  return data;
}

export async function getLeads() {
  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    throw error;
  }

  return data;
}