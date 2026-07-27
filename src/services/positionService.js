import { supabase } from "@/services/supabase";

export async function getPositions() {
  const { data, error } = await supabase
    .from("positions")
    .select("*")
    .order("title");

  if (error) throw error;
  return data;
}

export async function addPosition(position) {
  const { data, error } = await supabase
    .from("positions")
    .insert([position])
    .select();

  if (error) throw error;
  return data;
}

export async function updatePosition(id, position) {
  const { data, error } = await supabase
    .from("positions")
    .update(position)
    .eq("id", id)
    .select();

  if (error) throw error;
  return data;
}

export async function deletePosition(id) {
  const { error } = await supabase
    .from("positions")
    .delete()
    .eq("id", id);

  if (error) throw error;
}