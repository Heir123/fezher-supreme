 function FinanceCards({
  totalIncome = 0,
  totalExpenses = 0,
  profit = 0,
  outstandingInvoices = 0,
  totalSales = 0,
  totalPurchases = 0,
  averageSale = 0,
}) {
  const income = Number(totalIncome) || 0;
  const expenses = Number(totalExpenses) || 0;
  const netProfit = Number(profit) || 0;
  const average = Number(averageSale) || 0;

  // Profit margin = Net Profit / Revenue × 100
  const profitMargin =
    income !== 0
      ? (netProfit / income) * 100
      : 0;

  // Expense / Revenue = Expenses / Revenue × 100
  const expenseRevenue =
    income !== 0
      ? (expenses / income) * 100
      : 0;

  const cards = [
    {
      title: "Total Income",
      value: `R ${income.toLocaleString("en-ZA", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      color: "#16a34a",
    },

    {
      title: "Total Expenses",
      value: `R ${expenses.toLocaleString("en-ZA", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      color: "#dc2626",
    },

    {
      title: "Net Profit",
      value: `R ${netProfit.toLocaleString("en-ZA", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      color: netProfit < 0 ? "#dc2626" : "#2563eb",
    },

    {
      title: "Outstanding Invoices",
      value: `R ${Number(outstandingInvoices).toLocaleString(
        "en-ZA",
        {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }
      )}`,
      color: "#f59e0b",
    },

    {
      title: "Total Sales",
      value: Number(totalSales).toLocaleString("en-ZA"),
      color: "#2563eb",
    },

    {
      title: "Total Purchases",
      value: Number(totalPurchases).toLocaleString("en-ZA"),
      color: "#7c3aed",
    },

    {
      title: "Average Sale",
      value: `R ${average.toLocaleString("en-ZA", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      color: "#0891b2",
    },

    {
      title: "Profit Margin",
      value: `${profitMargin.toFixed(2)}%`,
      color: profitMargin < 0 ? "#dc2626" : "#16a34a",
    },

    {
      title: "Expense / Revenue",
      value: `${expenseRevenue.toFixed(2)}%`,
      color: expenseRevenue > 100 ? "#dc2626" : "#f59e0b",
    },
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns:
          "repeat(auto-fit, minmax(220px, 1fr))",
        gap: "20px",
      }}
    >
      {cards.map((card) => (
        <div
          key={card.title}
          style={{
            background: "#fff",
            borderRadius: "12px",
            padding: "20px",
            boxShadow:
              "0 2px 8px rgba(0,0,0,0.08)",
          }}
        >
          <h4
            style={{
              color: "#64748b",
              marginBottom: "10px",
              fontSize: "14px",
              fontWeight: "500",
            }}
          >
            {card.title}
          </h4>

          <h2
            style={{
              color: card.color,
              fontSize: "24px",
              fontWeight: "700",
              margin: 0,
            }}
          >
            {card.value}
          </h2>
        </div>
      ))}
    </div>
  );
}

export default FinanceCards;