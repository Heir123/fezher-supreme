export default function FinanceAnalyticsTable({
  dashboard,
}) {

  return (

    <div className="bg-white rounded-xl shadow overflow-hidden">

      <table className="w-full">

        <thead>

          <tr className="border-b">

            <th className="text-left p-4">
              Type
            </th>

            <th className="text-right p-4">
              Amount
            </th>

          </tr>

        </thead>

        <tbody>

          <tr>

            <td className="p-4">
              Revenue
            </td>

            <td className="text-right p-4">

              R {(dashboard?.revenue || 0).toFixed(2)}

            </td>

          </tr>

          <tr>

            <td className="p-4">
              Expenses
            </td>

            <td className="text-right p-4">

              R {(dashboard?.expenses || 0).toFixed(2)}

            </td>

          </tr>

          <tr>

            <td className="p-4 font-bold">
              Profit
            </td>

            <td className="text-right p-4 font-bold">

              R {(dashboard?.profit || 0).toFixed(2)}

            </td>

          </tr>

        </tbody>

      </table>

    </div>

  );

}