import React from "react";

export default function ProductDimensionsTab({
  form,
  handleChange,
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

      {/* Weight */}

      <div>
        <label className="block mb-2 font-medium">
          Weight (kg)
        </label>

        <input
          type="number"
          step="0.01"
          name="weight"
          value={form.weight}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-2"
        />
      </div>

      {/* Length */}

      <div>
        <label className="block mb-2 font-medium">
          Length (cm)
        </label>

        <input
          type="number"
          step="0.01"
          name="length"
          value={form.length}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-2"
        />
      </div>

      {/* Width */}

      <div>
        <label className="block mb-2 font-medium">
          Width (cm)
        </label>

        <input
          type="number"
          step="0.01"
          name="width"
          value={form.width}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-2"
        />
      </div>

      {/* Height */}

      <div>
        <label className="block mb-2 font-medium">
          Height (cm)
        </label>

        <input
          type="number"
          step="0.01"
          name="height"
          value={form.height}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-2"
        />
      </div>

      {/* Shipping Weight */}

      <div>
        <label className="block mb-2 font-medium">
          Shipping Weight (kg)
        </label>

        <input
          type="number"
          step="0.01"
          name="shipping_weight"
          value={form.shipping_weight || ""}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-2"
        />
      </div>

      {/* Shipping Class */}

      <div>
        <label className="block mb-2 font-medium">
          Shipping Class
        </label>

        <select
          name="shipping_class"
          value={form.shipping_class || "Standard"}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-2"
        >
          <option>Standard</option>
          <option>Fragile</option>
          <option>Heavy</option>
          <option>Oversized</option>
        </select>
      </div>

      {/* Summary */}

      <div className="md:col-span-2 bg-gray-50 rounded-xl p-5">

        <h3 className="font-semibold mb-3">
          Physical Specifications
        </h3>

        <div className="grid grid-cols-4 gap-4 text-center">

          <div>
            <div className="text-sm text-gray-500">Weight</div>
            <div className="font-bold">
              {form.weight || 0} kg
            </div>
          </div>

          <div>
            <div className="text-sm text-gray-500">Length</div>
            <div className="font-bold">
              {form.length || 0} cm
            </div>
          </div>

          <div>
            <div className="text-sm text-gray-500">Width</div>
            <div className="font-bold">
              {form.width || 0} cm
            </div>
          </div>

          <div>
            <div className="text-sm text-gray-500">Height</div>
            <div className="font-bold">
              {form.height || 0} cm
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}