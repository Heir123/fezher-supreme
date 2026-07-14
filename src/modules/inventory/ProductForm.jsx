import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getCompanies } from "@/services/companyService";
import { getCategories } from "@/services/categoryService";

export default function ProductForm({ product, onSubmit }) {
  const [formData, setFormData] = useState({
    name: product?.name || "",
    company_id: product?.company_id || "",
    category_id: product?.category_id || "",
    sku: product?.sku || "",
    description: product?.description || "",
    price: product?.price || "",
    stock: product?.stock || "",
  });

  const [companies, setCompanies] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    console.log("useEffect running");
    loadCompanies();
    loadCategories();
  }, []);

  async function loadCompanies() {
    const data = await getCompanies();
    console.log("Companies:", data);
    setCompanies(data || []);
  }

  async function loadCategories() {
    const data = await getCategories();
    console.log("Categories:", data);
    setCategories(data || []);
  }

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  function handleSubmit(e) {
    e.preventDefault();

    onSubmit({
      ...formData,
      price: Number(formData.price),
      stock: Number(formData.stock),
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Product Name</Label>
        <Input
          name="name"
          value={formData.name}
          onChange={handleChange}
        />
      </div>

      <div>
        <Label>Category</Label>
        <select
          name="category_id"
          value={formData.category_id}
          onChange={handleChange}
          className="w-full border rounded p-2"
        >
          <option value="">Select Category</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <Label>Company</Label>
        <select
          name="company_id"
          value={formData.company_id}
          onChange={handleChange}
          className="w-full border rounded p-2"
        >
          <option value="">Select Company</option>
          {companies.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <Button type="submit">Save Product</Button>
    </form>
  );
}