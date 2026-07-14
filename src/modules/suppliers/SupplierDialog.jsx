import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import SupplierForm from "./SupplierForm";

export default function SupplierDialog({
  open,
  onOpenChange,
  onSave,
  editingSupplier,
  onCancel,
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>
            {editingSupplier
              ? "Edit Supplier"
              : "New Supplier"}
          </DialogTitle>
        </DialogHeader>

        <SupplierForm
          onSave={onSave}
          editingSupplier={editingSupplier}
          onCancel={onCancel}
        />
      </DialogContent>
    </Dialog>
  );
}