import { useEffect, useState } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";

import { getCRMStats } from "@/services/crmService";

export default function CRMDashboard() {
  const [stats, setStats] = useState({
    totalLeads: 0,
    totalOpportunities: 0,
    totalFollowUps: 0,
    wonDeals: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCRMStats();
  }, []);

  async function loadCRMStats() {
    try {
      setLoading(true);

      const data = await getCRMStats();

      console.log("CRM STATS:", data);

      setStats({
        totalLeads: Number(
          data.totalLeads || 0
        ),

        totalOpportunities: Number(
          data.totalOpportunities || 0
        ),

        totalFollowUps: Number(
          data.totalFollowUps || 0
        ),

        wonDeals: Number(
          data.wonDeals || 0
        ),
      });
    } catch (error) {
      console.error(
        "CRM DASHBOARD ERROR:",
        error
      );
    } finally {
      setLoading(false);
    }
  }

  const cards = [
    {
      title: "Total Leads",
      value: stats.totalLeads,
      description:
        "Leads in your CRM",
      icon: "👤",
    },

    {
      title: "Opportunities",
      value:
        stats.totalOpportunities,
      description:
        "Sales opportunities",
      icon: "💼",
    },

    {
      title: "Follow Ups",
      value:
        stats.totalFollowUps,
      description:
        "Scheduled follow-ups",
      icon: "📞",
    },

    {
      title: "Won Deals",
      value: stats.wonDeals,
      description:
        "Successfully won deals",
      icon: "🏆",
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">
            CRM Dashboard
          </h1>

          <p className="text-slate-500">
            Manage leads, opportunities
            and customer follow-ups.
          </p>
        </div>

        {/* CRM Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">

          {cards.map((card) => (
            <div
              key={card.title}
              className="bg-white rounded-xl shadow p-6"
            >
              <div className="flex items-start justify-between">

                <div>
                  <p className="text-sm text-slate-500">
                    {card.title}
                  </p>

                  <h2 className="text-3xl font-bold mt-2">
                    {loading
                      ? "..."
                      : card.value}
                  </h2>

                  <p className="text-xs text-slate-400 mt-2">
                    {card.description}
                  </p>
                </div>

                <div className="text-2xl">
                  {card.icon}
                </div>

              </div>
            </div>
          ))}

        </div>

        {/* CRM Overview */}
        <div className="bg-white rounded-xl shadow p-6">

          <h2 className="text-xl font-semibold">
            CRM Overview
          </h2>

          <p className="text-slate-500 mt-1">
            Summary of your current CRM activity.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">

            <div className="border rounded-lg p-4">
              <p className="text-sm text-slate-500">
                Leads
              </p>

              <p className="text-2xl font-bold mt-1">
                {loading
                  ? "..."
                  : stats.totalLeads}
              </p>
            </div>

            <div className="border rounded-lg p-4">
              <p className="text-sm text-slate-500">
                Opportunities
              </p>

              <p className="text-2xl font-bold mt-1">
                {loading
                  ? "..."
                  : stats.totalOpportunities}
              </p>
            </div>

            <div className="border rounded-lg p-4">
              <p className="text-sm text-slate-500">
                Follow Ups
              </p>

              <p className="text-2xl font-bold mt-1">
                {loading
                  ? "..."
                  : stats.totalFollowUps}
              </p>
            </div>

          </div>

        </div>

      </div>
    </DashboardLayout>
  );
}