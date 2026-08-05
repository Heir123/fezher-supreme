import {
  Package,
  Boxes,
  DollarSign,
  AlertTriangle,
} from "lucide-react";

export default function ProductStats({ products }) {
  const totalProducts = products.length;

  const totalStock = products.reduce(
    (sum, product) =>
      sum + Number(product.stock_quantity || product.stock || 0),
    0
  );

  const totalValue = products.reduce(
    (sum, product) =>
      sum +
      Number(product.stock_quantity || product.stock || 0) *
      Number(product.selling_price || product.price || 0),
    0
  );

  const lowStock = products.filter(
    (product) =>
      Number(product.stock_quantity || product.stock || 0) <=
      Number(product.minimum_stock || 5)
  ).length;

  const cards = [
    {
      title: "Products",
      value: totalProducts,
      icon: Package,
      color: "bg-blue-100 text-blue-700",
    },
    {
      title: "Stock Units",
      value: totalStock,
      icon: Boxes,
      color: "bg-green-100 text-green-700",
    },
    {
      title: "Inventory Value",
      value: `R ${totalValue.toFixed(2)}`,
      icon: DollarSign,
      color: "bg-purple-100 text-purple-700",
    },
    {
      title: "Low Stock",
      value: lowStock,
      icon: AlertTriangle,
      color: "bg-red-100 text-red-700",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">

      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition"
          >
            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-gray-500">
                  {card.title}
                </p>

                <h2 className="text-3xl font-bold mt-2">
                  {card.value}
                </h2>

              </div>

              <div
                className={`w-14 h-14 rounded-xl flex items-center justify-center ${card.color}`}
              >
                <Icon size={28} />
              </div>

            </div>
          </div>
        );
      })}

    </div>
  );
}