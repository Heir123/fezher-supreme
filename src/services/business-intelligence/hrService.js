import { supabase } from "@/services/supabase";

export async function getHRBI() {

  const { data } = await supabase
    .from("employees")
    .select("*");

  const employees = data || [];

  return {

    totalEmployees: employees.length,

    activeEmployees: employees.filter(
      e => e.status === "Active"
    ).length,

    inactiveEmployees: employees.filter(
      e => e.status === "Inactive"
    ).length,

    employees,

  };

}