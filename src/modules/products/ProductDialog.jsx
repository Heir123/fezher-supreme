import ProductForm from "./ProductForm";

export default function ProductDialog({
  open,
  onClose,
  product,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">

      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl">

        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4">

          <h2 className="text-2xl font-bold">
            {product ? "Edit Product" : "New Product"}
          </h2>

          <button
            onClick={onClose}
            className="text-2xl text-gray-500 hover:text-red-600"
          >
            ×
          </button>

        </div>

        {/* Form */}
        <div className="p-6">
          <ProductForm
            product={product}
            onSuccess={onClose}
          />
        </div>

      </div>

    </div>
  );
}