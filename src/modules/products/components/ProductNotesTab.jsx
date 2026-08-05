import React from "react";

export default function ProductNotesTab({
  form,
  handleChange,
}) {
  return (
    <div className="space-y-6">

      <div>

        <label className="block mb-2 font-medium">
          Internal Notes
        </label>

        <textarea
          rows={8}
          name="notes"
          value={form.notes}
          onChange={handleChange}
          className="w-full border rounded-xl px-4 py-3 resize-none"
          placeholder="Write any internal notes about this product..."
        />

      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">

        <h3 className="font-semibold mb-2">
          Notes Information
        </h3>

        <ul className="text-sm text-gray-700 space-y-2">

          <li>• Supplier comments</li>

          <li>• Manufacturing information</li>

          <li>• Warranty details</li>

          <li>• Internal stock instructions</li>

          <li>• Packaging requirements</li>

          <li>• Any information not visible to customers</li>

        </ul>

      </div>

    </div>
  );
}