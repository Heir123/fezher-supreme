export default function PurchaseStats({ orders }) {
  const totalOrders = orders.length;

  const totalValue = orders.reduce(
    (sum, order) => sum + Number(order.total || 0),
    0
  );

  const pending = orders.filter(
    (order) => order.status === "Pending"
  ).length;

  const received = orders.filter(
    (order) => order.status === "Received"
  ).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-5">

      <div className="bg-white rounded-xl shadow p-5">
        <h3 className="text-gray-500">Purchase Orders</h3>
        <p className="text-3xl font-bold">{totalOrders}</p>
      </div>

      <div className="bg-white rounded-xl shadow p-5">
        <h3 className="text-gray-500">Total Value</h3>
        <p className="text-3xl font-bold">
          R {totalValue.toFixed(2)}
        </p>
      </div>

      <div className="bg-white rounded-xl shadow p-5">
        <h3 className="text-gray-500">Pending</h3>
        <p className="text-3xl font-bold text-orange-600">
          {pending}
        </p>
      </div>

      <div className="bg-white rounded-xl shadow p-5">
        <h3 className="text-gray-500">Received</h3>
        <p className="text-3xl font-bold text-green-600">
          {received}
        </p>
      </div>

    </div>
  );
}