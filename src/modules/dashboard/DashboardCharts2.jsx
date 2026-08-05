import SalesChart from "./charts/SalesChart";
import RevenueChart from "./charts/RevenueChart";

export default function DashboardCharts2({
  salesData = [],
  financeData = [],
}) {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold">
          Sales Trend
        </h2>

        <p className="text-gray-500 mb-4">
          Monthly sales performance
        </p>

        <SalesChart data={salesData} />
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold">
          Revenue vs Expenses
        </h2>

        <p className="text-gray-500 mb-4">
          Financial performance
        </p>

        <RevenueChart data={financeData} />
      </div>

    </div>
  );
}