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
  Legend,
} from "recharts";

export default function ReportsCharts({ dashboard }) {
  const trend = dashboard?.salesTrend || [];

  const financeData = [
    {
      name: "Revenue",
      amount: Number(dashboard?.finance?.revenue || 0),
    },
    {
      name: "Expenses",
      amount: Number(dashboard?.finance?.expenses || 0),
    },
    {
      name: "Profit",
      amount: Number(dashboard?.finance?.profit || 0),
    },
  ];

  const formattedTrend = trend.map((item) => ({
    ...item,
    month: item.month
      ? new Date(item.month).toLocaleDateString("en-ZA", {
          month: "short",
          year: "numeric",
        })
      : "",
    revenue: Number(item.revenue || 0),
  }));

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

      {/* Revenue Trend */}
      <div className="bg-white rounded-xl shadow p-6">

        <h2 className="text-lg font-semibold mb-4">
          Revenue Trend
        </h2>

        {formattedTrend.length === 0 ? (
          <div className="h-[320px] flex items-center justify-center text-gray-500">
            No revenue trend data available.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={formattedTrend}>

              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="month" />

              <YAxis />

              <Tooltip />

              <Legend />

              <Line
                type="monotone"
                dataKey="revenue"
                name="Revenue"
                stroke="#2563eb"
                strokeWidth={3}
              />

            </LineChart>
          </ResponsiveContainer>
        )}

      </div>

      {/* Financial Overview */}
      <div className="bg-white rounded-xl shadow p-6">

        <h2 className="text-lg font-semibold mb-4">
          Financial Overview
        </h2>

        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={financeData}>

            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="name" />

            <YAxis />

            <Tooltip />

            <Legend />

            <Bar
              dataKey="amount"
              name="Amount"
              fill="#16a34a"
              radius={[6, 6, 0, 0]}
            />

          </BarChart>
        </ResponsiveContainer>

      </div>

    </div>
  );
}