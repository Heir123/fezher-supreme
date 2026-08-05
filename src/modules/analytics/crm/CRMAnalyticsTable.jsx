export default function CRMAnalyticsTable({ dashboard }) {
  const opportunities =
    dashboard?.opportunities || [];

  return (
    <div className="bg-white rounded-xl shadow p-6">

      <h2 className="text-lg font-semibold mb-4">
        Opportunities
      </h2>

      <div className="overflow-x-auto">

        <table className="w-full">

          <thead>

            <tr className="border-b">

              <th className="text-left py-3">
                Opportunity
              </th>

              <th className="text-left py-3">
                Customer
              </th>

              <th className="text-left py-3">
                Value
              </th>

              <th className="text-left py-3">
                Status
              </th>

            </tr>

          </thead>

          <tbody>

            {opportunities.map((item) => (

              <tr
                key={item.id}
                className="border-b"
              >

                <td className="py-3">
                  {item.name}
                </td>

                <td className="py-3">
                  {item.customer}
                </td>

                <td className="py-3">
                  R {Number(item.value || 0).toFixed(2)}
                </td>

                <td className="py-3">
                  {item.status}
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}