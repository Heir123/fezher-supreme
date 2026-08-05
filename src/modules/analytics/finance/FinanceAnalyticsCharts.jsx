import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  Tooltip,
} from "recharts";

export default function FinanceAnalyticsCharts({
  dashboard,
}) {

  const data = [

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

  return (

    <div className="bg-white rounded-xl shadow p-6">

      <h2 className="text-lg font-semibold mb-4">

        Revenue vs Expenses

      </h2>

      <ResponsiveContainer
        width="100%"
        height={320}
      >

        <BarChart data={data}>

          <XAxis dataKey="name" />

          <Tooltip />

          <Bar
            dataKey="value"
            radius={[8,8,0,0]}
          />

        </BarChart>

      </ResponsiveContainer>

    </div>

  );

}