import React, { useEffect, useState } from "react";

import ExecutiveCards from "./ExecutiveCards";
import ExecutiveCharts from "./ExecutiveCharts";
import ExecutiveInsights from "./ExecutiveInsights";
import ExecutiveForecast from "./ExecutiveForecast";
import ExecutiveReports from "./ExecutiveReports";
import ExecutiveAIInsights from "./ExecutiveAIInsights";

import { getExecutiveDashboard } from "@/services/executiveDashboardService";

import { generateExecutiveNarrative } from "@/ai/executiveNarrative";
import { generateRecommendations } from "@/ai/recommendationEngine";
import { generateForecast } from "@/ai/forecastingEngine";

export default function ExecutiveDashboard() {

    const [dashboard, setDashboard] = useState(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        async function loadDashboard() {

            try {

                const data = await getExecutiveDashboard();

                setDashboard(data);

            } catch (err) {

                console.error(err);

            } finally {

                setLoading(false);

            }

        }

        loadDashboard();

    }, []);

    if (loading) {

        return <div className="p-6">Loading Executive Dashboard...</div>;

    }

    const narrative = generateExecutiveNarrative(dashboard);

    const recommendations = generateRecommendations(dashboard);

    const forecast = generateForecast(dashboard);

    return (

        <div className="space-y-6">

            <ExecutiveCards dashboard={dashboard} />

            <ExecutiveCharts dashboard={dashboard} />

            <ExecutiveInsights dashboard={dashboard} />

            <ExecutiveForecast dashboard={dashboard} />

            <ExecutiveReports dashboard={dashboard} />

            <ExecutiveAIInsights
                narrative={narrative}
                recommendations={recommendations}
                forecast={forecast}
            />

        </div>

    );

}