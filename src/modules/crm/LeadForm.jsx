import { useState } from "react";
import { addLead } from "@/services/crmService";

export default function LeadForm({ onLeadAdded }) {
  const [formData, setFormData] = useState({
    customer_name: "",
    email: "",
    phone: "",
    source: "",
  });

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
  e.preventDefault();

  try {
   await addLead({
  company_id: null,
  customer_name: formData.customer_name,
  email: formData.email,
  phone: formData.phone,
  source: formData.source,
});

alert("Lead saved successfully");

if (onLeadAdded) {
  onLeadAdded();
}

setFormData({
  customer_name: "",
  email: "",
  phone: "",
  source: "",
});

  } catch (error) {
    console.error(error);
    alert("Failed to save lead");
  }
}

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      <input
        type="text"
        name="customer_name"
        placeholder="Customer Name"
        className="w-full border p-2 rounded"
        onChange={handleChange}
      />

      <input
        type="email"
        name="email"
        placeholder="Email"
        className="w-full border p-2 rounded"
        onChange={handleChange}
      />

      <input
        type="text"
        name="phone"
        placeholder="Phone"
        className="w-full border p-2 rounded"
        onChange={handleChange}
      />

      <input
        type="text"
        name="source"
        placeholder="Lead Source"
        className="w-full border p-2 rounded"
        onChange={handleChange}
      />

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Save Lead
      </button>

    </form>
  );
}