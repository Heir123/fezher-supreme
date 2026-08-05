import {
  Package,
  Boxes,
  DollarSign,
  AlertTriangle,
} from "lucide-react";

export default function InventoryAnalyticsCards({
  dashboard,
}) {
  const cards = [
    {
      title: "Products",
      value: dashboard?.totalProducts || 0,
      icon: Package,
    },
    {
      title: "Stock Units",
      value: dashboard?.totalStock || 0,
      icon: Boxes,
    },
    {
      title: "Inventory Value",
      value: `R ${(dashboard?.inventoryValue || 0).toFixed(2)}`,
      icon: DollarSign,
    },
    {
      title: "Low Stock",
      value: dashboard?.lowStock || 0,
      icon: AlertTriangle,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className="bg-white rounded-xl shadow p-5"
          >
            <div className="flex justify-between items-center">

              <div>
                <p className="text-sm text-gray-500">
                  {card.title}
                </p>

                <h2 className="text-2xl font-bold mt-2">
                  {card.value}
                </h2>
              </div>

              <div className="bg-blue-100 rounded-full p-3">
                <Icon
                  className="text-blue-600"
                  size={26}
                />
              </div>

            </div>
          </div>
        );
      })}
    </div>
  );
}