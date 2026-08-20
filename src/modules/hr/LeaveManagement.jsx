import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import {
  getLeaveRequests,
  getLeaveEmployees,
  createLeaveRequest,
  approveLeaveRequest,
  rejectLeaveRequest,
  deleteLeaveRequest,
} from "@/services/leaveService";

// Constants for better maintainability
const LEAVE_TYPES = [
  "Annual Leave",
  "Sick Leave",
  "Family Responsibility Leave",
  "Unpaid Leave",
  "Maternity Leave",
  "Paternity Leave",
  "Study Leave",
  "Compassionate Leave",
  "Other"
];

const STATUS = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
  CANCELLED: "cancelled"
};

const STATUS_CONFIG = {
  [STATUS.PENDING]: { 
    className: "bg-yellow-100 text-yellow-800 border-yellow-200",
    icon: "⏳"
  },
  [STATUS.APPROVED]: { 
    className: "bg-green-100 text-green-800 border-green-200",
    icon: "✅"
  },
  [STATUS.REJECTED]: { 
    className: "bg-red-100 text-red-800 border-red-200",
    icon: "❌"
  },
  [STATUS.CANCELLED]: { 
    className: "bg-gray-100 text-gray-800 border-gray-200",
    icon: "🚫"
  }
};

const INITIAL_FORM_STATE = {
  employee_id: "",
  leave_type: LEAVE_TYPES[0],
  start_date: "",
  end_date: "",
  reason: "",
  attachment: null
};

export default function LeaveManagement() {
  // State management
  const [requests, setRequests] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingRequest, setEditingRequest] = useState(null);
  const [filter, setFilter] = useState({
    status: "all",
    leaveType: "all",
    search: ""
  });
  const [sortConfig, setSortConfig] = useState({
    key: "created_at",
    direction: "desc"
  });
  
  const formRef = useRef(null);
  const fileInputRef = useRef(null);
  const [form, setForm] = useState(INITIAL_FORM_STATE);

  // Data loading with retry mechanism
  const loadLeaveData = useCallback(async (retryCount = 0) => {
    try {
      setLoading(true);
      setError("");

      const [leaveData, employeeData] = await Promise.all([
        getLeaveRequests(),
        getLeaveEmployees(),
      ]);

      // Validate data
      if (!Array.isArray(leaveData)) {
        throw new Error("Invalid leave data received");
      }
      if (!Array.isArray(employeeData)) {
        throw new Error("Invalid employee data received");
      }

      // Sort requests by date (newest first)
      const sortedRequests = [...leaveData].sort((a, b) => {
        return new Date(b.created_at || b.start_date) - new Date(a.created_at || a.start_date);
      });

      setRequests(sortedRequests);
      setEmployees(employeeData);
      
      // Clear success message after successful load
      setSuccess("Data loaded successfully");
      setTimeout(() => setSuccess(""), 3000);
      
    } catch (err) {
      console.error("Leave Management Error:", err);
      
      // Retry logic (max 3 retries)
      if (retryCount < 3) {
        setTimeout(() => loadLeaveData(retryCount + 1), 1000 * (retryCount + 1));
        return;
      }
      
      setError(err?.message || "Failed to load leave data. Please refresh the page.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLeaveData();
  }, [loadLeaveData]);

  // Computed summaries with additional metrics
  const summary = useMemo(() => {
    const pending = requests.filter(item => 
      String(item.status).toLowerCase() === STATUS.PENDING
    ).length;
    
    const approved = requests.filter(item => 
      String(item.status).toLowerCase() === STATUS.APPROVED
    ).length;
    
    const rejected = requests.filter(item => 
      String(item.status).toLowerCase() === STATUS.REJECTED
    ).length;
    
    const cancelled = requests.filter(item => 
      String(item.status).toLowerCase() === STATUS.CANCELLED
    ).length;

    const totalDays = requests.reduce(
      (sum, item) => sum + Number(item.days || 0), 0
    );

    // Recent activity (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentActivity = requests.filter(item => {
      const createdDate = new Date(item.created_at || item.start_date);
      return createdDate >= sevenDaysAgo;
    }).length;

    const approvalRate = requests.length > 0 
      ? Math.round((approved / requests.length) * 100) 
      : 0;

    return {
      total: requests.length,
      pending,
      approved,
      rejected,
      cancelled,
      totalDays,
      recentActivity,
      approvalRate
    };
  }, [requests]);

  // Filtered and sorted requests
  const filteredRequests = useMemo(() => {
    let filtered = [...requests];

    // Filter by status
    if (filter.status !== "all") {
      filtered = filtered.filter(item => 
        String(item.status).toLowerCase() === filter.status
      );
    }

    // Filter by leave type
    if (filter.leaveType !== "all") {
      filtered = filtered.filter(item => 
        String(item.leave_type) === filter.leaveType
      );
    }

    // Search by employee name or reason
    if (filter.search) {
      const searchLower = filter.search.toLowerCase();
      filtered = filtered.filter(item => {
        const employee = item.employees;
        const fullName = employee ? 
          `${employee.first_name || ""} ${employee.last_name || ""}`.toLowerCase() : 
          "";
        const reason = String(item.reason || "").toLowerCase();
        return fullName.includes(searchLower) || reason.includes(searchLower);
      });
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

      // Handle nested values
      if (sortConfig.key === "employee_name") {
        aValue = getEmployeeName(a);
        bValue = getEmployeeName(b);
      }

      // Date comparison
      if (sortConfig.key === "start_date" || sortConfig.key === "end_date" || sortConfig.key === "created_at") {
        aValue = new Date(aValue || 0).getTime();
        bValue = new Date(bValue || 0).getTime();
      }

      // String comparison
      if (typeof aValue === "string") {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [requests, filter, sortConfig]);

  // Utility functions
  const calculateDays = useCallback((startDate, endDate) => {
    if (!startDate || !endDate) return 0;

    try {
      const start = new Date(`${startDate}T00:00:00`);
      const end = new Date(`${endDate}T00:00:00`);

      if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
        return 0;
      }

      if (end < start) return 0;

      // Calculate business days (excluding weekends)
      let days = 0;
      const current = new Date(start);
      while (current <= end) {
        const dayOfWeek = current.getDay();
        if (dayOfWeek !== 0 && dayOfWeek !== 6) {
          days++;
        }
        current.setDate(current.getDate() + 1);
      }
      
      return days || 1; // Return at least 1 if dates are valid
    } catch (error) {
      console.error("Error calculating days:", error);
      return 0;
    }
  }, []);

  const getEmployeeName = useCallback((request) => {
    const employee = request?.employees;
    if (!employee) return "Unknown Employee";
    
    const firstName = employee.first_name || "";
    const lastName = employee.last_name || "";
    return `${firstName} ${lastName}`.trim() || "Unnamed Employee";
  }, []);

  const getStatusConfig = useCallback((status) => {
    const statusKey = String(status || "").toLowerCase();
    return STATUS_CONFIG[statusKey] || STATUS_CONFIG[STATUS.PENDING];
  }, []);

  const validateForm = useCallback(() => {
    const errors = [];

    if (!form.employee_id) {
      errors.push("Please select an employee.");
    }

    if (!form.start_date) {
      errors.push("Please select a start date.");
    }

    if (!form.end_date) {
      errors.push("Please select an end date.");
    }

    if (form.start_date && form.end_date) {
      const start = new Date(form.start_date);
      const end = new Date(form.end_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (start < today) {
        errors.push("Start date cannot be in the past.");
      }

      if (end < start) {
        errors.push("End date must be on or after the start date.");
      }

      // Check for overlapping requests for the same employee
      const overlapping = requests.some(request => {
        if (String(request.status).toLowerCase() === STATUS.REJECTED || 
            String(request.status).toLowerCase() === STATUS.CANCELLED) {
          return false;
        }
        
        if (request.employee_id === form.employee_id) {
          const requestStart = new Date(request.start_date);
          const requestEnd = new Date(request.end_date);
          return !(end < requestStart || start > requestEnd);
        }
        return false;
      });

      if (overlapping) {
        errors.push("This employee already has an active leave request overlapping these dates.");
      }
    }

    return errors;
  }, [form, requests]);

  // Event handlers
  const handleFormChange = useCallback((event) => {
    const { name, value, type, files } = event.target;
    
    setForm(prev => ({
      ...prev,
      [name]: type === "file" ? files?.[0] || null : value
    }));
    
    // Clear errors on change
    if (error) setError("");
  }, [error]);

  const handleSort = useCallback((key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc"
    }));
  }, []);

  const openForm = useCallback((request = null) => {
    setError("");
    setSuccess("");
    
    if (request) {
      // Editing existing request
      setEditingRequest(request);
      setForm({
        employee_id: request.employee_id,
        leave_type: request.leave_type || LEAVE_TYPES[0],
        start_date: request.start_date || "",
        end_date: request.end_date || "",
        reason: request.reason || "",
        attachment: null
      });
    } else {
      // New request
      setEditingRequest(null);
      setForm({
        ...INITIAL_FORM_STATE,
        employee_id: employees[0]?.id || "",
      });
    }
    
    setShowForm(true);
    
    // Scroll to form
    setTimeout(() => {
      if (formRef.current) {
        formRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 100);
  }, [employees]);

  const closeForm = useCallback(() => {
    if (saving) return;
    
    setShowForm(false);
    setEditingRequest(null);
    setForm(INITIAL_FORM_STATE);
    setError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [saving]);

  const handleSubmit = useCallback(async (event) => {
    event.preventDefault();
    
    // Validate form
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setError(validationErrors.join(" "));
      return;
    }

    const days = calculateDays(form.start_date, form.end_date);
    if (days <= 0) {
      setError("Invalid date range. Please check your start and end dates.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      
      const payload = {
        employee_id: form.employee_id,
        leave_type: form.leave_type,
        start_date: form.start_date,
        end_date: form.end_date,
        days,
        reason: form.reason.trim() || null,
        ...(editingRequest && { id: editingRequest.id })
      };

      if (editingRequest) {
        // Update existing request (if service supports it)
        // await updateLeaveRequest(payload);
        // For now, we'll delete and recreate (or use your actual update service)
        await createLeaveRequest(payload);
      } else {
        await createLeaveRequest(payload);
      }

      closeForm();
      setSuccess(`Leave request ${editingRequest ? 'updated' : 'created'} successfully!`);
      await loadLeaveData();
      
      setTimeout(() => setSuccess(""), 3000);
      
    } catch (err) {
      console.error("Submit leave request error:", err);
      setError(err?.message || "Failed to save leave request. Please try again.");
    } finally {
      setSaving(false);
    }
  }, [form, editingRequest, closeForm, loadLeaveData, calculateDays, validateForm]);

  const handleApprove = useCallback(async (id) => {
    if (!window.confirm("Are you sure you want to approve this leave request?")) {
      return;
    }

    try {
      setError("");
      await approveLeaveRequest(id);
      setSuccess("Leave request approved successfully!");
      await loadLeaveData();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Approve leave request error:", err);
      setError(err?.message || "Failed to approve leave request.");
    }
  }, [loadLeaveData]);

  const handleReject = useCallback(async (id) => {
    const reason = window.prompt(
      "Please provide a reason for rejecting this leave request:"
    );

    if (reason === null) return;

    if (!reason.trim()) {
      setError("A rejection reason is required.");
      return;
    }

    try {
      setError("");
      await rejectLeaveRequest(id, reason.trim());
      setSuccess("Leave request rejected successfully!");
      await loadLeaveData();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Reject leave request error:", err);
      setError(err?.message || "Failed to reject leave request.");
    }
  }, [loadLeaveData]);

  const handleDelete = useCallback(async (id) => {
    if (!window.confirm(
      "Are you sure you want to delete this leave request? This action cannot be undone."
    )) {
      return;
    }

    try {
      setError("");
      await deleteLeaveRequest(id);
      setSuccess("Leave request deleted successfully!");
      await loadLeaveData();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Delete leave request error:", err);
      setError(err?.message || "Failed to delete leave request.");
    }
  }, [loadLeaveData]);

  // Loading state
  if (loading && requests.length === 0) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mb-4"></div>
          <p className="text-gray-500">Loading leave management...</p>
        </div>
      </div>
    );
  }

  const previewDays = calculateDays(form.start_date, form.end_date);
  const isPending = String(form.status || "").toLowerCase() === STATUS.PENDING;

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <span>📋</span> Leave Management
          </h1>
          <p className="text-gray-500">
            Manage employee leave requests and approvals efficiently
          </p>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => loadLeaveData()}
            disabled={loading}
            className="rounded-lg border px-4 py-2 hover:bg-gray-50 disabled:opacity-50 flex items-center gap-2"
          >
            <span>🔄</span> Refresh
          </button>
          
          <button
            type="button"
            onClick={() => openForm()}
            disabled={employees.length === 0}
            className="rounded-lg bg-black px-4 py-2 text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50 flex items-center gap-2"
          >
            <span>+</span> New Request
          </button>
        </div>
      </div>

      {/* Messages */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700 flex items-center gap-2">
          <span>⚠️</span> {error}
          <button
            onClick={() => setError("")}
            className="ml-auto text-red-500 hover:text-red-700"
          >
            ×
          </button>
        </div>
      )}

      {success && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-green-700 flex items-center gap-2">
          <span>✅</span> {success}
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
        <SummaryCard title="Total" value={summary.total} icon="📊" />
        <SummaryCard title="Pending" value={summary.pending} icon="⏳" variant="warning" />
        <SummaryCard title="Approved" value={summary.approved} icon="✅" variant="success" />
        <SummaryCard title="Rejected" value={summary.rejected} icon="❌" variant="danger" />
        <SummaryCard title="Cancelled" value={summary.cancelled} icon="🚫" variant="info" />
        <SummaryCard title="Total Days" value={summary.totalDays} icon="📅" />
        <SummaryCard title="Approval Rate" value={`${summary.approvalRate}%`} icon="🎯" />
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-xl border bg-white p-4">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Recent Activity</h3>
          <p className="text-2xl font-bold">{summary.recentActivity} new requests</p>
          <p className="text-sm text-gray-500">in the last 7 days</p>
        </div>
        <div className="rounded-xl border bg-white p-4">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Active Employees</h3>
          <p className="text-2xl font-bold">{employees.length}</p>
          <p className="text-sm text-gray-500">Available to request leave</p>
        </div>
      </div>

      {/* New Leave Request Form */}
      {showForm && (
        <div ref={formRef} className="rounded-xl border bg-white p-6 shadow-sm transition-all">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">
                {editingRequest ? "Edit Leave Request" : "New Leave Request"}
              </h2>
              <p className="text-sm text-gray-500">
                {editingRequest ? "Update the leave request details" : "Create a new leave request for an employee"}
              </p>
            </div>
            {!saving && (
              <button
                onClick={closeForm}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Employee Selection */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Employee *
              </label>
              <select
                name="employee_id"
                value={form.employee_id}
                onChange={handleFormChange}
                className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-black focus:outline-none"
                required
                disabled={saving || !!editingRequest}
              >
                <option value="">Select employee</option>
                {employees.map((employee) => (
                  <option key={employee.id} value={employee.id}>
                    {employee.first_name} {employee.last_name} ({employee.employee_no})
                  </option>
                ))}
              </select>
            </div>

            {/* Leave Type */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Leave Type *
              </label>
              <select
                name="leave_type"
                value={form.leave_type}
                onChange={handleFormChange}
                className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-black focus:outline-none"
                required
                disabled={saving}
              >
                {LEAVE_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Start Date */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Start Date *
              </label>
              <input
                type="date"
                name="start_date"
                value={form.start_date}
                onChange={handleFormChange}
                className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-black focus:outline-none"
                required
                disabled={saving}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            {/* End Date */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                End Date *
              </label>
              <input
                type="date"
                name="end_date"
                value={form.end_date}
                min={form.start_date || undefined}
                onChange={handleFormChange}
                className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-black focus:outline-none"
                required
                disabled={saving}
              />
            </div>

            {/* Days Preview */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Leave Days (Business)
              </label>
              <input
                type="text"
                value={previewDays > 0 ? `${previewDays} day${previewDays > 1 ? 's' : ''}` : "—"}
                placeholder="Calculated automatically"
                readOnly
                className="w-full rounded-lg border bg-gray-50 px-3 py-2"
              />
            </div>

            {/* Reason */}
            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Reason <span className="text-gray-400">(Optional)</span>
              </label>
              <textarea
                name="reason"
                value={form.reason}
                onChange={handleFormChange}
                rows={4}
                placeholder="Provide a reason for the leave request..."
                className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-black focus:outline-none"
                disabled={saving}
              />
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-3 md:col-span-2 pt-4 border-t">
              <button
                type="button"
                onClick={closeForm}
                disabled={saving}
                className="rounded-lg border px-4 py-2 hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-black px-4 py-2 text-white hover:bg-gray-800 disabled:opacity-50 flex items-center gap-2"
              >
                {saving ? (
                  <>
                    <span className="inline-block animate-spin">⟳</span> Saving...
                  </>
                ) : (
                  editingRequest ? "Update Request" : "Submit Request"
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filters */}
      <div className="rounded-xl border bg-white p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[200px]">
            <input
              type="text"
              placeholder="Search employees or reasons..."
              value={filter.search}
              onChange={(e) => setFilter(prev => ({ ...prev, search: e.target.value }))}
              className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-black focus:outline-none"
            />
          </div>
          
          <select
            value={filter.status}
            onChange={(e) => setFilter(prev => ({ ...prev, status: e.target.value }))}
            className="rounded-lg border px-3 py-2 focus:ring-2 focus:ring-black focus:outline-none"
          >
            <option value="all">All Status</option>
            {Object.values(STATUS).map(status => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>

          <select
            value={filter.leaveType}
            onChange={(e) => setFilter(prev => ({ ...prev, leaveType: e.target.value }))}
            className="rounded-lg border px-3 py-2 focus:ring-2 focus:ring-black focus:outline-none"
          >
            <option value="all">All Leave Types</option>
            {LEAVE_TYPES.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>

          <button
            onClick={() => setFilter({ status: "all", leaveType: "all", search: "" })}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Leave Requests Table */}
      <div className="rounded-xl border bg-white overflow-hidden">
        <div className="border-b p-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            Leave Requests <span className="text-sm text-gray-500 font-normal">({filteredRequests.length})</span>
          </h2>
          <span className="text-sm text-gray-500">
            {requests.length} total requests
          </span>
        </div>

        {filteredRequests.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            {requests.length === 0 ? (
              <>
                <p className="text-lg">📭 No leave requests yet</p>
                <p className="text-sm mt-1">Create a new leave request to get started</p>
              </>
            ) : (
              <>
                <p className="text-lg">🔍 No matching requests</p>
                <p className="text-sm mt-1">Try adjusting your filters</p>
              </>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  {[
                    { key: "employee_name", label: "Employee" },
                    { key: "leave_type", label: "Leave Type" },
                    { key: "start_date", label: "Start" },
                    { key: "end_date", label: "End" },
                    { key: "days", label: "Days" },
                    { key: "status", label: "Status" },
                    { key: "created_at", label: "Created" },
                    { key: "actions", label: "Actions" }
                  ].map(({ key, label }) => (
                    <th
                      key={key}
                      onClick={() => key !== "actions" && handleSort(key)}
                      className={`p-3 text-left ${key !== "actions" ? "cursor-pointer hover:bg-gray-100" : ""}`}
                    >
                      <div className="flex items-center gap-1">
                        {label}
                        {key !== "actions" && sortConfig.key === key && (
                          <span>{sortConfig.direction === "asc" ? "↑" : "↓"}</span>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {filteredRequests.map((request) => {
                  const statusKey = String(request.status || "").toLowerCase();
                  const statusConfig = getStatusConfig(request.status);
                  const employeeName = getEmployeeName(request);
                  const isPending = statusKey === STATUS.PENDING;
                  
                  return (
                    <tr key={request.id} className="border-t hover:bg-gray-50 transition-colors">
                      <td className="p-3 font-medium">
                        {employeeName}
                        {request.employees?.employee_no && (
                          <span className="block text-xs text-gray-400">
                            #{request.employees.employee_no}
                          </span>
                        )}
                      </td>
                      <td className="p-3">
                        <span className="text-sm">{request.leave_type || "—"}</span>
                      </td>
                      <td className="p-3">
                        {new Date(request.start_date).toLocaleDateString()}
                      </td>
                      <td className="p-3">
                        {new Date(request.end_date).toLocaleDateString()}
                      </td>
                      <td className="p-3 text-center font-medium">
                        {request.days ?? "—"}
                      </td>
                      <td className="p-3">
                        <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium border ${statusConfig.className}`}>
                          {statusConfig.icon} {request.status || "Unknown"}
                        </span>
                      </td>
                      <td className="p-3 text-xs text-gray-500">
                        {new Date(request.created_at || request.start_date).toLocaleDateString()}
                      </td>
                      <td className="p-3">
                        <div className="flex flex-wrap gap-2">
                          {isPending && (
                            <>
                              <button
                                type="button"
                                onClick={() => handleApprove(request.id)}
                                className="text-green-600 hover:text-green-800 text-xs font-medium hover:underline"
                                title="Approve"
                              >
                                ✅
                              </button>
                              <button
                                type="button"
                                onClick={() => handleReject(request.id)}
                                className="text-orange-600 hover:text-orange-800 text-xs font-medium hover:underline"
                                title="Reject"
                              >
                                ❌
                              </button>
                              <button
                                type="button"
                                onClick={() => openForm(request)}
                                className="text-blue-600 hover:text-blue-800 text-xs font-medium hover:underline"
                                title="Edit"
                              >
                                ✏️
                              </button>
                            </>
                          )}
                          <button
                            type="button"
                            onClick={() => handleDelete(request.id)}
                            className="text-red-600 hover:text-red-800 text-xs font-medium hover:underline"
                            title="Delete"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// Summary Card Component with enhanced styling
function SummaryCard({ title, value, icon, variant = "default" }) {
  const variants = {
    default: "bg-white",
    warning: "bg-yellow-50 border-yellow-200",
    success: "bg-green-50 border-green-200",
    danger: "bg-red-50 border-red-200",
    info: "bg-blue-50 border-blue-200"
  };

  return (
    <div className={`rounded-xl border p-4 ${variants[variant] || variants.default}`}>
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">{title}</p>
        {icon && <span className="text-xl">{icon}</span>}
      </div>
      <p className="mt-2 text-2xl font-bold text-gray-900">
        {value !== undefined && value !== null ? value : 0}
      </p>
    </div>
  );
}