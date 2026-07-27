import { supabase } from "@/services/supabase";

// Get attendance
export async function getAttendance() {
  const { data, error } = await supabase
    .from("attendance")
    .select(`
      *,
      employees (
        first_name,
        last_name,
        employee_no
      )
    `)
    .order("attendance_date", { ascending: false });

  if (error) throw error;

  return data;
}

// Add attendance
export async function addAttendance(attendance) {
  const { data, error } = await supabase
    .from("attendance")
    .insert([attendance])
    .select();

  if (error) throw error;

  return data;
}

// Update attendance
export async function updateAttendance(id, attendance) {
  const { data, error } = await supabase
    .from("attendance")
    .update(attendance)
    .eq("id", id)
    .select();

  if (error) throw error;

  return data;
}

// Delete attendance
export async function deleteAttendance(id) {
  const { error } = await supabase
    .from("attendance")
    .delete()
    .eq("id", id);

  if (error) throw error;
}