import { useState } from "react";
import CompanyForm from "./CompanyForm";

export default function CompanyDialog({
  open,
  onClose,
  onSave,
  initialData = null,
}) {
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleSubmit = async (data) => {
    try {
      setLoading(true);

      await onSave(data);

      onClose();
    } catch (error) {
      console.error(error);
      alert(error.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-xl p-6">

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">
            {initialData ? "Edit Company" : "New Company"}
          </h2>

          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black text-xl"
          >
            ×
          </button>
        </div>

        <CompanyForm
          initialData={initialData}
          onSubmit={handleSubmit}
          onCancel={onClose}
          loading={loading}
        />

      </div>
    </div>
  );
}