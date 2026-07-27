import { supabase } from "@/services/supabase";

// Get all follow-ups
export async function getFollowUps() {
  const { data, error } = await supabase
    .from("follow_ups")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data;
}

// Add a follow-up
export async function addFollowUp(followUp) {
  const { data, error } = await supabase
    .from("follow_ups")
    .insert([followUp])
    .select();

  if (error) throw error;

  return data;
}