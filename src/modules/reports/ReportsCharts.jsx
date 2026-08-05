import React from "react";

import {
    ResponsiveContainer,
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend
} from "recharts";

export default function ReportsCharts({ dashboard }) {

    const trend =
        dashboard?.executive?.sales_trend ||
        dashboard?.sales?.salesTrend ||
        [];

    const financeData = [

        {
            name: "Revenue",
            amount: Number(dashboard?.finance?.revenue || 0)
        },

        {
            name: "Expenses",
            amount: Number(dashboard?.finance?.expenses || 0)
        },

        {
            name: "Profit",
            amount: Number(dashboard?.finance?.profit || 0)
        }

    ];

    return (

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

            {/* Sales Trend */}

            <div className="bg-white rounded-xl shadow p-6">

                <h2 className="text-lg font-semibold mb-4">

                    Revenue Trend

                </h2>

                <ResponsiveContainer
                    width="100%"
                    height={320}
                >

                    <LineChart data={trend}>

                        <CartesianGrid strokeDasharray="3 3" />

                        <XAxis dataKey="month" />

                        <YAxis />

                        <Tooltip />

                        <Legend />

                        <Line

                            type="monotone"

                            dataKey="revenue"

                            stroke="#2563eb"

                            strokeWidth={3}

                        />

                    </LineChart>

                </ResponsiveContainer>

            </div>

            {/* Finance */}

            <div className="bg-white rounded-xl shadow p-6">

                <h2 className="text-lg font-semibold mb-4">

                    Financial Overview

                </h2>

                <ResponsiveContainer
                    width="100%"
                    height={320}
                >

                    <BarChart data={financeData}>

                        <CartesianGrid strokeDasharray="3 3" />

                        <XAxis dataKey="name" />

                        <YAxis />

                        <Tooltip />

                        <Legend />

                        <Bar

                            dataKey="amount"

                            fill="#16a34a"

                            radius={[6, 6, 0, 0]}

                        />

                    </BarChart>

                </ResponsiveContainer>

            </div>

        </div>

    );

}