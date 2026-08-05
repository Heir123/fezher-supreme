import { useEffect, useState } from "react";
import { supabase } from "@/services/supabase";

export default function PurchaseForm({
  purchase,
  onSaved,
  onClose,
}) {
  const [companies, setCompanies] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);

  const [header, setHeader] = useState({
    company_id: "",
    supplier_id: "",
    purchase_date: new Date().toISOString().slice(0, 10),
    expected_date: "",
    status: "Received",
  });

  const [items, setItems] = useState([
    {
      product_id: "",
      quantity: 1,
      unit_cost: 0,
      discount: 0,
      tax: 0,
    },
  ]);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
  if (!purchase) return;

 setHeader({
  company_id: purchase.company_id || "",
  supplier_id: purchase.supplier_id || "",
  purchase_date:
    purchase.purchase_date ||
    purchase.created_at?.slice(0, 10) ||
    "",
  expected_date:
    purchase.expected_date || "",
  status: purchase.status || "Received",
});

  loadPurchaseItems(purchase.id);

}, [purchase]);

  async function loadData() {
    const { data: c } = await supabase.from("companies").select("*");
    const { data: s } = await supabase.from("suppliers").select("*");
    const { data: p } = await supabase.from("products").select("*");

    setCompanies(c || []);
    setSuppliers(s || []);
    setProducts(p || []);
  }

  async function loadPurchaseItems(purchaseId) {
  const { data, error } = await supabase
    .from("purchase_items")
    .select("*")
    .eq("purchase_id", purchaseId);

  if (error) {
    console.error("LOAD ITEMS ERROR:", error);
    return;
  }

  setItems(
    data.map((item) => ({
      product_id: item.product_id,
      quantity: item.quantity,
      unit_cost: item.unit_cost,
      discount: item.discount || 0,
      tax: item.tax || 0,
    }))
  );
}

  function updateItem(index, field, value) {
    const copy = [...items];
    copy[index][field] = value;
    setItems(copy);
  }

  function addRow() {
    setItems([
      ...items,
      {
        product_id: "",
        quantity: 1,
        unit_cost: 0,
        discount: 0,
        tax: 0,
      },
    ]);
  }

  function removeRow(index) {
    if (items.length === 1) return;
    setItems(items.filter((_, i) => i !== index));
  }

  const subtotal = items.reduce(
    (sum, item) =>
      sum + Number(item.quantity) * Number(item.unit_cost),
    0
  );

  const totalDiscount = items.reduce(
    (sum, item) => sum + Number(item.discount),
    0
  );

  const totalTax = items.reduce(
    (sum, item) => sum + Number(item.tax),
    0
  );

  const grandTotal = subtotal - totalDiscount + totalTax;

  async function handleSave() {
  try {
    if (
  !header.company_id ||
  !header.supplier_id ||
  items.length === 0 ||
  items.some(
    (item) =>
      !item.product_id ||
      Number(item.quantity) <= 0 ||
      Number(item.unit_cost) <= 0
  )
) {
  alert("Please complete all purchase details.");
  return;
}

    // Calculate total
    const totalAmount = items.reduce(
      (sum, item) =>
        sum +
        (Number(item.quantity || 0) *
          Number(item.unit_cost || 0)),
      0
    );

    // Create Purchase
   const purchaseNumber = "PO-" + Date.now();

   console.log("HEADER:", header);
console.log("ITEMS:", items);
console.log("HEADER BEFORE SAVE:", header);
const { data: savedPurchase, error: purchaseError } =
  await supabase
    .from("purchases")
    .insert({
  company_id: header.company_id,
  supplier_id: header.supplier_id,
  purchase_number: purchaseNumber,
  purchase_date: header.purchase_date,
  expected_date: header.expected_date,
  total_amount: totalAmount,
  status: header.status,
})
    .select()
    .single();

if (purchaseError) throw purchaseError;
    // Save Items
    for (const item of items) {
      const lineTotal =
        Number(item.quantity || 0) *
        Number(item.unit_cost || 0);

      const { error: itemError } =
        await supabase
          .from("purchase_items")
          .insert({
            purchase_id: savedPurchase.id,
            product_id: item.product_id,
            quantity: Number(item.quantity),
            unit_cost: Number(item.unit_cost),
            discount: Number(item.discount || 0),
            tax: Number(item.tax || 0),
            total_cost: lineTotal,
          });

      if (itemError) throw itemError;

      // Get current product
     const { data: product, error: productError } =
  await supabase
    .from("products")
    .select("*")
    .eq("id", item.product_id)
    .single();

if (productError) throw productError;
if (!product) throw new Error("Product not found.");

const newStock =
  Number(product.stock_quantity || 0) +
  Number(item.quantity);
      // Update stock
      const { error: stockError } =
        await supabase
          .from("products")
          .update({
            stock_quantity: newStock,
          })
          .eq("id", item.product_id);

      if (stockError) throw stockError;

      // Record movement
      const { error: movementError } =
        await supabase
          .from("stock_movements")
          .insert({
           company_id: header.company_id,
            product_id: item.product_id,
            movement_type: "Purchase",
            quantity: Number(item.quantity),
            reference_type: "Purchase",
            reference_id: savedPurchase.id,
            notes: "Stock received",
            unit_cost: Number(item.unit_cost),
            total_value: lineTotal,
          });

      if (movementError) throw movementError;
    }

  alert("Purchase saved successfully!");

if (onSaved) {
  await onSaved();
}

if (onClose) {
  onClose();
}

  } catch (error) {
    console.error("PURCHASE ERROR:", error);
    alert(error.message || "Failed to save purchase.");
  }
}
  return (
    <div className="space-y-6">

      <div className="grid grid-cols-2 gap-6">

        <div>
          <label className="block font-medium mb-2">
            Company
          </label>

          <select
            className="w-full border rounded-lg p-3"
            value={header.company_id}
            onChange={(e) =>
              setHeader({
                ...header,
                company_id: e.target.value,
              })
            }
          >
            <option value="">Select Company</option>

            {companies.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-medium mb-2">
            Supplier
          </label>

          <select
            className="w-full border rounded-lg p-3"
            value={header.supplier_id}
            onChange={(e) =>
              setHeader({
                ...header,
                supplier_id: e.target.value,
              })
            }
          >
            <option value="">Select Supplier</option>

            {suppliers.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-medium mb-2">
            Purchase Date
          </label>

          <input
            type="date"
            className="w-full border rounded-lg p-3"
            value={header.purchase_date}
            onChange={(e) =>
              setHeader({
                ...header,
                purchase_date: e.target.value,
              })
            }
          />
        </div>

        <div>
          <label className="block font-medium mb-2">
            Expected Delivery
          </label>

          <input
            type="date"
            className="w-full border rounded-lg p-3"
            value={header.expected_date}
            onChange={(e) =>
              setHeader({
                ...header,
                expected_date: e.target.value,
              })
            }
          />
        </div>

      </div>

      <div className="border rounded-xl overflow-hidden">

        <table className="w-full">

          <thead className="bg-slate-100">

            <tr>

              <th className="p-3 text-left">Product</th>
              <th className="p-3">Qty</th>
              <th className="p-3">Cost</th>
              <th className="p-3">Discount</th>
              <th className="p-3">Tax</th>
              <th className="p-3">Total</th>
              <th></th>

            </tr>

          </thead>

          <tbody>

            {items.map((item, index) => (
              <tr key={index} className="border-t">

                <td className="p-2">

                  <select
                    className="w-full border rounded p-2"
                    value={item.product_id}
                    onChange={(e) =>
                      updateItem(index, "product_id", e.target.value)
                    }
                  >
                    <option>Select Product</option>

                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>

                </td>

                <td>
                  <input
                    type="number"
                    className="w-20 border rounded p-2"
                    value={item.quantity}
                    onChange={(e) =>
                      updateItem(index, "quantity", e.target.value)
                    }
                  />
                </td>

                <td>
                  <input
                    type="number"
                    className="w-28 border rounded p-2"
                    value={item.unit_cost}
                    onChange={(e) =>
                      updateItem(index, "unit_cost", e.target.value)
                    }
                  />
                </td>

                <td>
                  <input
                    type="number"
                    className="w-24 border rounded p-2"
                    value={item.discount}
                    onChange={(e) =>
                      updateItem(index, "discount", e.target.value)
                    }
                  />
                </td>

                <td>
                  <input
                    type="number"
                    className="w-24 border rounded p-2"
                    value={item.tax}
                    onChange={(e) =>
                      updateItem(index, "tax", e.target.value)
                    }
                  />
                </td>

                <td className="font-semibold text-center">
                 {
  (
    (
      Number(item.quantity || 0) *
      Number(item.unit_cost || 0)
    ) -
    Number(item.discount || 0) +
    Number(item.tax || 0)
  ).toFixed(2)
}
                </td>

                <td>
                  <button
                    onClick={() => removeRow(index)}
                    className="text-red-600"
                  >
                    🗑
                  </button>
                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>

      <button
        onClick={addRow}
        className="bg-slate-200 px-4 py-2 rounded-lg"
      >
        + Add Product
      </button>

      <div className="flex justify-end">

        <div className="w-80 space-y-2">

          <div className="flex justify-between">
            <span>Subtotal</span>
            <strong>R {subtotal.toFixed(2)}</strong>
          </div>

          <div className="flex justify-between">
            <span>Discount</span>
            <strong>R {totalDiscount.toFixed(2)}</strong>
          </div>

          <div className="flex justify-between">
            <span>Tax</span>
            <strong>R {totalTax.toFixed(2)}</strong>
          </div>

          <div className="border-t pt-3 flex justify-between text-xl font-bold">
            <span>Grand Total</span>
            <span>R {grandTotal.toFixed(2)}</span>
          </div>

        </div>

      </div>

      <div className="sticky bottom-0 bg-white border-t mt-6 pt-4 flex justify-end gap-3">

        <button
          onClick={onClose}
          className="border px-5 py-3 rounded-lg"
        >
          Cancel
        </button>

        <button
          onClick={handleSave}
          className="bg-green-600 text-white px-6 py-3 rounded-lg"
        >
          Receive Stock
        </button>

      </div>

    </div>
  );
}