import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import SalesForm from "./SalesForm";

export default function SalesOrders() {

  const [open, setOpen] = useState(false);

  return (
    <DashboardLayout>

      <div className="space-y-6">

        <div className="flex items-center justify-between">

          <div>
            <h1 className="text-3xl font-bold">
              Sales Orders
            </h1>

            <p className="text-slate-500">
              Create customer sales and invoices.
            </p>

          </div>

          <button
            onClick={() => setOpen(true)}
            className="bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700"
          >
            + New Sale
          </button>

        </div>

        <div className="bg-white rounded-xl shadow p-6">

          <h2 className="text-xl font-semibold">
            Sales List
          </h2>

          <p className="text-gray-500 mt-2">
            No sales yet.
          </p>

        </div>

        {open && (

          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

            <div className="bg-white rounded-2xl shadow-xl w-full max-w-6xl max-h-[90vh] flex flex-col">

              <div className="flex items-center justify-between border-b px-6 py-4">

                <h2 className="text-2xl font-bold">
                  New Sale
                </h2>

                <button
                  onClick={() => setOpen(false)}
                  className="text-red-600 text-xl"
                >
                  ✕
                </button>

              </div>

              <div className="flex-1 overflow-y-auto p-6">

                <SalesForm
                  onClose={() => setOpen(false)}
                />

              </div>

            </div>

          </div>

        )}

      </div>

    </DashboardLayout>
  );

}