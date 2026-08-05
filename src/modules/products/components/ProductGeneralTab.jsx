export default function ProductGeneralTab({
  form,
  handleChange,
  companies,
  categories,
  suppliers,
  brands,
  units,
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

      {/* Company */}

      <div>
        <label className="block mb-2 font-medium">
          Company
        </label>

        <select
          name="company_id"
          value={form.company_id}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-3"
        >
          <option value="">Select Company</option>

          {companies.map((company) => (
            <option
              key={company.id}
              value={company.id}
            >
              {company.name}
            </option>
          ))}

        </select>
      </div>

      {/* Category */}

      <div>
        <label className="block mb-2 font-medium">
          Category
        </label>

        <select
          name="category_id"
          value={form.category_id}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-3"
        >
          <option value="">Select Category</option>

          {categories.map((category) => (
            <option
              key={category.id}
              value={category.id}
            >
              {category.name}
            </option>
          ))}

        </select>
      </div>

      {/* Supplier */}

      <div>
        <label className="block mb-2 font-medium">
          Supplier
        </label>

        <select
          name="supplier_id"
          value={form.supplier_id}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-3"
        >
          <option value="">Select Supplier</option>

          {suppliers.map((supplier) => (
            <option
              key={supplier.id}
              value={supplier.id}
            >
              {supplier.name}
            </option>
          ))}

        </select>
      </div>

      {/* Product Name */}

      <div>
        <label className="block mb-2 font-medium">
          Product Name
        </label>

        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-3"
          placeholder="Enter product name"
        />
      </div>

      {/* SKU */}

      <div>
        <label className="block mb-2 font-medium">
          SKU
        </label>

        <input
          type="text"
          name="sku"
          value={form.sku}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-3"
          placeholder="SKU"
        />
      </div>

      {/* Barcode */}

      <div>
        <label className="block mb-2 font-medium">
          Barcode
        </label>

        <input
          type="text"
          name="barcode"
          value={form.barcode}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-3"
          placeholder="Barcode"
        />
      </div>

      {/* Brand */}

      <div>
        <label className="block mb-2 font-medium">
          Brand
        </label>

        <select
          name="brand"
          value={form.brand}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-3"
        >
          <option value="">Select Brand</option>

          {brands.map((brand) => (
            <option
              key={brand.id}
              value={brand.name}
            >
              {brand.name}
            </option>
          ))}

        </select>
      </div>

      {/* Unit */}

      <div>
        <label className="block mb-2 font-medium">
          Unit
        </label>

        <select
          name="unit"
          value={form.unit}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-3"
        >
          <option value="">Select Unit</option>

          {units.map((unit) => (
            <option
              key={unit.id}
              value={unit.name}
            >
              {unit.name}
            </option>
          ))}

        </select>
      </div>

      {/* Description */}

      <div className="md:col-span-2">
        <label className="block mb-2 font-medium">
          Description
        </label>

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={5}
          className="w-full border rounded-lg px-4 py-3"
          placeholder="Product description..."
        />
      </div>

    </div>
  );
}