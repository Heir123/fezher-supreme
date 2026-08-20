import { useEffect, useState } from "react";
import { addOpportunity } from "@/services/opportunityService";
import { getLeads } from "@/services/crmService";

export default function OpportunityForm({ onOpportunityAdded }) {
  const [leads, setLeads] = useState([]);
  const [loadingLeads, setLoadingLeads] = useState(true);

  const [formData, setFormData] = useState({
    lead_id: "",
    opportunity_name: "",
    value: "",
    stage: "New",
  });

  useEffect(() => {
    loadLeads();
  }, []);

  async function loadLeads() {
    try {
      setLoadingLeads(true);

      const data = await getLeads();

      console.log("OPPORTUNITY LEADS:", data);

      setLeads(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("OPPORTUNITY LEADS ERROR:", error);
      setLeads([]);
    } finally {
      setLoadingLeads(false);
    }
  }

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!formData.opportunity_name.trim()) {
      alert("Please enter an opportunity name.");
      return;
    }

    if (!formData.value) {
      alert("Please enter the opportunity value.");
      return;
    }

    try {
      await addOpportunity({
        lead_id: formData.lead_id || null,
        title: formData.opportunity_name.trim(),
        value: Number(formData.value),
        stage: formData.stage,
      });

      alert("Opportunity saved successfully.");

      setFormData({
        lead_id: "",
        opportunity_name: "",
        value: "",
        stage: "New",
      });

      if (onOpportunityAdded) {
        onOpportunityAdded();
      }
    } catch (error) {
      console.error("SAVE OPPORTUNITY ERROR:", error);
      alert("Failed to save opportunity.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      {/* Lead */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Lead / Customer
        </label>

        <select
          name="lead_id"
          value={formData.lead_id}
          onChange={handleChange}
          className="w-full border rounded-lg p-2"
          disabled={loadingLeads}
        >
          <option value="">
            {loadingLeads
              ? "Loading leads..."
              : "Select a lead"}
          </option>

          {leads.map((lead) => (
            <option key={lead.id} value={lead.id}>
              {lead.customer_name}
              {lead.email ? ` — ${lead.email}` : ""}
            </option>
          ))}
        </select>
      </div>

      {/* Opportunity Name */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Opportunity Name
        </label>

        <input
          type="text"
          name="opportunity_name"
          value={formData.opportunity_name}
          placeholder="Opportunity Name"
          className="w-full border rounded-lg p-2"
          onChange={handleChange}
        />
      </div>

      {/* Opportunity Value */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Opportunity Value
        </label>

        <input
          type="number"
          name="value"
          value={formData.value}
          placeholder="Opportunity Value"
          min="0"
          step="0.01"
          className="w-full border rounded-lg p-2"
          onChange={handleChange}
        />
      </div>

      {/* Stage */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Stage
        </label>

        <select
          name="stage"
          value={formData.stage}
          className="w-full border rounded-lg p-2"
          onChange={handleChange}
        >
          <option value="New">New</option>
          <option value="Qualified">Qualified</option>
          <option value="Proposal">Proposal</option>
          <option value="Negotiation">Negotiation</option>
          <option value="Won">Won</option>
          <option value="Lost">Lost</option>
        </select>
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
      >
        Save Opportunity
      </button>

    </form>
  );
}