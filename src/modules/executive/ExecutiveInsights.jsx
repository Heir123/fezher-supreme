import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";

export default function ExecutiveInsights({ dashboard }) {

  const insights = [];

  if ((dashboard?.profit || 0) > 0) {
    insights.push({
      icon: <TrendingUp className="text-green-600" size={22} />,
      title: "Business is profitable",
      description: `Current profit is R ${(dashboard?.profit || 0).toFixed(2)}.`,
    });
  } else {
    insights.push({
      icon: <TrendingDown className="text-red-600" size={22} />,
      title: "Business is operating at a loss",
      description: `Current loss is R ${Math.abs(dashboard?.profit || 0).toFixed(2)}.`,
    });
  }

  if ((dashboard?.lowStock || 0) > 0) {
    insights.push({
      icon: <AlertTriangle className="text-orange-500" size={22} />,
      title: "Inventory attention required",
      description: `${dashboard.lowStock} products are running low on stock.`,
    });
  } else {
    insights.push({
      icon: <CheckCircle className="text-green-600" size={22} />,
      title: "Inventory is healthy",
      description: "No products currently require urgent restocking.",
    });
  }

  if ((dashboard?.totalCustomers || 0) > 0) {
    insights.push({
      icon: <TrendingUp className="text-blue-600" size={22} />,
      title: "Customer base is active",
      description: `${dashboard.totalCustomers} customers are registered in the ERP.`,
    });
  }

  return (

    <div className="bg-white rounded-xl shadow p-6">

      <h2 className="text-xl font-semibold mb-6">

        Executive Insights

      </h2>

      <div className="space-y-5">

        {insights.map((item, index) => (

          <div
            key={index}
            className="flex gap-4 items-start border-b pb-4 last:border-none"
          >

            <div>

              {item.icon}

            </div>

            <div>

              <h3 className="font-semibold">

                {item.title}

              </h3>

              <p className="text-gray-500">

                {item.description}

              </p>

            </div>

          </div>

        ))}

      </div>

    </div>

  );

}