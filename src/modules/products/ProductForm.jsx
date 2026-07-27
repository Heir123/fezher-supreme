import { useEffect, useState } from "react";

import {
  addProduct,
  updateProduct,
} from "@/services/productService";

import { getCompanies } from "@/services/companyService";
import { getCategories } from "@/services/categoryService";
import { getSuppliers } from "@/services/supplierService";

const emptyForm = {
  name: "",
  sku: "",
  description: "",
  company_id: "",
  category_id: "",
  supplier_id: "",
  cost_price: "",
  selling_price: "",
  stock_quantity: "",
  minimum_stock: "",
};

export default function ProductForm({
  product,
  onSuccess,
}) {
  const [companies, setCompanies] = useState([]);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name || "",
        sku: product.sku || "",
        description: product.description || "",
        company_id: product.company_id || "",
        category_id: product.category_id || "",
        supplier_id: product.supplier_id || "",
        cost_price: product.cost_price || "",
        selling_price: product.selling_price || "",
        stock_quantity: product.stock_quantity || "",
        minimum_stock: product.minimum_stock || "",
      });
    } else {
      setForm(emptyForm);
    }
  }, [product]);

  async function loadData() {
    try {
      const companyData = await getCompanies();
      const categoryData = await getCategories();
      const supplierData = await getSuppliers();

      setCompanies(companyData || []);
      setCategories(categoryData || []);
      setSuppliers(supplierData || []);
    } catch (err) {
      console.error(err);
    }
  }

  function handleChange(e) {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      if (product) {
        await updateProduct(product.id, form);
      } else {
        await addProduct(form);
      }

      setForm(emptyForm);

      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error(err);
      alert("Failed to save product.");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      <input
        name="name"
        placeholder="Product Name"
        value={form.name}
        onChange={handleChange}
        className="w-full border rounded-lg p-2"
        required
      />

      <input
        name="sku"
        placeholder="SKU"
        value={form.sku}
        onChange={handleChange}
        className="w-full border rounded-lg p-2"
      />

      <textarea
        name="description"
        placeholder="Description"
        value={form.description}
        onChange={handleChange}
        className="w-full border rounded-lg p-2"
      />

      <select
        name="company_id"
        value={form.company_id}
        onChange={handleChange}
        className="w-full border rounded-lg p-2"
        required
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

      <select
        name="category_id"
        value={form.category_id}
        onChange={handleChange}
        className="w-full border rounded-lg p-2"
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

      <select
        name="supplier_id"
        value={form.supplier_id}
        onChange={handleChange}
        className="w-full border rounded-lg p-2"
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

      <input
        type="number"
        step="0.01"
        name="cost_price"
        placeholder="Cost Price"
        value={form.cost_price}
        onChange={handleChange}
        className="w-full border rounded-lg p-2"
      />

      <input
        type="number"
        step="0.01"
        name="selling_price"
        placeholder="Selling Price"
        value={form.selling_price}
        onChange={handleChange}
        className="w-full border rounded-lg p-2"
      />

      <input
        type="number"
        step="0.01"
        name="stock_quantity"
        placeholder="Stock Quantity"
        value={form.stock_quantity}
        onChange={handleChange}
        className="w-full border rounded-lg p-2"
      />

      <input
        type="number"
        step="0.01"
        name="minimum_stock"
        placeholder="Minimum Stock"
        value={form.minimum_stock}
        onChange={handleChange}
        className="w-full border rounded-lg p-2"
      />

      <div className="pt-4">
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
        >
          {product ? "Update Product" : "Save Product"}
        </button>
      </div>
    </form>
  );
}