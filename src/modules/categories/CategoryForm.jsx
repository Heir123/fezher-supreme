import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function CategoryForm({
  editingCategory,
  onSave,
  onCancel,
}) {
  const emptyForm = {
    name: "",
    description: "",
  };

  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (editingCategory) {
      setForm({
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

    if (!form.name.trim()) return;

    onSave(form);

    setForm(emptyForm);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      <div className="space-y-2">
        <Label htmlFor="name">
          Category Name
        </Label>

        <Input
          id="name"
          name="name"
          placeholder="Example: Electronics"
          value={form.name}
          onChange={handleChange}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">
          Description
        </Label>

        <Input
          id="description"
          name="description"
          placeholder="Optional"
          value={form.description}
          onChange={handleChange}
        />
      </div>

      <div className="flex justify-end gap-2 pt-2">
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