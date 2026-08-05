import React from "react";

export default function ProductPricingTab({
  form,
  handleChange,
}) {

  const profit =
    Number(form.selling_price || 0) -
    Number(form.cost_price || 0);

  const margin =
    Number(form.selling_price || 0) > 0
      ? (
          (profit /
            Number(form.selling_price || 1)) *
          100
        ).toFixed(2)
      : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

      <div>

        <label className="block mb-2 font-medium">
          Cost Price
        </label>

        <input
          type="number"
          step="0.01"
          name="cost_price"
          value={form.cost_price}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-2"
        />

      </div>

      <div>

        <label className="block mb-2 font-medium">
          Selling Price
        </label>

        <input
          type="number"
          step="0.01"
          name="selling_price"
          value={form.selling_price}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-2"
        />

      </div>

      <div>

        <label className="block mb-2 font-medium">
          Tax Rate (%)
        </label>

        <input
          type="number"
          name="tax_rate"
          value={form.tax_rate}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-2"
        />

      </div>

      <div>

        <label className="block mb-2 font-medium">
          Discount (%)
        </label>

        <input
          type="number"
          name="discount"
          value={form.discount || ""}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-2"
        />

      </div>

      <div>

        <label className="block mb-2 font-medium">
          Currency
        </label>

        <select
          name="currency"
          value={form.currency || "ZAR"}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-2"
        >
          <option value="ZAR">South African Rand (ZAR)</option>
          <option value="USD">US Dollar (USD)</option>
          <option value="EUR">Euro (EUR)</option>
        </select>

      </div>

      <div className="bg-gray-50 rounded-lg p-4">

        <div className="text-sm text-gray-500">
          Estimated Profit
        </div>

        <div className="text-xl font-bold">
          {profit.toFixed(2)}
        </div>

        <div className="text-sm text-green-600">
          Margin: {margin}%
        </div>

      </div>

    </div>
  );
}