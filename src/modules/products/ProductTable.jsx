import {
  Pencil,
  Trash2,
  Package,
} from "lucide-react";

export default function ProductTable({
  products,
  onEdit,
  onDelete,
}) {

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">

      <div className="overflow-x-auto">

        <table className="min-w-full">

          <thead className="bg-gray-50 border-b">

            <tr className="text-left text-sm text-gray-600">

              <th className="px-6 py-4">Product</th>

              <th className="px-6 py-4">Category</th>

              <th className="px-6 py-4">Company</th>

              <th className="px-6 py-4">Price</th>

              <th className="px-6 py-4">Stock</th>

              <th className="px-6 py-4 text-center">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {products.length === 0 ? (

              <tr>

                <td
                  colSpan={6}
                  className="text-center py-16 text-gray-400"
                >

                  <Package
                    className="mx-auto mb-4"
                    size={40}
                  />

                  No products found.

                </td>

              </tr>

            ) : (

              products.map((product) => (

                <tr
                  key={product.id}
                  className="border-b hover:bg-gray-50 transition"
                >

                  <td className="px-6 py-4 font-medium">
                    {product.name}
                  </td>

                  <td className="px-6 py-4">
                    {product.categories?.name ||
                      product.category ||
                      "-"}
                  </td>

                  <td className="px-6 py-4">
                    {product.companies?.name ||
                      product.company ||
                      "-"}
                  </td>

                  <td className="px-6 py-4 font-semibold">
                    R{" "}
                    {Number(
                      product.selling_price ??
                        product.price ??
                        0
                    ).toFixed(2)}
                  </td>

                  <td className="px-6 py-4">

                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        Number(
                          product.stock_quantity ??
                            product.stock ??
                            0
                        ) <=
                        Number(
                          product.minimum_stock ?? 5
                        )
                          ? "bg-red-100 text-red-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {product.stock_quantity ??
                        product.stock ??
                        0}
                    </span>

                  </td>

                  <td className="px-6 py-4">

                    <div className="flex justify-center gap-3">

                      <button
                        onClick={() =>
                          onEdit(product)
                        }
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Pencil size={18} />
                      </button>

                      <button
  onClick={() => onDelete(product)}
  className="text-red-600 hover:text-red-800"
>
  <Trash2 size={18} />
</button>

                    </div>

                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}