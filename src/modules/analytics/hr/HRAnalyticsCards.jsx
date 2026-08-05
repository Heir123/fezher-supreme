import {
  Users,
  Building2,
  DollarSign,
  CalendarCheck,
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
      title: "Departments",
      value: dashboard?.totalDepartments || 0,
      icon: <Building2 size={24} />,
      color: "bg-purple-600",
    },

    {
      title: "Payroll Cost",
      value: `R ${(dashboard?.payrollCost || 0).toFixed(2)}`,
      icon: <DollarSign size={24} />,
      color: "bg-green-600",
    },

    {
      title: "Attendance",
      value: `${(dashboard?.attendanceRate || 0).toFixed(1)}%`,
      icon: <CalendarCheck size={24} />,
      color: "bg-orange-600",
    },

  ];

  return <StatsGrid cards={cards} />;

}