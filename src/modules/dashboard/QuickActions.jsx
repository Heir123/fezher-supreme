import { Link } from "react-router-dom";

export default function QuickActions() {
  const actions = [
    {
      title: "New Company",
      path: "/companies",
      color: "bg-blue-600",
    },
    {
      title: "New Product",
      path: "/products",
      color: "bg-green-600",
    },
    {
      title: "New Customer",
      path: "/customers",
      color: "bg-purple-600",
    },
    {
      title: "New Supplier",
      path: "/suppliers",
      color: "bg-orange-600",
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow border p-6">

      <h2 className="text-xl font-bold mb-5">
        Quick Actions
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

        {actions.map((action) => (
          <Link
            key={action.title}
            to={action.path}
            className={`${action.color} text-white rounded-lg p-4 text-center font-semibold hover:opacity-90 transition`}
          >
            {action.title}
          </Link>
        ))}

      </div>

    </div>
  );
}