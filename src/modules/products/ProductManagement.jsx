import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import ProductTable from "./ProductTable";
import ProductDialog from "./ProductDialog";
import ProductStats from "./ProductStats";

import { getProducts } from "@/services/productService";

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

  function handleClose() {
    setOpen(false);
    setSelectedProduct(null);
    loadProducts();
  }

  const filteredProducts = useMemo(() => {
    return products.filter((product) =>
      product.name.toLowerCase().includes(search.toLowerCase())
    );
    <ProductStats products={products} />
  }, [products, search]);

  return (
  <DashboardLayout>
    <div className="space-y-6">

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Product Management
          </h1>

          <p className="text-gray-500">
            Manage all company products.
          </p>
        </div>

        <button
          onClick={handleAdd}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          + Add Product
        </button>
      </div>

      {/* Paste it here */}
      <ProductStats products={products} />

      <input
        className="w-full border rounded-lg p-2"
        placeholder="Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading ? (
        <div className="text-center py-10">
          Loading products...
        </div>
      ) : (
        <ProductTable
          products={filteredProducts}
          onEdit={handleEdit}
        />
      )}

      <ProductDialog
        open={open}
        onClose={handleClose}
        product={selectedProduct}
      />

    </div>
  </DashboardLayout>
);
}