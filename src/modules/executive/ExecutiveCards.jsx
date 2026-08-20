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
 const healthScore = Number(health?.overall ?? 0);

  let healthColor = "bg-red-600";

  if (healthScore >= 80) {
    healthColor = "bg-green-600";
  } else if (healthScore >= 60) {
    healthColor = "bg-yellow-500";
  }

  const revenue = Number(dashboard?.revenue ?? 0);
  const expenses = Number(dashboard?.expenses ?? 0);
  const profit = Number(dashboard?.profit ?? 0);
  const inventoryValue = Number(dashboard?.inventoryValue ?? 0);

  const totalCustomers = Number(dashboard?.totalCustomers ?? 0);
  const totalEmployees = Number(dashboard?.totalEmployees ?? 0);
  const totalSales = Number(dashboard?.totalSales ?? 0);
  const lowStock = Number(dashboard?.lowStock ?? 0);

  const cards = [
    {
      title: "Business Health",
      value: `${healthScore}/100`,
      icon: <Activity size={26} />,
      color: healthColor,
    },

    {
      title: "Revenue",
      value: `R ${revenue.toFixed(2)}`,
      icon: <DollarSign size={26} />,
      color: "bg-blue-600",
    },

    {
      title: "Expenses",
      value: `R ${expenses.toFixed(2)}`,
      icon: <TrendingDown size={26} />,
      color: "bg-red-600",
    },

    {
      title: "Profit",
      value: `R ${profit.toFixed(2)}`,
      icon: <TrendingUp size={26} />,
      color: profit >= 0 ? "bg-green-600" : "bg-orange-600",
    },

    {
      title: "Inventory Value",
      value: `R ${inventoryValue.toFixed(2)}`,
      icon: <Package size={26} />,
      color: "bg-purple-600",
    },

    {
      title: "Customers",
      value: totalCustomers,
      icon: <Users size={26} />,
      color: "bg-indigo-600",
    },

    {
      title: "Employees",
      value: totalEmployees,
      icon: <UserCheck size={26} />,
      color: "bg-cyan-600",
    },

    {
      title: "Sales",
      value: totalSales,
      icon: <ShoppingCart size={26} />,
      color: "bg-sky-600",
    },

    {
      title: "Low Stock",
      value: lowStock,
      icon: <AlertTriangle size={26} />,
      color: lowStock > 0 ? "bg-red-600" : "bg-orange-600",
    },
  ];

  return <StatsGrid cards={cards} />;
}