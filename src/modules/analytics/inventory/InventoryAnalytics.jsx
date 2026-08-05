import { useEffect, useState } from "react";

import DashboardLayout from "@/layouts/DashboardLayout";

import InventoryAnalyticsCards from "./InventoryAnalyticsCards";
import InventoryAnalyticsCharts from "./InventoryAnalyticsCharts";
import InventoryAnalyticsTable from "./InventoryAnalyticsTable";

import {
  getInventoryDashboard,
} from "@/services/analytics/inventoryDashboardService";

export default function InventoryAnalytics() {

  const [loading, setLoading] = useState(true);

  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {

    try {

      setLoading(true);

      const data =
        await getInventoryDashboard();

      setDashboard(data);

    } finally {

      setLoading(false);

    }

  }

  if (loading) {

    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-screen">
          Loading Inventory Analytics...
        </div>
      </DashboardLayout>
    );

  }

  return (

    <DashboardLayout>

      <div className="space-y-6">

        <h1 className="text-3xl font-bold">
          Inventory Analytics
        </h1>

        <InventoryAnalyticsCards dashboard={dashboard} />

        <InventoryAnalyticsCharts dashboard={dashboard} />

        <InventoryAnalyticsTable dashboard={dashboard} />

      </div>

    </DashboardLayout>

  );
}