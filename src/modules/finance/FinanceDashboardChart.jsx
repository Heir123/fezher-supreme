import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
  ReferenceLine,
  LabelList,
} from "recharts";

export default function FinanceDashboardChart({ summary }) {
  const data = [
    {
      name: "Income",
      value: Number(summary?.revenue || 0),
    },
    {
      name: "Expenses",
      value: Number(summary?.expenses || 0),
    },
    {
      name: "Profit",
      value: Number(summary?.profit || 0),
    },
  ];

  const formatCurrency = (value) =>
    `R ${Number(value).toLocaleString("en-ZA", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-lg font-semibold mb-1">
        Income, Expenses & Profit
      </h2>

      <p className="text-sm text-slate-500 mb-6">
        Financial performance overview
      </p>

      <ResponsiveContainer width="100%" height={360}>
        <BarChart
          data={data}
          margin={{
            top: 35,
            right: 20,
            left: 30,
            bottom: 10,
          }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
          />

          <ReferenceLine
            y={0}
            stroke="#64748b"
            strokeWidth={1.5}
          />

          <XAxis
            dataKey="name"
            tick={{
              fontSize: 13,
              fill: "#475569",
            }}
          />

          <YAxis
            tick={{
              fontSize: 12,
              fill: "#64748b",
            }}
            tickFormatter={(value) =>
              `R ${Number(value).toLocaleString("en-ZA")}`
            }
          />

          <Tooltip
            formatter={(value) => formatCurrency(value)}
            labelStyle={{
              fontWeight: "600",
            }}
          />

          <Bar
            dataKey="value"
            radius={[8, 8, 0, 0]}
          >
            {data.map((entry) => (
              <Cell
                key={entry.name}
                fill={
                  entry.name === "Profit"
                    ? entry.value < 0
                      ? "#dc2626"
                      : "#2563eb"
                    : entry.name === "Expenses"
                    ? "#f59e0b"
                    : "#16a34a"
                }
              />
            ))}

            <LabelList
              dataKey="value"
              position="top"
              formatter={(value) =>
                formatCurrency(value)
              }
              style={{
                fontSize: 12,
                fontWeight: 600,
                fill: "#334155",
              }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}