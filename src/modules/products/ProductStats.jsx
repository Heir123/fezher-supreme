export default function ProductStats({ products }) {
  const totalProducts = products.length;

  const totalStock = products.reduce(
    (sum, product) => sum + Number(product.stock_quantity || 0),
    0
  );

  const totalValue = products.reduce(
    (sum, product) =>
      sum +
      Number(product.stock_quantity || 0) *
      Number(product.selling_price || 0),
    0
  );

  const lowStock = products.filter(
    (product) =>
      Number(product.stock_quantity || 0) <=
      Number(product.minimum_stock || 0)
  ).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="bg-white rounded-xl shadow p-5">
        <p className="text-gray-500 text-sm">Products</p>
        <h2 className="text-3xl font-bold">{totalProducts}</h2>
      </div>

      <div className="bg-white rounded-xl shadow p-5">
        <p className="text-gray-500 text-sm">Stock Units</p>
        <h2 className="text-3xl font-bold">{totalStock}</h2>
      </div>

      <div className="bg-white rounded-xl shadow p-5">
        <p className="text-gray-500 text-sm">Inventory Value</p>
        <h2 className="text-3xl font-bold">
          R {totalValue.toFixed(2)}
        </h2>
      </div>

      <div className="bg-white rounded-xl shadow p-5">
        <p className="text-gray-500 text-sm">Low Stock Items</p>
        <h2 className="text-3xl font-bold text-red-600">
          {lowStock}
        </h2>
      </div>
    </div>
  );
}