import { useState, useEffect } from "react";
import { addFollowUp } from "@/services/followUpService";
import { getOpportunities } from "@/services/opportunityService";

export default function FollowUpForm({ onFollowUpAdded }) {
  const [formData, setFormData] = useState({
    opportunity_id: "",
    notes: "",
    follow_up_date: "",
  });

  const [opportunities, setOpportunities] = useState([]);
  const [loadingOpportunities, setLoadingOpportunities] = useState(true);

  useEffect(() => {
    loadOpportunities();
  }, []);

  async function loadOpportunities() {
    try {
      setLoadingOpportunities(true);

      const data = await getOpportunities();

      console.log("FOLLOW-UP OPPORTUNITIES:", data);

      setOpportunities(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("FOLLOW-UP OPPORTUNITIES ERROR:", error);
      setOpportunities([]);
    } finally {
      setLoadingOpportunities(false);
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

    if (!formData.opportunity_id) {
      alert("Please select an opportunity");
      return;
    }

    if (!formData.follow_up_date) {
      alert("Please select a follow-up date");
      return;
    }

    try {
      await addFollowUp({
        opportunity_id: formData.opportunity_id,
        notes: formData.notes,
        follow_up_date: formData.follow_up_date,
      });

      alert("Follow-up saved successfully");

      if (onFollowUpAdded) {
        onFollowUpAdded();
      }

      setFormData({
        opportunity_id: "",
        notes: "",
        follow_up_date: "",
      });
    } catch (error) {
      console.error("ADD FOLLOW-UP ERROR:", error);
      alert("Failed to save follow-up");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Opportunity
        </label>

        <select
          name="opportunity_id"
          value={formData.opportunity_id}
          onChange={handleChange}
          className="w-full border rounded p-2"
          required
        >
          <option value="">
            {loadingOpportunities
              ? "Loading opportunities..."
              : "Select an opportunity"}
          </option>

          {opportunities.map((opportunity) => (
            <option
              key={opportunity.id}
              value={opportunity.id}
            >
              {opportunity.title || "Untitled Opportunity"}
              {" — "}
              R {Number(opportunity.value || 0).toLocaleString("en-ZA", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Follow-up Notes
        </label>

        <textarea
          name="notes"
          placeholder="Follow-up Notes"
          value={formData.notes}
          onChange={handleChange}
          className="w-full border rounded p-2"
          rows="4"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Follow-up Date
        </label>

        <input
          type="date"
          name="follow_up_date"
          value={formData.follow_up_date}
          onChange={handleChange}
          className="w-full border rounded p-2"
          required
        />
      </div>

      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
      >
        Save Follow-up
      </button>

    </form>
  );
}

