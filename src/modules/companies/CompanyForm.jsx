import { useEffect, useState } from "react";

const initialState = {
  name: "",
  email: "",
  phone: "",
  address: "",
};

export default function CompanyForm({
  initialData,
  onSubmit,
  onCancel,
  loading = false,
}) {
  const [formData, setFormData] = useState(initialState);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        email: initialData.email || "",
        phone: initialData.phone || "",
        address: initialData.address || "",
      });
    } else {
      setFormData(initialState);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert("Company name is required.");
      return;
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      <div>
        <label className="block mb-1 font-medium">
          Company Name
        </label>

        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full border rounded-lg p-2"
          placeholder="Enter company name"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">
          Email
        </label>

        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full border rounded-lg p-2"
          placeholder="company@email.com"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">
          Phone
        </label>

        <input
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className="w-full border rounded-lg p-2"
          placeholder="Phone number"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">
          Address
        </label>

        <textarea
          rows={3}
          name="address"
          value={formData.address}
          onChange={handleChange}
          className="w-full border rounded-lg p-2"
          placeholder="Company address"
        />
      </div>

      <div className="flex justify-end gap-2">

        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-lg border"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white"
        >
          {loading ? "Saving..." : "Save Company"}
        </button>

      </div>

    </form>
  );
}