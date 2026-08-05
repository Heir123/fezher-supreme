import {
  DollarSign,
  TrendingUp,
  ShoppingCart,
  Percent,
  Target,
  BarChart3,
  Trophy,
} from "lucide-react";

export default function SalesAnalyticsCards({
  kpis,
  targets,
}) {
  const cards = [
    {
      title: "Revenue",
      value: `R ${kpis?.revenue?.toFixed(2) || "0.00"}`,
      icon: DollarSign,
    },
    {
      title: "Profit",
      value: `R ${kpis?.profit?.toFixed(2) || "0.00"}`,
      icon: TrendingUp,
    },
    {
      title: "Margin",
      value: `${kpis?.margin?.toFixed(1) || 0}%`,
      icon: Percent,
    },
    {
      title: "Sales",
      value: kpis?.totalSales || 0,
      icon: ShoppingCart,
    },
    {
      title: "Average Order",
      value: `R ${kpis?.averageOrder?.toFixed(2) || "0.00"}`,
      icon: BarChart3,
    },
    {
      title: "Growth",
      value: `${kpis?.growth?.toFixed(1) || 0}%`,
      icon: TrendingUp,
    },
    {
      title: "Target Revenue",
      value: `R ${targets?.targetRevenue?.toFixed(2) || "0.00"}`,
      icon: Target,
    },
    {
      title: "Achievement",
      value: `${targets?.achievement?.toFixed(1) || 0}%`,
      icon: Trophy,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className="bg-white rounded-xl shadow p-5 hover:shadow-lg transition-shadow"
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

              <div className="p-3 rounded-full bg-blue-100">
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