import {
  Trophy,
  TrendingUp,
  Package,
} from "lucide-react";

export default function DashboardTopProducts2({
  products = [],
}) {

  return (

    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">

      {/* Header */}

      <div className="flex items-center justify-between p-6 border-b">

        <div>

          <h2 className="text-xl font-bold text-slate-900">

            Top Selling Products

          </h2>

          <p className="text-sm text-slate-500 mt-1">

            Best-performing products

          </p>

        </div>

        <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">

          <Trophy size={22} />

        </div>

      </div>

      {/* Empty State */}

      {products.length === 0 && (

        <div className="p-10 text-center">

          <Package
            size={38}
            className="mx-auto text-slate-300 mb-3"
          />

          <p className="text-slate-500">

            No product sales found.

          </p>

        </div>

      )}

      {/* Product List */}

      {products.length > 0 && (

        <div className="divide-y">

          {products.map((product, index) => (

            <div
              key={product.id}
              className="flex items-center justify-between p-5 hover:bg-slate-50 transition"
            >

              <div className="flex items-center gap-4">

                <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600">

                  {index + 1}

                </div>

                <div>

                  <h3 className="font-semibold text-slate-800">

                    {product.name}

                  </h3>

                  <p className="text-sm text-slate-500">

                    {product.quantity} units sold

                  </p>

                </div>

              </div>

              <div className="text-right">

                <div className="flex items-center justify-end gap-1 text-emerald-600">

                  <TrendingUp size={16} />

                  <span className="font-bold">

                    R {Number(product.revenue).toFixed(2)}

                  </span>

                </div>

                <p className="text-xs text-slate-400">

                  Sales revenue

                </p>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>

  );

}