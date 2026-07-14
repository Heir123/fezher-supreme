import { useEffect, useMemo, useState } from "react";

import CategoryDialog from "./CategoryDialog";
import CategoryTable from "./CategoryTable";

import PageHeader from "@/components/common/PageHeader";
import StatsCard from "@/components/common/StatsCard";
import SearchBar from "@/components/common/SearchBar";
import Toolbar from "@/components/common/Toolbar";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import EmptyState from "@/components/common/EmptyState";
import ConfirmDialog from "@/components/common/ConfirmDialog";

import { toast } from "sonner";

import {
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory,
} from "@/services/categoryService";

export default function CategoryManagement() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    try {
      setLoading(true);

      const data = await getCategories();

      setCategories(data || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load categories.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(category) {
    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, category);

        toast.success("Category updated successfully.");
      } else {
        await addCategory(category);

        toast.success("Category created successfully.");
      }

      setDialogOpen(false);
      setEditingCategory(null);

      await loadCategories();
    } catch (error) {
      console.error(error);
      toast.error("Failed to save category.");
    }
  }

  function handleEdit(category) {
    setEditingCategory(category);
    setDialogOpen(true);
  }

  function handleDelete(id) {
    setCategoryToDelete(id);
    setConfirmOpen(true);
  }

  async function confirmDelete() {
    try {
      await deleteCategory(categoryToDelete);

      toast.success("Category deleted successfully.");

      setConfirmOpen(false);
      setCategoryToDelete(null);

      await loadCategories();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete category.");
    }
  }

  function handleCancel() {
    setEditingCategory(null);
    setDialogOpen(false);
  }

  const filteredCategories = useMemo(() => {
    return categories.filter((category) =>
      category.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [categories, search]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Category Management"
        description="Manage all categories in the system."
        buttonText="+ New Category"
        onButtonClick={() => {
          setEditingCategory(null);
          setDialogOpen(true);
        }}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatsCard
          title="Total Categories"
          value={categories.length}
          description="Registered categories"
        />
      </div>

      <Toolbar>
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search categories..."
        />
      </Toolbar>

      <CategoryDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        editingCategory={editingCategory}
        onSave={handleSave}
        onCancel={handleCancel}
      />

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Delete Category"
        description="Are you sure you want to delete this category? This action cannot be undone."
        onConfirm={confirmDelete}
      />

      {loading ? (
        <LoadingSpinner text="Loading categories..." />
      ) : filteredCategories.length === 0 ? (
        <EmptyState
          title="No Categories Found"
          description="Click 'New Category' to create your first category."
        />
      ) : (
        <CategoryTable
          categories={filteredCategories}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}