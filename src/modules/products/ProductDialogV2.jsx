import { useEffect, useState } from "react";

import { supabase } from "@/services/supabase";

import {
  addProduct,
  updateProduct,
} from "@/services/productService";

import ProductGeneralTab from "./components/ProductGeneralTab";
import ProductPricingTab from "./components/ProductPricingTab";
import ProductInventoryTab from "./components/ProductInventoryTab";
import ProductDimensionsTab from "./components/ProductDimensionsTab";
import ProductImageTab from "./components/ProductImageTab";
import ProductNotesTab from "./components/ProductNotesTab";

const tabs = [
  "General",
  "Pricing",
  "Inventory",
  "Dimensions",
  "Images",
  "Notes",
];

const emptyForm = {
  company_id: "",
  category_id: "",
  supplier_id: "",

  name: "",
  sku: "",
  barcode: "",

  description: "",

  brand: "",
  unit: "",

  cost_price: 0,
  selling_price: 0,

  stock_quantity: 0,
  minimum_stock: 0,

  weight: "",
  length: "",
  width: "",
  height: "",

  tax_rate: 15,
  reorder_level: 0,

  image_url: "",

  notes: "",
};

export default function ProductDialogV2({
  open,
  onClose,
  product,
  onSaved,
}) {

  const [activeTab, setActiveTab] = useState("General");

  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState(emptyForm);

  const [imagePreview, setImagePreview] = useState(null);

  const [companies, setCompanies] = useState([]);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [brands, setBrands] = useState([]);
  const [units, setUnits] = useState([]);

  function handleChange(e) {
    const { name, value } = e.target;

    setForm(prev => ({
      ...prev,
      [name]: value,
    }));
  }

  async function loadDropdownData() {

    try {

      const companiesRes = await supabase
        .from("companies")
        .select("*")
        .order("name");

      if (!companiesRes.error)
        setCompanies(companiesRes.data || []);

      const categoriesRes = await supabase
        .from("categories")
        .select("*")
        .order("name");

      if (!categoriesRes.error)
        setCategories(categoriesRes.data || []);

      const suppliersRes = await supabase
        .from("suppliers")
        .select("*")
        .order("name");

      if (!suppliersRes.error)
        setSuppliers(suppliersRes.data || []);

      const brandsRes = await supabase
        .from("brands")
        .select("*")
        .order("name");

      if (!brandsRes.error)
        setBrands(brandsRes.data || []);

      const unitsRes = await supabase
        .from("units")
        .select("*")
        .order("name");

      if (!unitsRes.error)
        setUnits(unitsRes.data || []);

    } catch (err) {

      console.error("Dropdown Error:", err);

    }

  }

  useEffect(() => {

    if (!open) return;

    loadDropdownData();

    if (product) {

      setForm({
        ...emptyForm,
        ...product,
      });

      setImagePreview(product.image_url || null);

    } else {

      setForm(emptyForm);

      setImagePreview(null);

    }

  }, [open, product]);

    async function handleSubmit(e) {
    e.preventDefault();

    try {
      setSaving(true);

      if (product) {
        await updateProduct(product.id, form);
      } else {
        await addProduct(form);
      }

      if (onSaved) {
        await onSaved();
      }

      onClose();

    } catch (err) {
      console.error("Failed to save product:", err);

      alert(
        err?.message ||
        JSON.stringify(err, null, 2)
      );

    } finally {
      setSaving(false);
    }
  }

  if (!open) return null;

  return (

    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">

      <div className="bg-white rounded-2xl shadow-xl w-full max-w-6xl max-h-[95vh] overflow-y-auto">

        {/* HEADER */}

        <div className="flex items-center justify-between border-b p-6">

          <h2 className="text-2xl font-bold">

            {product
              ? "Edit Product"
              : "New Product"}

          </h2>

          <button
            type="button"
            onClick={onClose}
            className="text-3xl font-bold hover:text-red-600"
          >
            ×
          </button>

        </div>

        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-8"
        >

          {/* TABS */}

          <div className="flex gap-2 overflow-x-auto">

            {tabs.map((tab) => (

              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2 rounded-lg font-medium transition ${
                  activeTab === tab
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                {tab}
              </button>

            ))}

          </div>

          {/* TAB CONTENT */}

          {activeTab === "General" && (
  <ProductGeneralTab
    form={form}
    handleChange={handleChange}
    companies={companies}
    categories={categories}
    suppliers={suppliers}
    brands={brands}
    units={units}
  />
)}

{activeTab === "Pricing" && (
  <ProductPricingTab
    form={form}
    handleChange={handleChange}
  />
)}

{activeTab === "Inventory" && (
  <ProductInventoryTab
    form={form}
    handleChange={handleChange}
  />
)}

{activeTab === "Dimensions" && (
  <ProductDimensionsTab
    form={form}
    handleChange={handleChange}
  />
)}

{activeTab === "Images" && (
  <ProductImageTab
    form={form}
    setForm={setForm}
    imagePreview={imagePreview}
    setImagePreview={setImagePreview}
  />
)}

{activeTab === "Notes" && (
  <ProductNotesTab
    form={form}
    handleChange={handleChange}
  />
)}

{/* FOOTER */}

<div className="border-t pt-6 flex justify-end gap-4">

  <button
    type="button"
    onClick={onClose}
    className="px-6 py-3 rounded-xl border border-gray-300 hover:bg-gray-100 transition"
  >
    Cancel
  </button>

  <button
    type="submit"
    disabled={saving}
    className="px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition disabled:opacity-50"
  >
    {saving
      ? "Saving..."
      : product
      ? "Update Product"
      : "Save Product"}
  </button>

</div>

</form>

</div>

</div>

);

}