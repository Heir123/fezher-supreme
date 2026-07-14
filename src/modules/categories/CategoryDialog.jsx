import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import CategoryForm from "./CategoryForm";

export default function CategoryDialog({
  open,
  onOpenChange,
  editingCategory,
  onSave,
  onCancel,
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {editingCategory
              ? "Edit Category"
              : "New Category"}
          </DialogTitle>
        </DialogHeader>

        <CategoryForm
          editingCategory={editingCategory}
          onSave={onSave}
          onCancel={onCancel}
        />
      </DialogContent>
    </Dialog>
  );
}