import { useEffect, useState } from "react";

import DashboardLayout from "@/layouts/DashboardLayout";

import HRAnalyticsCards from "./HRAnalyticsCards";
import HRAnalyticsCharts from "./HRAnalyticsCharts";
import HRAnalyticsTable from "./HRAnalyticsTable";

import { getHRDashboard } from "@/services/analytics/hrDashboardService";

export default function HRAnalytics() {

  const [loading, setLoading] = useState(true);
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {

    try {

      setLoading(true);

      const data = await getHRDashboard();

      setDashboard(data);

    } catch (err) {

      console.error(err);

    } finally {

      setLoading(false);

    }

  }

  if (loading) {

    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-screen">
          Loading HR Analytics...
        </div>
      </DashboardLayout>
    );

  }

  return (

    <DashboardLayout>

      <div className="space-y-6">

        <div>

          <h1 className="text-3xl font-bold">
            HR Analytics
          </h1>

          <p className="text-gray-500">
            Workforce Intelligence Dashboard
          </p>

        </div>

        <HRAnalyticsCards dashboard={dashboard} />

        <HRAnalyticsCharts dashboard={dashboard} />

        <HRAnalyticsTable dashboard={dashboard} />

      </div>

    </DashboardLayout>

  );

}