import StatsGrid from "@/components/dashboard/StatsGrid";

import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Users,
  Package,
  AlertTriangle,
  ShoppingCart,
  FileText,
} from "lucide-react";

export default function DashboardCards2({ summary = {} }) {
  const cards = [
    {
      title: "Today's Sales",
      value: `R ${(summary.todaySales || 0).toFixed(2)}`,
      icon: <DollarSign size={26} />,
      color: "bg-blue-600",
    },
    {
      title: "Revenue",
      value: `R ${(summary.revenue || 0).toFixed(2)}`,
      icon: <TrendingUp size={26} />,
      color: "bg-green-600",
    },
    {
      title: "Expenses",
      value: `R ${(summary.expenses || 0).toFixed(2)}`,
      icon: <TrendingDown size={26} />,
      color: "bg-red-600",
    },
    {
      title: "Profit",
      value: `R ${(summary.profit || 0).toFixed(2)}`,
      icon: <DollarSign size={26} />,
      color: "bg-emerald-600",
    },
    {
      title: "Customers",
      value: summary.customers || 0,
      icon: <Users size={26} />,
      color: "bg-indigo-600",
    },
    {
      title: "Products",
      value: summary.products || 0,
      icon: <Package size={26} />,
      color: "bg-purple-600",
    },
    {
      title: "Low Stock",
      value: summary.lowStock || 0,
      icon: <AlertTriangle size={26} />,
      color: "bg-orange-600",
    },
    {
      title: "Pending Orders",
      value: summary.pendingOrders || 0,
      icon: <ShoppingCart size={26} />,
      color: "bg-cyan-600",
    },
    {
      title: "Outstanding Invoices",
      value: summary.outstandingInvoices || 0,
      icon: <FileText size={26} />,
      color: "bg-pink-600",
    },
  ];

  return <StatsGrid cards={cards} />;
}