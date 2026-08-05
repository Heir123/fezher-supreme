import {
  ShoppingCart,
  DollarSign,
  BarChart3,
} from "lucide-react";

export default function PurchaseAnalyticsCards({
  dashboard,
}) {
  const cards = [
    {
      title: "Total Purchases",
      value: dashboard?.totalPurchases || 0,
      icon: ShoppingCart,
    },
    {
      title: "Total Spent",
      value: `R ${(dashboard?.totalSpent || 0).toFixed(2)}`,
      icon: DollarSign,
    },
    {
      title: "Average Purchase",
      value: `R ${(dashboard?.averagePurchase || 0).toFixed(2)}`,
      icon: BarChart3,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className="bg-white rounded-xl shadow p-5"
          >
            <div className="flex justify-between items-center">

              <div>

                <p className="text-gray-500 text-sm">
                  {card.title}
                </p>

                <h2 className="text-2xl font-bold mt-2">
                  {card.value}
                </h2>

              </div>

              <div className="bg-blue-100 p-3 rounded-full">
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