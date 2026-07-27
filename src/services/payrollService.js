import { supabase } from "@/services/supabase";

export async function getPayroll() {
  const { data, error } = await supabase
    .from("payroll")
    .select(`
      *,
      employees(
        employee_no,
        first_name,
        last_name,
        department,
        position
      )
    `)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data;
}

export async function addPayroll(payroll) {
  const { data, error } = await supabase
    .from("payroll")
    .insert([payroll])
    .select();

  if (error) throw error;

  return data;
}

export async function updatePayroll(id, payroll) {
  const { data, error } = await supabase
    .from("payroll")
    .update(payroll)
    .eq("id", id)
    .select();

  if (error) throw error;

  return data;
}

export async function deletePayroll(id) {
  const { error } = await supabase
    .from("payroll")
    .delete()
    .eq("id", id);

  if (error) throw error;
}