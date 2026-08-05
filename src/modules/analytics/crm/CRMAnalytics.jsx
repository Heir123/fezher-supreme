import { useEffect, useState } from "react";

import DashboardLayout from "@/layouts/DashboardLayout";

import CRMAnalyticsCards from "./CRMAnalyticsCards";
import CRMAnalyticsCharts from "./CRMAnalyticsCharts";
import CRMAnalyticsTable from "./CRMAnalyticsTable";

import { getCRMDashboard } from "@/services/analytics/crmDashboardService";

export default function CRMAnalytics() {

  const [loading, setLoading] = useState(true);
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {

    try {

      setLoading(true);

      const data = await getCRMDashboard();

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
          Loading CRM Analytics...
        </div>
      </DashboardLayout>
    );

  }

  return (

    <DashboardLayout>

      <div className="space-y-6">

        <div>

          <h1 className="text-3xl font-bold">
            CRM Analytics
          </h1>

          <p className="text-gray-500">
            Customer Relationship Intelligence
          </p>

        </div>

        <CRMAnalyticsCards dashboard={dashboard} />

        <CRMAnalyticsCharts dashboard={dashboard} />

        <CRMAnalyticsTable dashboard={dashboard} />

      </div>

    </DashboardLayout>

  );

}