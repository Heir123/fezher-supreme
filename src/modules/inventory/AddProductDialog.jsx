import { useState } from "react";
import Modal from "@/components/Modal";
import ProductForm from "./ProductForm";
import { addProduct } from "@/services/productService";

export default function AddProductDialog({ onProductAdded }) {
  const [open, setOpen] = useState(false);

  async function handleAddProduct(product) {
    try {
      await addProduct(product);

      setOpen(false);

      if (onProductAdded) {
        onProductAdded();
      }
    } catch (error) {
  console.error("Supabase Error:", error);

  alert(
    error?.message ||
    JSON.stringify(error) ||
    "Failed to save product."
  );
}
  }
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
      >
        Add Product
      </button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Add New Product"
      >
        <ProductForm onSubmit={handleAddProduct} />
      </Modal>
    </>
  );
}