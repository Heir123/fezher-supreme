export default function StockMovementTable({
  movements,
}) {

  return (

    <div className="bg-white rounded-xl shadow border overflow-hidden">

      <div className="px-6 py-4 border-b">

        <h2 className="text-xl font-bold">
          Recent Stock Movements
        </h2>

      </div>

      <table className="min-w-full">

        <thead className="bg-gray-50">

          <tr>

            <th className="text-left px-6 py-3">
              Product
            </th>

            <th className="text-left px-6 py-3">
              Type
            </th>

            <th className="text-left px-6 py-3">
              Qty
            </th>

            <th className="text-left px-6 py-3">
              Date
            </th>

          </tr>

        </thead>

        <tbody>

          {movements.map((m) => (

            <tr
              key={m.id}
              className="border-b"
            >

              <td className="px-6 py-4">
                {m.products?.name}
              </td>

              <td className="px-6 py-4">
                {m.movement_type}
              </td>

              <td className="px-6 py-4">
                {m.quantity}
              </td>

              <td className="px-6 py-4">
                {new Date(
                  m.created_at
                ).toLocaleString()}
              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  );

}