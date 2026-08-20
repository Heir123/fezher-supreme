import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

export default function ExecutiveCharts({ dashboard }) {
  const financialData = [
    {
      name: "Revenue",
      value: Number(dashboard?.revenue || 0),
    },
    {
      name: "Expenses",
      value: Number(dashboard?.expenses || 0),
    },
    {
      name: "Profit",
      value: Number(dashboard?.profit || 0),
    },
  ];

  const businessData = [
    {
      name: "Customers",
      value: Number(dashboard?.totalCustomers || 0),
    },
    {
      name: "Employees",
      value: Number(dashboard?.totalEmployees || 0),
    },
    {
      name: "Products",
      value: Number(dashboard?.totalProducts || 0),
    },
    {
      name: "Sales",
      value: Number(dashboard?.totalSales || 0),
    },
  ];

  const COLORS = [
    "#2563eb",
    "#16a34a",
    "#f59e0b",
    "#dc2626",
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

      {/* =========================
          FINANCIAL OVERVIEW
      ========================== */}
      <div className="bg-white rounded-xl shadow p-6">

        <h2 className="text-xl font-semibold mb-4">
          Financial Overview
        </h2>

        <ResponsiveContainer
          width="100%"
          height={320}
        >
          <BarChart data={financialData}>

            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="name" />

            <YAxis />

            <Tooltip
              formatter={(value, name) => [
                `R${Number(value).toFixed(2)}`,
                name,
              ]}
            />

            <Bar
              dataKey="value"
              fill="#2563eb"
              radius={[6, 6, 0, 0]}
            />

          </BarChart>
        </ResponsiveContainer>

      </div>


      {/* =========================
          BUSINESS OVERVIEW
      ========================== */}
      <div className="bg-white rounded-xl shadow p-6">

        <h2 className="text-xl font-semibold mb-4">
          Business Overview
        </h2>

        <ResponsiveContainer
          width="100%"
          height={320}
        >
          <PieChart>

            <Pie
              data={businessData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={110}
              label
            >
              {businessData.map((entry, index) => (
                <Cell
                  key={`cell-${entry.name}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>

            <Tooltip
              formatter={(value, name) => [
                Number(value).toLocaleString(),
                name,
              ]}
            />

            <Legend />

          </PieChart>
        </ResponsiveContainer>

      </div>

    </div>
  );
}