import React, { useEffect, useState } from "react";

import SalesAnalyticsCards from "./SalesAnalyticsCards";
import SalesAnalyticsCharts from "./salesAnalyticsCharts";
import SalesAnalyticsTable from "./SalesAnalyticsTable";
import SalesInsights from "./SalesInsights";

import { getSalesDashboard } from "@/services/analytics/salesDashboardService";
import { generateSalesInsights } from "@/services/ai/salesInsightEngine";

export default function SalesAnalytics() {

    const [dashboard, setDashboard] = useState(null);
    const [insights, setInsights] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        async function loadDashboard() {

            try {

                const data = await getSalesDashboard();

                setDashboard(data);

                const ai = generateSalesInsights({

                    revenue: data.revenue,

                    profit: data.profit,

                    revenueProgress: data.revenueProgress,

                    todayGrowth: data.todayGrowth,

                    monthGrowth: data.monthGrowth,

                    yearGrowth: data.yearGrowth,

                    topProduct:
                        data.topProducts?.length
                            ? data.topProducts[0]
                            : null,

                    topCustomer:
                        data.topCustomers?.length
                            ? data.topCustomers[0]
                            : null

                });

                setInsights(ai);

            } catch (err) {

                console.error(err);

            } finally {

                setLoading(false);

            }

        }

        loadDashboard();

    }, []);

    if (loading) {

        return <div className="p-6">Loading Sales Analytics...</div>;

    }

    return (

        <div className="space-y-6">

            <SalesAnalyticsCards dashboard={dashboard} />

            <SalesAnalyticsCharts dashboard={dashboard} />

            <SalesInsights insights={insights} />

            <SalesAnalyticsTable dashboard={dashboard} />

        </div>

    );

}