import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function CustomerForm({
  onSave,
  editingCustomer,
  onCancel,
}) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    if (editingCustomer) {
      setForm({
        name: editingCustomer.name || "",
        email: editingCustomer.email || "",
        phone: editingCustomer.phone || "",
        address: editingCustomer.address || "",
      });
    } else {
      setForm({
        name: "",
        email: "",
        phone: "",
        address: "",
      });
    }
  }, [editingCustomer]);

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!form.name.trim()) {
      alert("Customer name is required.");
      return;
    }

    onSave(form);

    if (!editingCustomer) {
      setForm({
        name: "",
        email: "",
        phone: "",
        address: "",
      });
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Customer Name</Label>
        <Input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Customer name"
        />
      </div>

      <div>
        <Label>Email</Label>
        <Input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
        />
      </div>

      <div>
        <Label>Phone</Label>
        <Input
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="Phone"
        />
      </div>

      <div>
        <Label>Address</Label>
        <Input
          name="address"
          value={form.address}
          onChange={handleChange}
          placeholder="Address"
        />
      </div>

      <div className="flex gap-2 pt-2">
        <Button type="submit">
          {editingCustomer ? "Update Customer" : "Add Customer"}
        </Button>

        {editingCustomer && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}