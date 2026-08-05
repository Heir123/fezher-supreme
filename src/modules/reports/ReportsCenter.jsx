import React, { useEffect, useState } from "react";

import ReportsCards from "./ReportsCards";
import ReportsFilters from "./ReportsFilters";
import ReportsCharts from "./ReportsCharts";
import ReportsTable from "./ReportsTable";
import ReportsExport from "./ReportsExport";

import { getReportsDashboard } from "@/services/reports/reportsDashboardService";

export default function ReportsCenter() {

    const [dashboard, setDashboard] = useState(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        async function loadData() {

            try {

                const data = await getReportsDashboard();

                setDashboard(data);

            }
            catch (err) {

                console.error(err);

            }
            finally {

                setLoading(false);

            }

        }

        loadData();

    }, []);

    if (loading) {

        return <div className="p-6">Loading Reports...</div>;

    }

    return (

        <div className="space-y-6 p-6">

            <ReportsCards dashboard={dashboard} />

            <ReportsFilters />

            <ReportsCharts dashboard={dashboard} />

            <ReportsTable dashboard={dashboard} />

            <ReportsExport dashboard={dashboard} />

        </div>

    );

}