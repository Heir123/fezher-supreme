export default function ProductTable({
  products,
  onEdit,
  onDelete,
}) {
  return (
    <div className="bg-white rounded-xl shadow overflow-x-auto">

      <table className="w-full text-sm whitespace-nowrap">

        <thead className="bg-slate-100">
          <tr>
            <th className="px-3 py-3 text-left">Product</th>
            <th className="px-3 py-3 text-left">SKU</th>
            <th className="px-3 py-3 text-left">Company</th>
            <th className="px-3 py-3 text-left">Category</th>
            <th className="px-3 py-3 text-left">Supplier</th>
            <th className="px-3 py-3 text-right">Selling Price</th>
            <th className="px-3 py-3 text-center">Stock</th>
            <th className="px-3 py-3 text-center w-40">Actions</th>
          </tr>
        </thead>

        <tbody>
          {products.length === 0 ? (
            <tr>
              <td
                colSpan="8"
                className="py-8 text-center text-gray-500"
              >
                No products found.
              </td>
            </tr>
          ) : (
            products.map((product) => (
              <tr
                key={product.id}
                className="border-t hover:bg-gray-50"
              >
                <td className="px-3 py-3 font-medium">
                  {product.name}
                </td>

                <td className="px-3 py-3">
                  {product.sku || "-"}
                </td>

                <td className="px-3 py-3">
                  {product.companies?.name || "-"}
                </td>

                <td className="px-3 py-3">
                  {product.categories?.name || "-"}
                </td>

                <td className="px-3 py-3">
                  {product.suppliers?.name || "-"}
                </td>

                <td className="px-3 py-3 text-right">
                  R {Number(product.selling_price ?? 0).toFixed(2)}
                </td>

                <td className="px-3 py-3 text-center">
                  {product.stock_quantity}
                </td>

                <td className="px-3 py-3">
                  <div className="flex justify-center gap-2">

                    <button
                      onClick={() => onEdit(product)}
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => onDelete(product.id)}
                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Delete
                    </button>

                  </div>
                </td>

              </tr>
            ))
          )}
        </tbody>

      </table>

    </div>
  );
}