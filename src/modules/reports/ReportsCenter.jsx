import React, { useEffect, useState } from "react";

import ReportsCards from "./ReportsCards";
import ReportsFilters from "./ReportsFilters";
import ReportsCharts from "./ReportsCharts";
import ReportsTable from "./ReportsTable";
import ReportsExport from "./ReportsExport";

import {
  getReportsDashboard,
} from "@/services/reports/reportsDashboardService";

export default function ReportsCenter() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      setError("");

      const data = await getReportsDashboard();

      console.log("REPORTS DASHBOARD:", data);

      setDashboard(data);
    } catch (err) {
      console.error("REPORTS ERROR:", err);

      setError(
        err?.message ||
          "Unable to load reports."
      );
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-slate-500">
            Loading Reports...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold text-red-600">
            Unable to Load Reports
          </h2>

          <p className="text-slate-500 mt-2">
            {error}
          </p>

          <button
            onClick={loadData}
            className="mt-4 bg-blue-600 text-white px-5 py-2 rounded-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">
          Reports Center
        </h1>

        <p className="text-slate-500 mt-1">
          Business performance, financial,
          inventory and operational reports.
        </p>
      </div>

      {/* Summary Cards */}
      <ReportsCards
        dashboard={dashboard}
      />

      {/* Filters */}
      <ReportsFilters />

      {/* Charts */}
      <ReportsCharts
        dashboard={dashboard}
      />

      {/* Table */}
      <ReportsTable
        dashboard={dashboard}
      />

      {/* Export */}
      <ReportsExport
        dashboard={dashboard}
      />

    </div>
  );
}