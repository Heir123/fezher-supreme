import React from "react";

export default function ProductInventoryTab({
  form,
  handleChange,
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

      {/* Current Stock */}

      <div>
        <label className="block mb-2 font-medium">
          Current Stock
        </label>

        <input
          type="number"
          name="stock_quantity"
          value={form.stock_quantity}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-2"
        />
      </div>

      {/* Minimum Stock */}

      <div>
        <label className="block mb-2 font-medium">
          Minimum Stock
        </label>

        <input
          type="number"
          name="minimum_stock"
          value={form.minimum_stock}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-2"
        />
      </div>

      {/* Reorder Level */}

      <div>
        <label className="block mb-2 font-medium">
          Reorder Level
        </label>

        <input
          type="number"
          name="reorder_level"
          value={form.reorder_level}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-2"
        />
      </div>

      {/* Warehouse */}

      <div>
        <label className="block mb-2 font-medium">
          Warehouse Location
        </label>

        <input
          type="text"
          name="warehouse_location"
          value={form.warehouse_location || ""}
          onChange={handleChange}
          placeholder="Main Warehouse"
          className="w-full border rounded-lg px-4 py-2"
        />
      </div>

      {/* Shelf */}

      <div>
        <label className="block mb-2 font-medium">
          Shelf / Bin
        </label>

        <input
          type="text"
          name="shelf_location"
          value={form.shelf_location || ""}
          onChange={handleChange}
          placeholder="A-12"
          className="w-full border rounded-lg px-4 py-2"
        />
      </div>

      {/* Stock Status */}

      <div>
        <label className="block mb-2 font-medium">
          Stock Status
        </label>

        <select
          name="stock_status"
          value={form.stock_status || "In Stock"}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-2"
        >
          <option>In Stock</option>
          <option>Low Stock</option>
          <option>Out of Stock</option>
          <option>Discontinued</option>
        </select>
      </div>

      {/* Stock Summary */}

      <div className="md:col-span-2 bg-gray-50 rounded-xl p-5">

        <h3 className="font-semibold mb-3">
          Inventory Summary
        </h3>

        <div className="grid grid-cols-3 gap-6 text-center">

          <div>
            <div className="text-sm text-gray-500">
              Current Stock
            </div>

            <div className="text-2xl font-bold">
              {form.stock_quantity}
            </div>
          </div>

          <div>
            <div className="text-sm text-gray-500">
              Minimum
            </div>

            <div className="text-2xl font-bold">
              {form.minimum_stock}
            </div>
          </div>

          <div>
            <div className="text-sm text-gray-500">
              Reorder
            </div>

            <div className="text-2xl font-bold">
              {form.reorder_level}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}