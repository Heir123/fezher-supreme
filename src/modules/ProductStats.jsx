export default function ProductStats({ products = [] }) {
  const totalProducts = products.length;

  const totalStock = products.reduce(
    (total, product) =>
      total + Number(product.stock_quantity || 0),
    0
  );

  const totalValue = products.reduce(
    (total, product) =>
      total +
      Number(product.stock_quantity || 0) *
      Number(product.cost_price || 0),
    0
  );

  const lowStock = products.filter(
    (product) =>
      Number(product.stock_quantity || 0) <=
      Number(product.minimum_stock || 0)
  ).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">

      <div className="bg-white rounded-xl shadow p-5">
        <p className="text-sm text-gray-500">
          Total Products
        </p>

        <h2 className="text-3xl font-bold mt-2">
          {totalProducts}
        </h2>
      </div>

      <div className="bg-white rounded-xl shadow p-5">
        <p className="text-sm text-gray-500">
          Stock Quantity
        </p>

        <h2 className="text-3xl font-bold mt-2">
          {totalStock}
        </h2>
      </div>

      <div className="bg-white rounded-xl shadow p-5">
        <p className="text-sm text-gray-500">
          Inventory Value
        </p>

        <h2 className="text-3xl font-bold mt-2">
          R {totalValue.toFixed(2)}
        </h2>
      </div>

      <div className="bg-white rounded-xl shadow p-5">
        <p className="text-sm text-gray-500">
          Low Stock Items
        </p>

        <h2 className="text-3xl font-bold text-red-600 mt-2">
          {lowStock}
        </h2>
      </div>

    </div>
  );
}