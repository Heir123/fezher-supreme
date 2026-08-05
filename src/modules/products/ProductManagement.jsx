import { useEffect, useMemo, useState } from "react";

import DashboardLayout from "@/layouts/DashboardLayout";

import ProductTable from "./ProductTable";
import ProductDialogV2 from "./ProductDialogV2";
import ProductStats from "./ProductStats";

import {
  getProducts,
  deleteProduct,
} from "@/services/productService";

export default function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [open, setOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    try {
      setLoading(true);

      const data = await getProducts();

      setProducts(data || []);
    } catch (error) {
      console.error("Failed to load products:", error);
    } finally {
      setLoading(false);
    }
  }

  function handleAdd() {
    setSelectedProduct(null);
    setOpen(true);
  }

  function handleEdit(product) {
    setSelectedProduct(product);
    setOpen(true);
  }

  async function handleDelete(product) {
  const confirmed = window.confirm(
    `Delete "${product.name}"?`
  );

  if (!confirmed) return;

  try {
    await deleteProduct(product.id);

    await loadProducts();

  } catch (err) {
    console.error(err);
    alert("Failed to delete product.");
  }
}

  function handleClose() {
    setOpen(false);
    setSelectedProduct(null);
    loadProducts();
  }

  const filteredProducts = useMemo(() => {
    return products.filter((product) =>
      (product.name || "")
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [products, search]);

  return (
    <DashboardLayout>
      <div className="space-y-6">

        {/* Header */}

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

          <div>
            <h1 className="text-3xl font-bold">
              Product Management
            </h1>

            <p className="text-gray-500">
              Manage products, stock and inventory.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">

            <input
              type="text"
              className="border rounded-lg px-4 py-2 w-72"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <button
              onClick={handleAdd}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
            >
              + Add Product
            </button>

          </div>

        </div>

        {/* Statistics */}

        <ProductStats products={products} />

        {/* Products Table */}

        {loading ? (
          <div className="bg-white rounded-xl shadow p-12 text-center">
            Loading products...
          </div>
        ) : (
         <ProductTable
  products={filteredProducts}
  onEdit={handleEdit}
  onDelete={handleDelete}
/>
        )}

        {/* Product Dialog */}

     <ProductDialogV2
  open={open}
  onClose={handleClose}
  product={selectedProduct}
  onSaved={loadProducts}
/>

      </div>
    </DashboardLayout>
  );
}