export default function PayrollDashboardCards({
  payroll
}) {

  const totalPayroll = payroll.reduce(
    (sum, p) => sum + Number(p.gross_salary || 0),
    0
  );

  const totalNet = payroll.reduce(
    (sum, p) => sum + Number(p.net_salary || 0),
    0
  );

  const totalTax = payroll.reduce(
    (sum, p) => sum + Number(p.tax || 0),
    0
  );

  const paid = payroll.filter(
    p => p.payment_status === "Paid"
  ).length;

  const pending = payroll.filter(
    p => p.payment_status !== "Paid"
  ).length;

  const cards = [
    {
      title: "Total Payroll",
      value: `R ${totalPayroll.toFixed(2)}`
    },
    {
      title: "Net Salaries",
      value: `R ${totalNet.toFixed(2)}`
    },
    {
      title: "Tax Collected",
      value: `R ${totalTax.toFixed(2)}`
    },
    {
      title: "Employees Paid",
      value: paid
    },
    {
      title: "Pending",
      value: pending
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      {cards.map((card) => (
        <div
          key={card.title}
          className="bg-white rounded-xl shadow p-5"
        >
          <h3 className="text-sm text-slate-500">
            {card.title}
          </h3>

          <p className="text-2xl font-bold mt-2">
            {card.value}
          </p>
        </div>
      ))}
    </div>
  );
}