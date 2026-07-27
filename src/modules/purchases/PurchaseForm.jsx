import { useEffect, useState } from "react";
import { supabase } from "@/services/supabase";

export default function PurchaseForm() {
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);

  const [form, setForm] = useState({
    supplier_id: "",
    product_id: "",
    quantity: 1,
    unit_cost: 0,
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
  const {
    data: suppliersData,
    error: suppliersError,
  } = await supabase
    .from("suppliers")
    .select("*")
    .order("name");

  console.log("SUPPLIERS:", suppliersData);
  console.log("SUPPLIERS ERROR:", suppliersError);

  const {
    data: productsData,
    error: productsError,
  } = await supabase
    .from("products")
    .select("*")
    .order("name");

  console.log("PRODUCTS:", productsData);
  console.log("PRODUCTS ERROR:", productsError);

  setSuppliers(suppliersData || []);
  setProducts(productsData || []);
}

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSave() {
    try {
      if (!form.supplier_id || !form.product_id) {
        alert("Please select supplier and product.");
        return;
      }

      const product = products.find(
        (p) => p.id === form.product_id
      );

      if (!product) {
        alert("Product not found.");
        return;
      }

      const quantity = Number(form.quantity);
      const unitCost = Number(form.unit_cost);

      const totalAmount = quantity * unitCost;

      const purchaseNumber =
        "PO-" + Date.now();

      // Create Purchase
      const { data: purchase, error: purchaseError } =
        await supabase
          .from("purchases")
          .insert([
            {
              company_id: product.company_id,
              supplier_id: form.supplier_id,
              purchase_number: purchaseNumber,
              total_amount: totalAmount,
              status: "Received",
            },
          ])
          .select()
          .single();

      if (purchaseError) throw purchaseError;

      // Create Purchase Item
      const { error: itemError } =
        await supabase
          .from("purchase_items")
          .insert([
            {
              purchase_id: purchase.id,
              product_id: form.product_id,
              quantity,
              unit_cost: unitCost,
              total_cost: totalAmount,
            },
          ]);

      if (itemError) throw itemError;

      // Increase Stock
      const newStock =
        Number(product.stock_quantity) + quantity;

      const { error: stockError } =
        await supabase
          .from("products")
          .update({
            stock_quantity: newStock,
          })
          .eq("id", form.product_id);

      if (stockError) throw stockError;

      // Inventory Movement
      const { error: movementError } =
        await supabase
          .from("stock_movements")
          .insert([
            {
              company_id: product.company_id,
              product_id: product.id,
              movement_type: "Purchase",
              quantity: quantity,
              reference_type: "Purchase",
              reference_id: purchase.id,
              notes: "Stock received from supplier",
            },
          ]);

      if (movementError) throw movementError;

      alert("Purchase saved successfully!");

      setForm({
        supplier_id: "",
        product_id: "",
        quantity: 1,
        unit_cost: 0,
      });

      loadData();

    } catch (error) {
      console.error(error);
      alert("Failed to save purchase.");
    }
  }

  const selectedProduct = products.find(
    (p) => p.id === form.product_id
  );

  return (
    <div className="space-y-4">

      <select
        name="supplier_id"
        value={form.supplier_id}
        onChange={handleChange}
        className="w-full border rounded-lg p-2"
      >
        <option value="">
          Select Supplier
        </option>

        {suppliers.map((supplier) => (
          <option
            key={supplier.id}
            value={supplier.id}
          >
            {supplier.name}
          </option>
        ))}
      </select>

      <select
        name="product_id"
        value={form.product_id}
        onChange={handleChange}
        className="w-full border rounded-lg p-2"
      >
        <option value="">
          Select Product
        </option>

        {products.map((product) => (
          <option
            key={product.id}
            value={product.id}
          >
            {product.name}
          </option>
        ))}
      </select>

      <input
        type="number"
        min="1"
        name="quantity"
        value={form.quantity}
        onChange={handleChange}
        className="w-full border rounded-lg p-2"
        placeholder="Quantity"
      />

      <input
        type="number"
        min="0"
        step="0.01"
        name="unit_cost"
        value={form.unit_cost}
        onChange={handleChange}
        className="w-full border rounded-lg p-2"
        placeholder="Unit Cost"
      />

      {selectedProduct && (
        <div className="bg-slate-100 p-3 rounded">
          <p>
            Current Stock:
            <strong>
              {" "}
              {selectedProduct.stock_quantity}
            </strong>
          </p>

          <p>
            New Stock:
            <strong>
              {" "}
              {Number(
                selectedProduct.stock_quantity
              ) + Number(form.quantity)}
            </strong>
          </p>
        </div>
      )}

      <button
        type="button"
        onClick={handleSave}
        className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700"
      >
        Receive Stock
      </button>

    </div>
  );
}