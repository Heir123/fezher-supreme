import {
  AlertTriangle,
  CheckCircle,
  TrendingDown,
  Package,
  DollarSign,
} from "lucide-react";

export default function ExecutiveNotifications({ dashboard }) {

  const notifications = [];

  if ((dashboard?.profit || 0) < 0) {
    notifications.push({
      icon: <TrendingDown className="text-red-600" size={22} />,
      title: "Business is currently operating at a loss",
      description:
        "Review expenses and revenue performance.",
    });
  }

  if ((dashboard?.lowStock || 0) > 0) {
    notifications.push({
      icon: <Package className="text-orange-500" size={22} />,
      title: "Low stock detected",
      description: `${dashboard.lowStock} products require replenishment.`,
    });
  }

  if ((dashboard?.expenses || 0) > (dashboard?.revenue || 0)) {
    notifications.push({
      icon: <DollarSign className="text-red-600" size={22} />,
      title: "Expenses exceed revenue",
      description:
        "Financial performance requires immediate attention.",
    });
  }

  if (notifications.length === 0) {
    notifications.push({
      icon: <CheckCircle className="text-green-600" size={22} />,
      title: "No critical alerts",
      description:
        "Your business is operating within expected parameters.",
    });
  }

  return (
    <div className="bg-white rounded-xl shadow p-6">

      <h2 className="text-xl font-semibold mb-6">
        Executive Notifications
      </h2>

      <div className="space-y-4">

        {notifications.map((item, index) => (

          <div
            key={index}
            className="flex gap-4 items-start border rounded-lg p-4"
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