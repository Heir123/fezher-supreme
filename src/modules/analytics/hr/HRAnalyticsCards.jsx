import {
  Users,
  UserCheck,
  Building2,
  DollarSign,
  CalendarCheck,
  ClipboardList,
  CheckCircle,
  CalendarDays,
} from "lucide-react";

import StatsGrid from "@/components/dashboard/StatsGrid";

export default function HRAnalyticsCards({ dashboard }) {
  const cards = [
    {
      title: "Employees",
      value: dashboard?.totalEmployees || 0,
      icon: <Users size={24} />,
      color: "bg-blue-600",
    },

    {
      title: "Active Employees",
      value: dashboard?.activeEmployees || 0,
      icon: <UserCheck size={24} />,
      color: "bg-green-600",
    },

    {
      title: "Departments",
      value: dashboard?.totalDepartments || 0,
      icon: <Building2 size={24} />,
      color: "bg-purple-600",
    },

    {
      title: "Payroll Cost",
      value: `R ${Number(
        dashboard?.payrollCost || 0
      ).toFixed(2)}`,
      icon: <DollarSign size={24} />,
      color: "bg-emerald-600",
    },

    {
      title: "Attendance",
      value: `${Number(
        dashboard?.attendanceRate || 0
      ).toFixed(1)}%`,
      icon: <CalendarCheck size={24} />,
      color: "bg-orange-600",
    },

    {
      title: "Leave Requests",
      value: dashboard?.totalLeaveRequests || 0,
      icon: <ClipboardList size={24} />,
      color: "bg-indigo-600",
    },

    {
      title: "Approved Leave",
      value: dashboard?.approvedLeave || 0,
      icon: <CheckCircle size={24} />,
      color: "bg-teal-600",
    },

    {
      title: "Leave Days",
      value: dashboard?.totalLeaveDays || 0,
      icon: <CalendarDays size={24} />,
      color: "bg-pink-600",
    },
  ];

  return <StatsGrid cards={cards} />;
}