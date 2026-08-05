import {
  Activity,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Package,
  Users,
  UserCheck,
  ShoppingCart,
  AlertTriangle,
} from "lucide-react";

import StatsGrid from "@/components/dashboard/StatsGrid";

export default function ExecutiveCards({ dashboard, health }) {

  const healthScore = health?.overall || 0;

  let healthColor = "bg-red-600";

  if (healthScore >= 80) {
    healthColor = "bg-green-600";
  } else if (healthScore >= 60) {
    healthColor = "bg-yellow-500";
  }

  const cards = [

    {
      title: "Business Health",
      value: `${healthScore}/100`,
      icon: <Activity size={26} />,
      color: healthColor,
    },

    {
      title: "Revenue",
      value: `R ${(dashboard?.revenue || 0).toFixed(2)}`,
      icon: <DollarSign size={26} />,
      color: "bg-blue-600",
    },

    {
      title: "Expenses",
      value: `R ${(dashboard?.expenses || 0).toFixed(2)}`,
      icon: <TrendingDown size={26} />,
      color: "bg-red-600",
    },

    {
      title: "Profit",
      value: `R ${(dashboard?.profit || 0).toFixed(2)}`,
      icon: <TrendingUp size={26} />,
      color: dashboard?.profit >= 0
        ? "bg-green-600"
        : "bg-orange-600",
    },

    {
      title: "Inventory Value",
      value: `R ${(dashboard?.inventoryValue || 0).toFixed(2)}`,
      icon: <Package size={26} />,
      color: "bg-purple-600",
    },

    {
      title: "Customers",
      value: dashboard?.customers || 0,
      icon: <Users size={26} />,
      color: "bg-indigo-600",
    },

    {
      title: "Employees",
      value: dashboard?.employees || 0,
      icon: <UserCheck size={26} />,
      color: "bg-cyan-600",
    },

    {
      title: "Sales",
      value: dashboard?.totalSales || 0,
      icon: <ShoppingCart size={26} />,
      color: "bg-sky-600",
    },

    {
      title: "Low Stock",
      value: dashboard?.lowStock || 0,
      icon: <AlertTriangle size={26} />,
      color:
        dashboard?.lowStock > 0
          ? "bg-red-600"
          : "bg-orange-600",
    },

  ];

  return <StatsGrid cards={cards} />;

}