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
} from "recharts";

export default function ExecutiveCharts({ dashboard }) {

  const financialData = [
    {
      name: "Revenue",
      value: dashboard?.revenue || 0,
    },
    {
      name: "Expenses",
      value: dashboard?.expenses || 0,
    },
    {
      name: "Profit",
      value: dashboard?.profit || 0,
    },
  ];

  const businessData = [
    {
      name: "Customers",
      value: dashboard?.totalCustomers || 0,
    },
    {
      name: "Employees",
      value: dashboard?.totalEmployees || 0,
    },
    {
      name: "Products",
      value: dashboard?.totalProducts || 0,
    },
    {
      name: "Sales",
      value: dashboard?.totalSales || 0,
    },
  ];

  return (

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

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

            <Tooltip />

            <Bar
              dataKey="value"
              fill="#2563eb"
              radius={[6,6,0,0]}
            />

          </BarChart>

        </ResponsiveContainer>

      </div>

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
              outerRadius={110}
              label
            >

              <Cell fill="#2563eb"/>

              <Cell fill="#22c55e"/>

              <Cell fill="#9333ea"/>

              <Cell fill="#06b6d4"/>

            </Pie>

            <Tooltip />

          </PieChart>

        </ResponsiveContainer>

      </div>

    </div>

  );

}