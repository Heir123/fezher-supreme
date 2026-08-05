import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";

export default function HRAnalyticsCharts({ dashboard }) {

  const data = [

    {
      name: "Present",
      value: dashboard?.attendanceRate || 0,
    },

    {
      name: "Absent",
      value: 100 - (dashboard?.attendanceRate || 0),
    },

  ];

  return (

    <div className="bg-white rounded-xl shadow p-6">

      <h2 className="text-lg font-semibold mb-4">

        Attendance Overview

      </h2>

      <ResponsiveContainer width="100%" height={300}>

        <PieChart>

          <Pie
            data={data}
            dataKey="value"
            outerRadius={110}
            label
          >

            <Cell fill="#22c55e" />

            <Cell fill="#ef4444" />

          </Pie>

          <Tooltip />

        </PieChart>

      </ResponsiveContainer>

    </div>

  );

}