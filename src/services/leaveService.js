import { supabase } from "@/services/supabase";

// Get all leave requests with the employee attached.
// IMPORTANT: employee_id is the relationship we want to use here.
export async function getLeaveRequests() {
  const { data, error } = await supabase
    .from("leave_requests")
    .select(`
      id,
      employee_id,
      leave_type,
      start_date,
      end_date,
      days,
      reason,
      status,
      approved_by,
      approved_at,
      rejection_reason,
      created_at,
      updated_at,
      employees!leave_requests_employee_id_fkey (
        id,
        employee_no,
        first_name,
        last_name,
        department,
        position,
        status
      )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getLeaveRequests error:", error);
    throw error;
  }

  return data || [];
}

// Get active employees who can submit/request leave.
export async function getLeaveEmployees() {
  const { data, error } = await supabase
    .from("employees")
    .select(`
      id,
      employee_no,
      first_name,
      last_name,
      department,
      position,
      status
    `)
    .eq("status", "Active")
    .order("first_name");

  if (error) {
    console.error("getLeaveEmployees error:", error);
    throw error;
  }

  return data || [];
}

// Create a new leave request.
export async function createLeaveRequest(leaveRequest) {
  const {
    employee_id,
    leave_type,
    start_date,
    end_date,
    days,
    reason,
  } = leaveRequest;

  const { data, error } = await supabase
    .from("leave_requests")
    .insert([
      {
        employee_id,
        leave_type,
        start_date,
        end_date,
        days,
        reason,
        status: "Pending",
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("createLeaveRequest error:", error);
    throw error;
  }

  return data;
}

// Approve a leave request.
export async function approveLeaveRequest(id, approvedBy = null) {
  const updateData = {
    status: "Approved",
    approved_at: new Date().toISOString(),
  };

  if (approvedBy) {
    updateData.approved_by = approvedBy;
  }

  const { data, error } = await supabase
    .from("leave_requests")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("approveLeaveRequest error:", error);
    throw error;
  }

  return data;
}

// Reject a leave request.
export async function rejectLeaveRequest(id, rejectionReason = "") {
  const { data, error } = await supabase
    .from("leave_requests")
    .update({
      status: "Rejected",
      rejection_reason: rejectionReason,
      approved_at: null,
      approved_by: null,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("rejectLeaveRequest error:", error);
    throw error;
  }

  return data;
}

// Delete a leave request.
export async function deleteLeaveRequest(id) {
  const { error } = await supabase
    .from("leave_requests")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("deleteLeaveRequest error:", error);
    throw error;
  }

  return true;
}