import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { getCompanies } from "@/services/companyService";

export default function CategoryForm({
  editingCategory,
  onSave,
  onCancel,
}) {
  const emptyForm = {
    company_id: "",
    name: "",
    description: "",
  };

  const [form, setForm] = useState(emptyForm);
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    loadCompanies();
  }, []);

  async function loadCompanies() {
    try {
      const data = await getCompanies();
      setCompanies(data || []);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    if (editingCategory) {
      setForm({
        company_id: editingCategory.company_id || "",
        name: editingCategory.name || "",
        description: editingCategory.description || "",
      });
    } else {
      setForm(emptyForm);
    }
  }, [editingCategory]);

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!form.company_id) {
      alert("Please select a company.");
      return;
    }

    if (!form.name.trim()) {
      alert("Category name is required.");
      return;
    }

    onSave(form);

    setForm(emptyForm);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      {/* Company */}

      <div className="space-y-2">
        <Label>Company</Label>

        <Select
          value={form.company_id}
          onValueChange={(value) =>
            setForm((prev) => ({
              ...prev,
              company_id: value,
            }))
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Company" />
          </SelectTrigger>

          <SelectContent>
            {companies.map((company) => (
              <SelectItem
                key={company.id}
                value={company.id}
              >
                {company.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Category Name */}

      <div className="space-y-2">
        <Label>Category Name</Label>

        <Input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Electronics"
        />
      </div>

      {/* Description */}

      <div className="space-y-2">
        <Label>Description</Label>

        <Input
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Optional"
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
        >
          Cancel
        </Button>

        <Button type="submit">
          {editingCategory
            ? "Update Category"
            : "Create Category"}
        </Button>
      </div>
    </form>
  );
}