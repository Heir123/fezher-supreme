import {
  ShoppingCart,
  TrendingUp,
} from "lucide-react";

export default function DashboardActivity2({
  activities = [],
}) {

  return (

    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">

      <div className="p-6 border-b">

        <h2 className="text-xl font-bold">

          Recent Business Activity

        </h2>

        <p className="text-sm text-slate-500 mt-1">

          Latest sales and purchases

        </p>

      </div>

      {activities.length === 0 ? (

        <div className="p-10 text-center text-slate-500">

          No recent activity found.

        </div>

      ) : (

        <div className="divide-y">

          {activities.map((activity) => (

            <div
              key={activity.id}
              className="flex justify-between items-center p-5 hover:bg-slate-50"
            >

              <div className="flex items-center gap-4">

                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    activity.type === "sale"
                      ? "bg-green-100 text-green-600"
                      : "bg-red-100 text-red-600"
                  }`}
                >

                  {activity.type === "sale"
                    ? <TrendingUp size={20}/>
                    : <ShoppingCart size={20}/>}

                </div>

                <div>

                  <h3 className="font-semibold">

                    {activity.title}

                  </h3>

                  <p className="text-sm text-slate-500">

                    {activity.description}

                  </p>

                  <p className="text-xs text-slate-400 mt-1">

                    {new Date(activity.created_at)
                      .toLocaleDateString()}

                  </p>

                </div>

              </div>

              <div
                className={`font-bold ${
                  activity.type === "sale"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >

                {activity.type === "sale"
                  ? "+"
                  : "-"}

                R {Number(activity.amount).toFixed(2)}

              </div>

            </div>

          ))}

        </div>

      )}

    </div>

  );

}