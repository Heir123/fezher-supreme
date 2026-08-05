import { useEffect, useState } from "react";

import DashboardLayout from "@/layouts/DashboardLayout";

import PurchaseAnalyticsCards from "./PurchaseAnalyticsCards";
import PurchaseAnalyticsCharts from "./PurchaseAnalyticsCharts";
import PurchaseAnalyticsTable from "./PurchaseAnalyticsTable";

import {
  getPurchaseDashboard,
} from "@/services/analytics/purchaseDashboardService";

export default function PurchaseAnalytics() {

  const [loading, setLoading] = useState(true);

  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {

    try {

      setLoading(true);

      const data =
        await getPurchaseDashboard();

      setDashboard(data);

    } finally {

      setLoading(false);

    }

  }

  if (loading) {

    return (

      <DashboardLayout>

        <div className="flex justify-center items-center h-screen">

          Loading Purchase Analytics...

        </div>

      </DashboardLayout>

    );

  }

  return (

    <DashboardLayout>

      <div className="space-y-6">

        <h1 className="text-3xl font-bold">

          Purchase Analytics

        </h1>

        <PurchaseAnalyticsCards dashboard={dashboard} />

        <PurchaseAnalyticsCharts dashboard={dashboard} />

        <PurchaseAnalyticsTable dashboard={dashboard} />

      </div>

    </DashboardLayout>

  );

}