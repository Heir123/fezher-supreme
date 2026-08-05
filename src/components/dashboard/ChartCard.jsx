export default function ChartCard({
  title,
  subtitle,
  children,
}) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6">

      <div className="mb-5">

        <h2 className="text-xl font-bold">
          {title}
        </h2>

        {subtitle && (
          <p className="text-gray-500 mt-1">
            {subtitle}
          </p>
        )}

      </div>

      {children}

    </div>
  );
}