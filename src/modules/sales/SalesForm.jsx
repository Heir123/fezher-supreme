import { useEffect, useState } from "react";
import { supabase } from "@/services/supabase";
import { createTransaction } from "@/services/transactionService";
import { getCustomers } from "@/services/customerService";
import { getProducts } from "@/services/productService";

export default function SalesForm({ onSuccess }) {
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);

  const [form, setForm] = useState({
    customer_id: "",
    product_id: "",
    quantity: 1,
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const customerData = await getCustomers();
    const productData = await getProducts();

    setCustomers(customerData || []);
    setProducts(productData || []);
  }

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSave() {
    try {
      if (!form.customer_id || !form.product_id) {
        alert("Please select customer and product.");
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

      if (quantity > Number(product.stock_quantity)) {
        alert("Not enough stock available.");
        return;
      }

      const totalAmount =
        Number(product.selling_price) * quantity;

      const invoiceNumber =
        "INV-" + Date.now();

      // Create Sale
      const { data: sale, error: saleError } =
        await supabase
          .from("sales")
          .insert([
            {
              company_id: product.company_id,
              customer_id: form.customer_id,
              invoice_number: invoiceNumber,
              total_amount: totalAmount,
              status: "Paid",
            },
          ])
          .select()
          .single();

      if (saleError) throw saleError;

      // Create Sale Item
      const { error: itemError } =
        await supabase
          .from("sale_items")
          .insert([
            {
              sale_id: sale.id,
              product_id: form.product_id,
              quantity,
              unit_price: product.selling_price,
              total_price: totalAmount,
            },
          ]);

      if (itemError) throw itemError;

      // Update Stock
      const newStock =
        Number(product.stock_quantity) - quantity;

      const { error: stockError } =
        await supabase
          .from("products")
          .update({
            stock_quantity: newStock,
          })
          .eq("id", form.product_id);

      if (stockError) throw stockError;

      // Stock Movement
      const { error: movementError } =
        await supabase
          .from("stock_movements")
          .insert([
            {
              company_id: product.company_id,
              product_id: product.id,
              movement_type: "Sale",
              quantity,
              reference_type: "Sale",
              reference_id: sale.id,
              notes: `Invoice ${invoiceNumber}`,
            },
          ]);

      if (movementError) throw movementError;

      // Financial Transaction
      await createTransaction({
        company_id: product.company_id,
        reference: invoiceNumber,
        transaction_type: "Sale",
        description: `Sale Invoice ${invoiceNumber}`,
        income: totalAmount,
        expense: 0,
        balance: 0,
      });

      alert("Sale saved successfully!");

      setForm({
        customer_id: "",
        product_id: "",
        quantity: 1,
      });

      await loadData();

      if (onSuccess) {
        onSuccess();
      }

    } catch (error) {
      console.error(error);
      alert(
        error?.message ||
        JSON.stringify(error, null, 2)
      );
    }
  }

  const selectedProduct = products.find(
    (p) => p.id === form.product_id
  );

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">
        New Sale
      </h2>

      <select
        name="customer_id"
        value={form.customer_id}
        onChange={handleChange}
        className="w-full border rounded-lg p-2"
      >
        <option value="">Select Customer</option>

        {customers.map((customer) => (
          <option
            key={customer.id}
            value={customer.id}
          >
            {customer.name}
          </option>
        ))}
      </select>

      <select
        name="product_id"
        value={form.product_id}
        onChange={handleChange}
        className="w-full border rounded-lg p-2"
      >
        <option value="">Select Product</option>

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
      />

      {selectedProduct && (
        <div className="bg-slate-100 rounded-lg p-4 space-y-2">
          <p>
            Price:
            <strong> R {selectedProduct.selling_price}</strong>
          </p>

          <p>
            Available Stock:
            <strong> {selectedProduct.stock_quantity}</strong>
          </p>

          <p>
            Total:
            <strong>
              {" "}
              R{" "}
              {(
                Number(selectedProduct.selling_price) *
                Number(form.quantity)
              ).toFixed(2)}
            </strong>
          </p>
        </div>
      )}

      <button
        type="button"
        onClick={handleSave}
        className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg"
      >
        Save Sale
      </button>
    </div>
  );
}