import { useState } from "react";

export default function PurchaseDialog({ open, onClose }) {

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

      <div className="bg-white rounded-2xl shadow-xl w-full max-w-5xl p-8">

        <div className="flex items-center justify-between border-b pb-3 mb-5">
  <h2 className="text-2xl font-bold text-slate-800">
    New Purchase
  </h2>

 <button
  onClick={handleReceive}
  className="w-full bg-green-600 hover:bg-green-700 text-white rounded-lg py-3 font-semibold transition"
>
  Receive Stock
</button>
        </div>

       <div className="grid grid-cols-2 gap-6">

  <div>

    <label className="block mb-2 font-medium">
      Company
    </label>

    <select className="w-full border rounded-lg px-4 py-2">

      <option>Select Company</option>

    </select>

  </div>

  <div>

    <label className="block mb-2 font-medium">
      Supplier
    </label>

    <select className="w-full border rounded-lg px-4 py-2">

      <option>Select Supplier</option>

    </select>

  </div>

  <div>

    <label className="block mb-2 font-medium">
      Order Number
    </label>

    <input
      className="w-full border rounded-lg px-4 py-2"
      value={"PO-" + Date.now()}
      readOnly
    />

  </div>

  <div>

    <label className="block mb-2 font-medium">
      Order Date
    </label>

    <input
      type="date"
      className="w-full border rounded-lg px-4 py-2"
    />

  </div>

</div>

      </div>

    </div>
  );

}