import { Pencil, Trash2 } from "lucide-react";

export default function PurchaseTable({
  orders,
  onEdit,
  onDelete,
}) {
  return (
    <div className="bg-white rounded-xl shadow overflow-hidden">

      <table className="w-full">

        <thead className="bg-gray-100">

          <tr>

            <th className="p-3 text-left">Order</th>
            <th className="p-3 text-left">Supplier</th>
            <th className="p-3 text-left">Date</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-left">Total</th>
            <th className="p-3 text-center">Actions</th>

          </tr>

        </thead>

        <tbody>

          {orders.map((order) => (

            <tr key={order.id} className="border-b">

              <td className="p-3">
                {order.order_number}
              </td>

              <td className="p-3">
                {order.suppliers?.name}
              </td>

              <td className="p-3">
                {order.order_date}
              </td>

              <td className="p-3">
                {order.status}
              </td>

              <td className="p-3">
                R {Number(order.total).toFixed(2)}
              </td>

              <td className="p-3 flex justify-center gap-3">

                <button
                  onClick={() => onEdit(order)}
                >
                  <Pencil size={18} />
                </button>

                <button
                  onClick={() => onDelete(order)}
                >
                  <Trash2 size={18} />
                </button>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}