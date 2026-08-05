import {
  AlertTriangle,
  Package,
} from "lucide-react";

export default function DashboardLowStock2({
  products = [],
}) {

  return (

    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">

      <div className="flex items-center justify-between p-6 border-b">

        <div>

          <h2 className="text-xl font-bold text-slate-900">

            Low Stock Alerts

          </h2>

          <p className="text-sm text-slate-500 mt-1">

            Products that may need restocking

          </p>

        </div>

        <div className="w-11 h-11 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">

          <AlertTriangle size={22} />

        </div>

      </div>

      {products.length === 0 ? (

        <div className="p-10 text-center">

          <Package
            size={38}
            className="mx-auto text-slate-300 mb-3"
          />

          <p className="text-slate-600 font-medium">

            Inventory is healthy

          </p>

          <p className="text-sm text-slate-500 mt-1">

            No products are currently low in stock.

          </p>

        </div>

      ) : (

        <div className="divide-y">

          {products.map((product) => (

            <div
              key={product.id}
              className="flex items-center justify-between p-5"
            >

              <div>

                <h3 className="font-semibold text-slate-800">

                  {product.name}

                </h3>

                <p className="text-sm text-slate-500">

                  Minimum:
                  {" "}
                  {product.minimum_stock}

                </p>

              </div>

              <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 font-semibold">

                {product.stock}

              </span>

            </div>

          ))}

        </div>

      )}

    </div>

  );

}