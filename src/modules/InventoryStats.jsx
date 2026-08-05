import {
  Package,
  AlertTriangle,
  XCircle,
  DollarSign,
} from "lucide-react";

export default function InventoryStats({
  summary,
}) {

  const cards = [

    {
      title: "Products",
      value: summary.totalProducts,
      icon: Package,
    },

    {
      title: "Low Stock",
      value: summary.lowStock,
      icon: AlertTriangle,
    },

    {
      title: "Out of Stock",
      value: summary.outOfStock,
      icon: XCircle,
    },

    {
      title: "Inventory Value",
      value:
        "R " +
        Number(summary.inventoryValue).toFixed(2),
      icon: DollarSign,
    },

  ];

  return (

    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

      {cards.map((card) => (

        <div
          key={card.title}
          className="bg-white rounded-xl shadow border p-6"
        >

          <div className="flex justify-between items-center">

            <div>

              <p className="text-gray-500 text-sm">
                {card.title}
              </p>

              <h2 className="text-3xl font-bold mt-2">
                {card.value}
              </h2>

            </div>

            <card.icon
              size={36}
              className="text-blue-600"
            />

          </div>

        </div>

      ))}

    </div>

  );

}