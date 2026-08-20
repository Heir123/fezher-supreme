import SalesForm from "./SalesForm";

export default function SaleDialog({
  open,
  onClose,
  onSuccess,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">

      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">

        <div className="flex items-center justify-between border-b px-6 py-4">

          <h2 className="text-2xl font-bold">
            New Sale
          </h2>

          <button
            onClick={onClose}
            className="text-2xl font-bold text-red-500 hover:text-red-700"
          >
            ×
          </button>

        </div>

        <div className="p-6">

          <SalesForm
            onSuccess={() => {
              onSuccess?.();
              onClose();
            }}
          />

        </div>

      </div>

    </div>
  );
}