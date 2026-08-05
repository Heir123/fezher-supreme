function FinanceCards({
  totalIncome = 0,
  totalExpenses = 0,
  profit = 0,
  outstandingInvoices = 0,
}) {
  const cards = [
    {
      title: "Total Income",
      value: `R ${Number(totalIncome).toFixed(2)}`,
      color: "#16a34a",
    },
    {
      title: "Total Expenses",
      value: `R ${Number(totalExpenses).toFixed(2)}`,
      color: "#dc2626",
    },
    {
      title: "Net Profit",
      value: `R ${Number(profit).toFixed(2)}`,
      color: "#2563eb",
    },
    {
      title: "Outstanding Invoices",
      value: outstandingInvoices,
      color: "#f59e0b",
    },
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
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
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          }}
        >
          <h4 style={{ color: "#64748b", marginBottom: "10px" }}>
            {card.title}
          </h4>

          <h2 style={{ color: card.color }}>
            {card.value}
          </h2>
        </div>
      ))}
    </div>
  );
}

export default FinanceCards;