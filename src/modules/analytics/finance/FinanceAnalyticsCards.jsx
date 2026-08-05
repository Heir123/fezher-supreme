import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Wallet,
} from "lucide-react";

export default function FinanceAnalyticsCards({ dashboard }) {

  const cards = [

    {
      title: "Revenue",
      value: `R ${(dashboard?.revenue || 0).toFixed(2)}`,
      icon: TrendingUp,
    },

    {
      title: "Expenses",
      value: `R ${(dashboard?.expenses || 0).toFixed(2)}`,
      icon: TrendingDown,
    },

    {
      title: "Profit",
      value: `R ${(dashboard?.profit || 0).toFixed(2)}`,
      icon: DollarSign,
    },

    {
      title: "Cash Balance",
      value: `R ${(dashboard?.profit || 0).toFixed(2)}`,
      icon: Wallet,
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

              <div className="bg-green-100 p-3 rounded-full">

                <Icon
                  size={26}
                  className="text-green-600"
                />

              </div>

            </div>

          </div>

        );

      })}

    </div>

  );

}