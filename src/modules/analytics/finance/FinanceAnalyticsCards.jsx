 import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Wallet,
  ShoppingCart,
  Percent,
  Receipt,
  AlertTriangle,
} from "lucide-react";

export default function FinanceAnalyticsCards({ dashboard }) {
  const revenue = Number(dashboard?.revenue || 0);
  const expenses = Number(dashboard?.expenses || 0);
  const profit = Number(dashboard?.profit || 0);
  const totalSales = Number(dashboard?.totalSales || 0);
  const totalPurchases = Number(dashboard?.totalPurchases || 0);
  const averageSale = Number(dashboard?.averageSale || 0);

  const profitMargin =
    revenue > 0
      ? (profit / revenue) * 100
      : 0;

  const expenseRatio =
    revenue > 0
      ? (expenses / revenue) * 100
      : 0;

  const formatMoney = (value) =>
    `R ${Number(value).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const cards = [
    {
      title: "Revenue",
      value: formatMoney(revenue),
      icon: TrendingUp,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      valueColor: "text-green-700",
    },

    {
      title: "Expenses",
      value: formatMoney(expenses),
      icon: TrendingDown,
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
      valueColor: "text-orange-700",
    },

    {
      title: "Net Profit",
      value: formatMoney(profit),
      icon: profit < 0 ? AlertTriangle : DollarSign,
      iconBg:
        profit < 0
          ? "bg-red-100"
          : "bg-blue-100",
      iconColor:
        profit < 0
          ? "text-red-600"
          : "text-blue-600",
      valueColor:
        profit < 0
          ? "text-red-700"
          : "text-blue-700",
    },

    {
      title: "Total Sales",
      value: totalSales,
      icon: Receipt,
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
      valueColor: "text-purple-700",
    },

    {
      title: "Average Sale",
      value: formatMoney(averageSale),
      icon: Wallet,
      iconBg: "bg-indigo-100",
      iconColor: "text-indigo-600",
      valueColor: "text-indigo-700",
    },

    {
      title: "Total Purchases",
      value: totalPurchases,
      icon: ShoppingCart,
      iconBg: "bg-yellow-100",
      iconColor: "text-yellow-600",
      valueColor: "text-yellow-700",
    },

    {
      title: "Profit Margin",
      value: `${profitMargin.toFixed(2)}%`,
      icon: Percent,
      iconBg:
        profitMargin < 0
          ? "bg-red-100"
          : "bg-blue-100",
      iconColor:
        profitMargin < 0
          ? "text-red-600"
          : "text-blue-600",
      valueColor:
        profitMargin < 0
          ? "text-red-700"
          : "text-blue-700",
    },

    {
      title: "Expense / Revenue",
      value: `${expenseRatio.toFixed(2)}%`,
      icon: AlertTriangle,
      iconBg:
        expenseRatio > 100
          ? "bg-red-100"
          : "bg-green-100",
      iconColor:
        expenseRatio > 100
          ? "text-red-600"
          : "text-green-600",
      valueColor:
        expenseRatio > 100
          ? "text-red-700"
          : "text-green-700",
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

                <h2
                  className={`text-2xl font-bold mt-2 ${card.valueColor}`}
                >
                  {card.value}
                </h2>
              </div>

              <div
                className={`${card.iconBg} p-3 rounded-full`}
              >
                <Icon
                  size={26}
                  className={card.iconColor}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}