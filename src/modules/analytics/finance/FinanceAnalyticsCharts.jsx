 import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from "recharts";

export default function FinanceAnalyticsCharts({ dashboard }) {
  const summaryData = [
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

  const transactions = dashboard?.financialTransactions || [];

  const trendMap = {};

  transactions.forEach((transaction) => {
    if (!transaction.date) return;

    const date = new Date(transaction.date);

    if (Number.isNaN(date.getTime())) return;

    const dateKey = date.toISOString().split("T")[0];

    if (!trendMap[dateKey]) {
      trendMap[dateKey] = {
        date: dateKey,
        revenue: 0,
        expenses: 0,
      };
    }

    if (transaction.type === "Revenue") {
      trendMap[dateKey].revenue += Number(
        transaction.amount || 0
      );
    }

    if (transaction.type === "Expense") {
      trendMap[dateKey].expenses += Number(
        transaction.amount || 0
      );
    }
  });

  const trendData = Object.values(trendMap).sort(
    (a, b) =>
      new Date(a.date) - new Date(b.date)
  );

  function formatRand(value) {
    return `R ${Number(value).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }

  function formatDate(value) {
    if (!value) return "-";

    return new Date(value).toLocaleDateString(
      undefined,
      {
        day: "numeric",
        month: "short",
      }
    );
  }

  return (
    <div className="space-y-6">

      {/* Financial Summary Chart */}

      <div className="bg-white rounded-xl shadow p-6">

        <h2 className="text-lg font-semibold mb-1">
          Revenue, Expenses & Profit
        </h2>

        <p className="text-sm text-gray-500 mb-4">
          Financial performance overview
        </p>

        <ResponsiveContainer
          width="100%"
          height={340}
        >
          <BarChart
            data={summaryData}
            margin={{
              top: 20,
              right: 20,
              left: 20,
              bottom: 10,
            }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
            />

            <XAxis
              dataKey="name"
              tick={{ fontSize: 13 }}
            />

            <YAxis
              tick={{ fontSize: 12 }}
              tickFormatter={(value) =>
                `R ${Number(value).toLocaleString()}`
              }
            />

            <Tooltip
              formatter={(value) =>
                formatRand(value)
              }
            />

            <Bar
              dataKey="value"
              radius={[8, 8, 0, 0]}
            >
              {summaryData.map((entry) => (
                <Cell
                  key={entry.name}
                  fill={
                    entry.name === "Profit" &&
                    entry.value < 0
                      ? "#dc2626"
                      : entry.name === "Expenses"
                      ? "#f59e0b"
                      : "#16a34a"
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

      </div>


      {/* Transaction Trend Chart */}

      <div className="bg-white rounded-xl shadow p-6">

        <h2 className="text-lg font-semibold mb-1">
          Financial Transaction Trend
        </h2>

        <p className="text-sm text-gray-500 mb-4">
          Revenue and received expenses over time
        </p>

        {trendData.length === 0 ? (

          <div className="h-[300px] flex items-center justify-center text-gray-500">
            No transaction history available.
          </div>

        ) : (

          <ResponsiveContainer
            width="100%"
            height={320}
          >
            <LineChart
              data={trendData}
              margin={{
                top: 20,
                right: 20,
                left: 20,
                bottom: 10,
              }}
            >

              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
              />

              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
                tickFormatter={formatDate}
              />

              <YAxis
                tick={{ fontSize: 12 }}
                tickFormatter={(value) =>
                  `R ${Number(value).toLocaleString()}`
                }
              />

              <Tooltip
                labelFormatter={(label) =>
                  new Date(label).toLocaleDateString(
                    undefined,
                    {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    }
                  )
                }
                formatter={(value, name) => [
                  formatRand(value),
                  name === "revenue"
                    ? "Revenue"
                    : "Expenses",
                ]}
              />

              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#16a34a"
                strokeWidth={3}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />

              <Line
                type="monotone"
                dataKey="expenses"
                stroke="#f59e0b"
                strokeWidth={3}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />

            </LineChart>
          </ResponsiveContainer>

        )}

      </div>

    </div>
  );
}