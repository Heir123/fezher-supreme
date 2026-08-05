import {
  Building2,
  Package,
  Users,
  Truck,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

export default function DashboardQuickActions2() {

  const navigate = useNavigate();

  const actions = [
    {
      title: "New Company",
      icon: Building2,
      route: "/companies",
    },
    {
      title: "New Product",
      icon: Package,
      route: "/products",
    },
    {
      title: "New Customer",
      icon: Users,
      route: "/customers",
    },
    {
      title: "New Supplier",
      icon: Truck,
      route: "/suppliers",
    },
  ];

  return (

    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">

      <div className="p-6 border-b">

        <h2 className="text-xl font-bold text-slate-900">

          Quick Actions

        </h2>

      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-5 p-6">

        {actions.map((action) => {

          const Icon = action.icon;

          return (

            <button
              key={action.title}
              onClick={() => navigate(action.route)}
              className="flex flex-col items-center justify-center rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50 transition p-6"
            >

              <Icon
                size={30}
                className="text-blue-600 mb-3"
              />

              <span className="font-medium text-slate-700">

                {action.title}

              </span>

            </button>

          );

        })}

      </div>

    </div>

  );

}