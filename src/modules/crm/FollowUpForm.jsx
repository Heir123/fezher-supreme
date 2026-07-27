import { useState } from "react";
import { addFollowUp } from "@/services/followUpService";

export default function FollowUpForm({ onFollowUpAdded }) {
  const [formData, setFormData] = useState({
    opportunity_id: "",
    notes: "",
    follow_up_date: "",
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
      await addFollowUp({
        opportunity_id: formData.opportunity_id || null,
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
      console.error(error);
      alert("Failed to save follow-up");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      <input
        type="text"
        name="opportunity_id"
        placeholder="Opportunity ID"
        value={formData.opportunity_id}
        onChange={handleChange}
        className="w-full border rounded p-2"
      />

      <textarea
        name="notes"
        placeholder="Follow-up Notes"
        value={formData.notes}
        onChange={handleChange}
        className="w-full border rounded p-2"
        rows="4"
      />

      <input
        type="date"
        name="follow_up_date"
        value={formData.follow_up_date}
        onChange={handleChange}
        className="w-full border rounded p-2"
      />

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Save Follow-up
      </button>

    </form>
  );
}