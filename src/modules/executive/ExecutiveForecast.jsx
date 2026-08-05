export default function ExecutiveForecast({ dashboard }) {

  const revenue = dashboard?.revenue || 0;
  const expenses = dashboard?.expenses || 0;
  const profit = dashboard?.profit || 0;

  // Simple forecasting (placeholder for AI/ML later)
  const projectedRevenue = revenue * 1.15;
  const projectedExpenses = expenses * 1.05;
  const projectedProfit = projectedRevenue - projectedExpenses;

  const cards = [
    {
      title: "Projected Revenue",
      value: projectedRevenue,
      color: "text-blue-600",
    },
    {
      title: "Projected Expenses",
      value: projectedExpenses,
      color: "text-red-600",
    },
    {
      title: "Projected Profit",
      value: projectedProfit,
      color: projectedProfit >= 0 ? "text-green-600" : "text-red-600",
    },
    {
      title: "Current Profit",
      value: profit,
      color: profit >= 0 ? "text-green-600" : "text-red-600",
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow p-6">

      <h2 className="text-xl font-semibold mb-6">
        Business Forecast
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">

        {cards.map((card) => (
          <div
            key={card.title}
            className="border rounded-lg p-5"
          >
            <p className="text-sm text-gray-500">
              {card.title}
            </p>

            <h3 className={`text-2xl font-bold mt-2 ${card.color}`}>
              R {card.value.toFixed(2)}
            </h3>
          </div>
        ))}

      </div>

      <div className="mt-6 text-sm text-gray-500">
        Forecasts currently use a simple growth model for demonstration.
        Future versions will use historical ERP data, seasonal trends,
        AI prediction models, and cash-flow simulations.
      </div>

    </div>
  );

}