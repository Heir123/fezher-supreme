export default function SectionCard({
  title,
  subtitle,
  action,
  children,
}) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6">

      <div className="flex items-center justify-between mb-5">

        <div>

          <h2 className="text-xl font-bold">
            {title}
          </h2>

          {subtitle && (
            <p className="text-gray-500 mt-1">
              {subtitle}
            </p>
          )}

        </div>

        {action}

      </div>

      {children}

    </div>
  );
}