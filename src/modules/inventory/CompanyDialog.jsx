import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import CompanyForm from "./CompanyForm";

export default function CompanyDialog({
  open,
  onOpenChange,
  onSave,
  editingCompany,
  onCancel,
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>
            {editingCompany ? "Edit Company" : "New Company"}
          </DialogTitle>
        </DialogHeader>

        <CompanyForm
          onSave={onSave}
          editingCompany={editingCompany}
          onCancel={onCancel}
        />
      </DialogContent>
    </Dialog>
  );
}