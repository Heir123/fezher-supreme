import { supabase } from "@/services/supabase";

// Get all employees
export async function getEmployees() {
  const { data, error } = await supabase
    .from("employees")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data;
}

// Add employee
export async function addEmployee(employee) {
  const { data, error } = await supabase
    .from("employees")
    .insert([employee])
    .select();

  if (error) throw error;

  return data;
}

// Update employee
export async function updateEmployee(id, employee) {
  const { data, error } = await supabase
    .from("employees")
    .update(employee)
    .eq("id", id)
    .select();

  if (error) throw error;

  return data;
}

// Delete employee
export async function deleteEmployee(id) {
  const { error } = await supabase
    .from("employees")
    .delete()
    .eq("id", id);

  if (error) throw error;
}