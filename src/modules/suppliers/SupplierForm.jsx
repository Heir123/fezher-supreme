import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SupplierForm({
  onSave,
  editingSupplier,
  onCancel,
}) {
  const [form, setForm] = useState({
  company_id: "196a067f-9cc4-4d99-88cd-f905b5a1ad3f",
  name: "",
  contact_person: "",
  email: "",
  phone: "",
  address: "",
  status: "Active",
});

  useEffect(() => {
    if (editingSupplier) {
      setForm({
  name: editingSupplier.name || "",
  contact_person: editingSupplier.contact_person || "",
  email: editingSupplier.email || "",
  phone: editingSupplier.phone || "",
  address: editingSupplier.address || "",
  status: editingSupplier.status || "Active",
});
    } else {
      setForm({
  name: "",
  contact_person: "",
  email: "",
  phone: "",
  address: "",
  status: "Active",
});
    }
  }, [editingSupplier]);

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!form.name.trim()) {
      alert("Supplier name is required.");
      return;
    }

    onSave(form);

    if (!editingSupplier) {
      setForm({
        name: "",
        contact_person: "",
        email: "",
        phone: "",
        address: "",

              });
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Supplier Name</Label>
        <Input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Supplier name"
        />
      </div>

      <div>
        <Label>Contact Person</Label>
        <Input
          name="contact_person"
          value={form.contact_person}
          onChange={handleChange}
          placeholder="Contact person"
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

<div>
  <Label>Status</Label>

  <select
    name="status"
    value={form.status}
    onChange={handleChange}
    className="w-full border rounded-md p-2"
  >
    <option value="Active">Active</option>
    <option value="Inactive">Inactive</option>
  </select>
</div>

<div className="flex gap-2 pt-2">
  <Button type="submit">
    {editingSupplier ? "Update Supplier" : "Add Supplier"}
  </Button>

  {editingSupplier && (
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