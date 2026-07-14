import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function CompanyForm({
  onSave,
  editingCompany,
  onCancel,
}) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    if (editingCompany) {
      setForm(editingCompany);
    } else {
      setForm({
        name: "",
        email: "",
        phone: "",
        address: "",
      });
    }
  }, [editingCompany]);

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!form.name.trim()) {
      alert("Company name is required.");
      return;
    }

    onSave(form);

    setForm({
      name: "",
      email: "",
      phone: "",
      address: "",
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 border rounded-lg p-6 mb-6"
    >
      <div>
        <Label>Company Name</Label>
        <Input
          name="name"
          value={form.name}
          onChange={handleChange}
        />
      </div>

      <div>
        <Label>Email</Label>
        <Input
          name="email"
          value={form.email}
          onChange={handleChange}
        />
      </div>

      <div>
        <Label>Phone</Label>
        <Input
          name="phone"
          value={form.phone}
          onChange={handleChange}
        />
      </div>

      <div>
        <Label>Address</Label>
        <Input
          name="address"
          value={form.address}
          onChange={handleChange}
        />
      </div>

      <div className="flex gap-2">
        <Button type="submit">
          {editingCompany ? "Update Company" : "Add Company"}
        </Button>

        {editingCompany && (
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