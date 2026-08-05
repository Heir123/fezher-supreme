export default function InventoryAnalyticsTable({
  dashboard,
}) {

  return (
    <div className="bg-white rounded-xl shadow overflow-hidden">

      <table className="w-full">

        <thead>

          <tr className="border-b">

            <th className="text-left p-4">
              Product
            </th>

            <th className="text-right p-4">
              Stock
            </th>

            <th className="text-right p-4">
              Cost Price
            </th>

            <th className="text-right p-4">
              Value
            </th>

          </tr>

        </thead>

        <tbody>

          {dashboard?.products?.map((product) => (

            <tr
              key={product.id}
              className="border-b"
            >

              <td className="p-4">
                {product.name}
              </td>

              <td className="text-right p-4">
                {product.stock_quantity}
              </td>

              <td className="text-right p-4">
                R {Number(
                  product.cost_price || 0
                ).toFixed(2)}
              </td>

              <td className="text-right p-4">
                R {(
                  Number(product.stock_quantity || 0) *
                  Number(product.cost_price || 0)
                ).toFixed(2)}
              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}