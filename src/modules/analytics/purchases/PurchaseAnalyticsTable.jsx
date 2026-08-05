export default function PurchaseAnalyticsTable({
  dashboard,
}) {
  return (
    <div className="bg-white rounded-xl shadow">

      <table className="w-full">

        <thead>

          <tr className="border-b">

            <th className="text-left p-4">
              Purchase ID
            </th>

            <th className="text-left p-4">
              Supplier
            </th>

            <th className="text-right p-4">
              Amount
            </th>

          </tr>

        </thead>

        <tbody>

          {dashboard?.purchases?.map((purchase) => (

            <tr
              key={purchase.id}
              className="border-b"
            >

              <td className="p-4">
                {purchase.purchase_number}
              </td>

              <td className="p-4">
                {purchase.supplier_name || "-"}
              </td>

              <td className="text-right p-4">
                R {Number(
                  purchase.total_amount || 0
                ).toFixed(2)}
              </td>

            </tr>

          ))}

        </tbody>

      </table>
    </div>
  );
}