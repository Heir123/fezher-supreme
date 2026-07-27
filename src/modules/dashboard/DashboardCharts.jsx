import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function DashboardCharts() {
  const data = [
    { month: "Jan", sales: 1200 },
    { month: "Feb", sales: 1800 },
    { month: "Mar", sales: 900 },
    { month: "Apr", sales: 2500 },
    { month: "May", sales: 3200 },
  ];

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-xl font-bold mb-4">
        Sales Overview
      </h2>

      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <BarChart data={data}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="sales" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}