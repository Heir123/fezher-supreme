import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Tooltip,
} from "recharts";

export default function InventoryAnalyticsCharts({
  dashboard,
}) {

  const data = [
    {
      name: "Healthy",
      value:
        (dashboard?.totalProducts || 0) -
        (dashboard?.lowStock || 0),
    },
    {
      name: "Low Stock",
      value: dashboard?.lowStock || 0,
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow p-6">

      <h2 className="text-lg font-semibold mb-4">
        Inventory Status
      </h2>

      <ResponsiveContainer
        width="100%"
        height={300}
      >

        <PieChart>

          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            outerRadius={110}
          />

          <Tooltip />

        </PieChart>

      </ResponsiveContainer>

    </div>
  );
}