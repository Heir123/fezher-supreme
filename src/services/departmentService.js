import { supabase } from "@/services/supabase";

export async function getDepartments() {
  const { data, error } = await supabase
    .from("departments")
    .select("*")
    .order("name");

  if (error) throw error;

  return data;
}

export async function addDepartment(department) {
  const { data, error } = await supabase
    .from("departments")
    .insert([department])
    .select();

  if (error) throw error;

  return data;
}

export async function updateDepartment(id, department) {
  const { data, error } = await supabase
    .from("departments")
    .update(department)
    .eq("id", id)
    .select();

  if (error) throw error;

  return data;
}

export async function deleteDepartment(id) {
  const { error } = await supabase
    .from("departments")
    .delete()
    .eq("id", id);

  if (error) throw error;
}