import { supabase } from "@/services/supabase";

export async function getHRDashboard() {

  const [
    employeesResult,
    departmentsResult,
    attendanceResult,
    payrollResult,
  ] = await Promise.all([

    supabase.from("employees").select("*"),

    supabase.from("departments").select("*"),

    supabase.from("attendance").select("*"),

    supabase.from("payroll").select("*"),

  ]);

  const employees = employeesResult.data || [];
  const departments = departmentsResult.data || [];
  const attendance = attendanceResult.data || [];
  const payroll = payrollResult.data || [];

  const payrollCost = payroll.reduce(
    (sum, row) => sum + Number(row.net_salary || 0),
    0
  );

  const present = attendance.filter(
    a => a.status === "Present"
  ).length;

  const attendanceRate =
    attendance.length === 0
      ? 0
      : (present / attendance.length) * 100;

  return {

    totalEmployees: employees.length,

    totalDepartments: departments.length,

    payrollCost,

    attendanceRate,

    employees,

    payroll,

    attendance,

  };

}