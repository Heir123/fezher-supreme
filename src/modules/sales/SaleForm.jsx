import { useEffect, useState } from "react";
import { supabase } from "@/services/supabase";
import { getCustomers } from "@/services/customerService";
import { getProducts } from "@/services/productService";

export default function SaleForm() {
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
              company_id:
                "196a067f-9cc4-4d99-88cd-f905b5a1ad3f",
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
              quantity: quantity,
              unit_price: product.selling_price,
              total_price: totalAmount,
            },
          ]);

      if (itemError) throw itemError;

      // Deduct Stock

const previousStock =
  Number(product.stock_quantity);

const newStock =
  previousStock - quantity;

const { error: stockError } =
  await supabase
    .from("products")
    .update({
      stock_quantity: newStock,
    })
    .eq("id", form.product_id);

if (stockError) throw stockError;

// Save Stock Movement

const { error: movementError } =
 await supabase
  .from("stock_movements")
  .insert([
    {
      company_id: product.company_id,
      product_id: product.id,
      movement_type: "Sale",
      quantity: quantity,
      reference_type: "Sale",
      reference_id: sale.id,
      notes: `Invoice ${invoiceNumber}`,
    },
  ]);

if (movementError) {
  console.error("Movement Error:", movementError);
  alert(JSON.stringify(movementError));
  return;
}
      alert("Sale saved successfully!");

      setForm({
        customer_id: "",
        product_id: "",
        quantity: 1,
      });

      loadData();

    } catch (error) {
      console.error(error);
      alert("Failed to save sale.");
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
        <div className="bg-slate-100 p-3 rounded">
          <p>
            Price:
            <strong>
              {" "}R {selectedProduct.selling_price}
            </strong>
          </p>

          <p>
            Available Stock:
            <strong>
              {" "}{selectedProduct.stock_quantity}
            </strong>
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
        className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700"
      >
        Save Sale
      </button>
    </div>
  );
}