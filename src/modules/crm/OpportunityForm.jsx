import { useState } from "react";
import { addOpportunity } from "@/services/opportunityService";

export default function OpportunityForm({ onOpportunityAdded }) {
  const [formData, setFormData] = useState({
    opportunity_name: "",
    customer: "",
    value: "",
    stage: "New",
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
      await addOpportunity({
        lead_id: null,
        title: formData.opportunity_name,
        value: Number(formData.value),
        stage: formData.stage,
      });

      alert("Opportunity saved successfully");

      if (onOpportunityAdded) {
        onOpportunityAdded();
      }

      setFormData({
        opportunity_name: "",
        customer: "",
        value: "",
        stage: "New",
      });

    } catch (error) {
      console.error(error);
      alert("Failed to save opportunity");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      <input
        name="opportunity_name"
        value={formData.opportunity_name}
        placeholder="Opportunity Name"
        className="w-full border rounded p-2"
        onChange={handleChange}
      />

      <input
        name="customer"
        value={formData.customer}
        placeholder="Customer"
        className="w-full border rounded p-2"
        onChange={handleChange}
      />

      <input
        type="number"
        name="value"
        value={formData.value}
        placeholder="Opportunity Value"
        className="w-full border rounded p-2"
        onChange={handleChange}
      />

      <select
        name="stage"
        value={formData.stage}
        className="w-full border rounded p-2"
        onChange={handleChange}
      >
        <option>New</option>
        <option>Qualified</option>
        <option>Proposal</option>
        <option>Negotiation</option>
        <option>Won</option>
        <option>Lost</option>
      </select>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Save Opportunity
      </button>

    </form>
  );
}