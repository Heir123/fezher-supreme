import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  Tooltip,
} from "recharts";

export default function PurchaseAnalyticsCharts({
  dashboard,
}) {
  const chartData = [
    {
      name: "Purchases",
      amount: dashboard?.totalSpent || 0,
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow p-6">

      <h2 className="text-lg font-semibold mb-4">
        Purchase Spending
      </h2>

      <ResponsiveContainer
        width="100%"
        height={300}
      >

        <BarChart data={chartData}>

          <XAxis dataKey="name" />

          <Tooltip />

          <Bar
            dataKey="amount"
            radius={[8, 8, 0, 0]}
          />

        </BarChart>

      </ResponsiveContainer>

    </div>
  );
}