import { supabase } from "@/services/supabase";

export async function getHRDashboard() {
  const [
    employeesResult,
    departmentsResult,
    attendanceResult,
    payrollResult,
    leaveResult,
  ] = await Promise.all([
    supabase
      .from("employees")
      .select("*"),

    supabase
      .from("departments")
      .select("*"),

    supabase
      .from("attendance")
      .select("*"),

    supabase
      .from("payroll")
      .select("*"),

    supabase
      .from("leave_requests")
      .select("*"),
  ]);

  if (employeesResult.error) {
    throw new Error(
      `Employees query failed: ${employeesResult.error.message}`
    );
  }

  if (departmentsResult.error) {
    throw new Error(
      `Departments query failed: ${departmentsResult.error.message}`
    );
  }

  if (attendanceResult.error) {
    throw new Error(
      `Attendance query failed: ${attendanceResult.error.message}`
    );
  }

  if (payrollResult.error) {
    throw new Error(
      `Payroll query failed: ${payrollResult.error.message}`
    );
  }

  if (leaveResult.error) {
    throw new Error(
      `Leave query failed: ${leaveResult.error.message}`
    );
  }

  const employees = employeesResult.data || [];
  const departments = departmentsResult.data || [];
  const attendance = attendanceResult.data || [];
  const payroll = payrollResult.data || [];
  const leaveRequests = leaveResult.data || [];

  // --------------------------------------------------
  // EMPLOYEES
  // --------------------------------------------------

  const activeEmployees = employees.filter(
    (employee) =>
      String(employee.status || "").toLowerCase() === "active"
  );

  const inactiveEmployees = employees.filter(
    (employee) =>
      String(employee.status || "").toLowerCase() !== "active"
  );

  // --------------------------------------------------
  // PAYROLL
  // --------------------------------------------------

  const payrollCost = payroll.reduce(
    (sum, row) => sum + Number(row.net_salary || 0),
    0
  );

  const grossPayroll = payroll.reduce(
    (sum, row) => sum + Number(row.gross_salary || 0),
    0
  );

  const taxCollected = payroll.reduce(
    (sum, row) => sum + Number(row.tax || 0),
    0
  );

  const paidPayroll = payroll.filter(
    (row) =>
      String(row.payment_status || "").toLowerCase() === "paid"
  );

  const pendingPayroll = payroll.filter(
    (row) =>
      String(row.payment_status || "").toLowerCase() === "pending"
  );

  // --------------------------------------------------
  // ATTENDANCE
  // --------------------------------------------------

  const present = attendance.filter(
    (row) =>
      String(row.status || "").toLowerCase() === "present"
  ).length;

  const absent = attendance.filter(
    (row) =>
      String(row.status || "").toLowerCase() === "absent"
  ).length;

  const attendanceRate =
    attendance.length === 0
      ? 0
      : (present / attendance.length) * 100;

  const totalHoursWorked = attendance.reduce(
    (sum, row) => sum + Number(row.hours_worked || 0),
    0
  );

  // --------------------------------------------------
  // LEAVE
  // --------------------------------------------------

  const pendingLeave = leaveRequests.filter(
    (row) =>
      String(row.status || "").toLowerCase() === "pending"
  );

  const approvedLeave = leaveRequests.filter(
    (row) =>
      String(row.status || "").toLowerCase() === "approved"
  );

  const rejectedLeave = leaveRequests.filter(
    (row) =>
      String(row.status || "").toLowerCase() === "rejected"
  );

  const cancelledLeave = leaveRequests.filter(
    (row) =>
      String(row.status || "").toLowerCase() === "cancelled"
  );

  const totalLeaveDays = leaveRequests.reduce(
    (sum, row) => sum + Number(row.days || 0),
    0
  );

  const approvedLeaveDays = approvedLeave.reduce(
    (sum, row) => sum + Number(row.days || 0),
    0
  );

  const approvalRate =
    leaveRequests.length === 0
      ? 0
      : (approvedLeave.length / leaveRequests.length) * 100;

  // --------------------------------------------------
  // LEAVE BY TYPE
  // --------------------------------------------------

  const leaveByTypeMap = {};

  leaveRequests.forEach((leave) => {
    const type = leave.leave_type || "Unknown";

    leaveByTypeMap[type] =
      (leaveByTypeMap[type] || 0) + Number(leave.days || 0);
  });

  const leaveByType = Object.entries(leaveByTypeMap)
    .map(([name, days]) => ({
      name,
      days,
    }))
    .sort((a, b) => b.days - a.days);

  // --------------------------------------------------
  // EMPLOYEE NAME HELPER
  // --------------------------------------------------

  const employeesWithNames = employees.map((employee) => ({
    ...employee,

    full_name:
      `${employee.first_name || ""} ${
        employee.last_name || ""
      }`.trim() || employee.employee_no || "Unknown Employee",
  }));

  // --------------------------------------------------
  // RETURN DASHBOARD
  // --------------------------------------------------

  return {
    // Employees
    totalEmployees: employees.length,
    activeEmployees: activeEmployees.length,
    inactiveEmployees: inactiveEmployees.length,

    // Departments
    totalDepartments: departments.length,

    // Payroll
    payrollCost,
    grossPayroll,
    taxCollected,
    paidPayroll: paidPayroll.length,
    pendingPayroll: pendingPayroll.length,

    // Attendance
    attendanceRate,
    present,
    absent,
    totalHoursWorked,

    // Leave
    totalLeaveRequests: leaveRequests.length,
    pendingLeave: pendingLeave.length,
    approvedLeave: approvedLeave.length,
    rejectedLeave: rejectedLeave.length,
    cancelledLeave: cancelledLeave.length,
    totalLeaveDays,
    approvedLeaveDays,
    approvalRate,
    leaveByType,

    // Raw data
    employees: employeesWithNames,
    departments,
    attendance,
    payroll,
    leaveRequests,
  };
}