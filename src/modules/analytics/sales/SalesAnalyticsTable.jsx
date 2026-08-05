export default function SalesAnalyticsTable({
  dashboard,
}) {
  return (
    <div className="bg-white rounded-xl shadow">

      <div className="p-5 border-b">
        <h2 className="text-xl font-bold">
          Product Sales
        </h2>
      </div>

      <table className="w-full">

        <thead>

          <tr className="border-b">

            <th className="text-left p-4">
              Product
            </th>

            <th className="text-left p-4">
              Quantity
            </th>

            <th className="text-left p-4">
              Revenue
            </th>

          </tr>

        </thead>

        <tbody>

          {dashboard.saleItems.map(
            (item, index) => (
              <tr
                key={index}
                className="border-b"
              >
                <td className="p-4">
                  {item.products?.name}
                </td>

                <td className="p-4">
                  {item.quantity}
                </td>

                <td className="p-4">
                  R{" "}
                  {Number(
                    item.total_price
                  ).toFixed(2)}
                </td>
              </tr>
            )
          )}

        </tbody>

      </table>

    </div>
  );
}