export default function DashboardCard({
  title,
  value,
}) {
  return (
    <div className="bg-white rounded-xl shadow p-6 border">

      <h3 className="text-gray-500 text-sm">
        {title}
      </h3>

      <p className="text-3xl font-bold mt-3">
        {value}
      </p>

    </div>
  );
}