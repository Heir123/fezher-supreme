import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import CustomerForm from "./CustomerForm";

export default function CustomerDialog({
  open,
  onOpenChange,
  onSave,
  editingCustomer,
  onCancel,
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>
            {editingCustomer
              ? "Edit Customer"
              : "New Customer"}
          </DialogTitle>
        </DialogHeader>

        <CustomerForm
          onSave={onSave}
          editingCustomer={editingCustomer}
          onCancel={onCancel}
        />
      </DialogContent>
    </Dialog>
  );
}