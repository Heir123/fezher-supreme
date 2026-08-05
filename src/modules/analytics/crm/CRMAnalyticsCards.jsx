import {
  Users,
  UserCheck,
  Briefcase,
  DollarSign,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

import StatsGrid from "@/components/dashboard/StatsGrid";

export default function CRMAnalyticsCards({ dashboard }) {
  const cards = [
    {
      title: "Leads",
      value: dashboard?.totalLeads || 0,
      icon: <Users size={24} />,
      color: "bg-blue-600",
    },
    {
      title: "Customers",
      value: dashboard?.totalCustomers || 0,
      icon: <UserCheck size={24} />,
      color: "bg-green-600",
    },
    {
      title: "Opportunities",
      value: dashboard?.totalOpportunities || 0,
      icon: <Briefcase size={24} />,
      color: "bg-purple-600",
    },
    {
      title: "Pipeline Value",
      value: `R ${(dashboard?.totalLeadValue || 0).toFixed(2)}`,
      icon: <DollarSign size={24} />,
      color: "bg-emerald-600",
    },
    {
      title: "Won Deals",
      value: dashboard?.wonDeals || 0,
      icon: <TrendingUp size={24} />,
      color: "bg-indigo-600",
    },
    {
      title: "Lost Deals",
      value: dashboard?.lostDeals || 0,
      icon: <TrendingDown size={24} />,
      color: "bg-red-600",
    },
    {
      title: "Conversion Rate",
      value: `${(dashboard?.conversionRate || 0).toFixed(1)}%`,
      icon: <TrendingUp size={24} />,
      color: "bg-cyan-600",
    },
  ];

  return <StatsGrid cards={cards} />;
}