import { useState } from "react";
import Modal from "@/components/Modal";
import ProductForm from "./ProductForm";
import { updateProduct } from "@/services/productService";
export default function EditProductDialog({
  product,
  onProductUpdated,
}) {
  const [open, setOpen] = useState(false);

 async function handleUpdate(updatedProduct) {
  try {
    console.log("Product ID:", product.id);
    console.log("Updated Product:", updatedProduct);

    const result = await updateProduct(product.id, updatedProduct);

    console.log("Update Result:", result);

    setOpen(false);

    if (onProductUpdated) {
      onProductUpdated();
    }
  } catch (error) {
    console.error("Update Error:", error);
    alert(error.message);
  }
}

  return (
    <>
      <button
       onClick={() => {
  console.log("Edit clicked");
  setOpen(true);
}}
        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
      >
        Edit
      </button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Edit Product"
      >
        <ProductForm
          product={product}
          onSubmit={handleUpdate}
        />
      </Modal>
    </>
  );
}