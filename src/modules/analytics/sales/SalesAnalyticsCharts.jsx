import SalesChart from "@/modules/dashboard/charts/SalesChart";
import RevenueChart from "@/modules/dashboard/charts/RevenueChart";

export default function SalesAnalyticsCharts({
  dashboard,
}) {
  return (
    <div className="grid md:grid-cols-2 gap-6">

      <div className="bg-white rounded-xl shadow p-5">
        <h2 className="text-lg font-semibold mb-4">
          Monthly Sales
        </h2>

        <SalesChart
          data={dashboard.salesData}
        />
      </div>

      <div className="bg-white rounded-xl shadow p-5">
        <h2 className="text-lg font-semibold mb-4">
          Revenue
        </h2>

        <RevenueChart
          data={dashboard.financeData}
        />
      </div>

    </div>
  );
}