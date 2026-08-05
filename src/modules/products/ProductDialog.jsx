import { useEffect, useState } from "react";
import {
  addProduct,
  updateProduct,
} from "@/services/productService";
import { uploadProductImage } from "@/services/storageService";
export default function ProductDialog({
  open,
  onClose,
  product,
}) {
  const emptyForm = {
    name: "",
    sku: "",
    barcode: "",
    company: "",
    category: "",
    supplier: "",
    cost_price: "",
    selling_price: "",
    stock_quantity: "",
    minimum_stock: "",
    description: "",
  };

  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
const [imageFile, setImageFile] = useState(null);
const [preview, setPreview] = useState("");
  useEffect(() => {
  if (product) {
    setForm({
      ...emptyForm,
      ...product,
    });

    setPreview(product.image_url || "");
  } else {
    setForm(emptyForm);
    setPreview("");
  }

  setImageFile(null);
}, [product]);

  if (!open) return null;

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  function handleImage(e) {
  const file = e.target.files[0];

  if (!file) return;

  setImageFile(file);

  setPreview(URL.createObjectURL(file));
}
  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setSaving(true);

      let imageUrl = form.image_url;

if (imageFile) {
  imageUrl = await uploadProductImage(
    imageFile,
    form.company
  );
}

const payload = {
  ...form,
  image_url: imageUrl,
};
      if (product?.id) {
        await updateProduct(product.id, payload);
      } else {
        await addProduct(payload);
      }

      onClose();

    } catch (error) {
      console.error("Product Save Error:", error);
      console.log("Code:", error.code);
      console.log("Message:", error.message);
      console.log("Details:", error.details);
      console.log("Hint:", error.hint);

      alert(`
Error Code: ${error.code || "Unknown"}

Message:
${error.message || "Unknown"}

Details:
${error.details || "None"}

Hint:
${error.hint || "None"}
      `);

    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            {product ? "Edit Product" : "New Product"}
          </h2>

          <button
            onClick={onClose}
            className="text-xl"
          >
            ✕
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          <div className="grid grid-cols-2 gap-5">

            <input
              name="name"
              placeholder="Product Name"
              value={form.name}
              onChange={handleChange}
              className="border rounded-lg p-3"
              required
            />

            <input
              name="sku"
              placeholder="SKU"
              value={form.sku}
              onChange={handleChange}
              className="border rounded-lg p-3"
            />

            <input
              name="barcode"
              placeholder="Barcode"
              value={form.barcode}
              onChange={handleChange}
              className="border rounded-lg p-3"
            />

            <input
              name="company"
              placeholder="Company"
              value={form.company}
              onChange={handleChange}
              className="border rounded-lg p-3"
            />

            <input
              name="category"
              placeholder="Category"
              value={form.category}
              onChange={handleChange}
              className="border rounded-lg p-3"
            />

            <input
              name="supplier"
              placeholder="Supplier"
              value={form.supplier}
              onChange={handleChange}
              className="border rounded-lg p-3"
            />

            <input
              type="number"
              name="cost_price"
              placeholder="Cost Price"
              value={form.cost_price}
              onChange={handleChange}
              className="border rounded-lg p-3"
            />

            <input
              type="number"
              name="selling_price"
              placeholder="Selling Price"
              value={form.selling_price}
              onChange={handleChange}
              className="border rounded-lg p-3"
            />

            <input
              type="number"
              name="stock_quantity"
              placeholder="Current Stock"
              value={form.stock_quantity}
              onChange={handleChange}
              className="border rounded-lg p-3"
            />

            <input
              type="number"
              name="minimum_stock"
              placeholder="Minimum Stock"
              value={form.minimum_stock}
              onChange={handleChange}
              className="border rounded-lg p-3"
            />

          </div>

<div className="space-y-3">

  <label className="font-medium">
    Product Image
  </label>

  <input
    type="file"
    accept="image/*"
    onChange={handleImage}
    className="w-full border rounded-lg p-3"
  />

  {preview && (
    <img
      src={preview}
      alt="Product Preview"
      className="w-40 h-40 object-cover rounded-lg border shadow"
    />
  )}

</div>
          <textarea
            name="description"
            rows={4}
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          />

          <div className="flex justify-end gap-4">

            <button
              type="button"
              onClick={onClose}
              className="border rounded-lg px-5 py-2"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-6 py-2"
            >
              {saving ? "Saving..." : "Save Product"}
            </button>

          </div>

        </form>

      </div>
    </div>
  );
}