export default function DashboardStats({
  totalRevenue,
  totalSales,
  totalProducts,
  totalCustomers,
  lowStockProducts,
}) {
  const cards = [
    {
      title: "Revenue",
      value: `R ${Number(totalRevenue).toFixed(2)}`,
    },
    {
      title: "Sales",
      value: totalSales,
    },
    {
      title: "Products",
      value: totalProducts,
    },
    {
      title: "Customers",
      value: totalCustomers,
    },
    {
      title: "Low Stock",
      value: lowStockProducts,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      {cards.map((card) => (
        <div
          key={card.title}
          className="bg-white rounded-xl shadow p-5"
        >
          <h3 className="text-gray-500 text-sm">
            {card.title}
          </h3>

          <p className="text-3xl font-bold mt-2">
            {card.value}
          </p>
        </div>
      ))}
    </div>
  );
}