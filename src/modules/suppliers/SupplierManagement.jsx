import { useEffect, useMemo, useState } from "react";

import SupplierDialog from "./SupplierDialog";
import SupplierTable from "./SupplierTable";

import PageHeader from "@/components/common/PageHeader";
import StatsCard from "@/components/common/StatsCard";
import SearchBar from "@/components/common/SearchBar";
import Toolbar from "@/components/common/Toolbar";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import EmptyState from "@/components/common/EmptyState";
import ConfirmDialog from "@/components/common/ConfirmDialog";

import { toast } from "sonner";

import {
  getSuppliers,
  addSupplier,
  updateSupplier,
  deleteSupplier,
} from "@/services/supplierService";

export default function SupplierManagement() {
  const [suppliers, setSuppliers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [editingSupplier, setEditingSupplier] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [supplierToDelete, setSupplierToDelete] = useState(null);

  useEffect(() => {
    loadSuppliers();
  }, []);

  async function loadSuppliers() {
    try {
      setLoading(true);

      const data = await getSuppliers();

      setSuppliers(data || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load suppliers.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(supplier) {
    try {
      if (editingSupplier) {
        await updateSupplier(editingSupplier.id, supplier);

        toast.success("Supplier updated successfully.");
      } else {
        await addSupplier(supplier);

        toast.success("Supplier created successfully.");
      }

      setEditingSupplier(null);
      setDialogOpen(false);

      await loadSuppliers();
    } catch (error) {
      console.error(error);
      toast.error("Failed to save supplier.");
    }
  }

  function handleEdit(supplier) {
    setEditingSupplier(supplier);
    setDialogOpen(true);
  }

  function handleDelete(id) {
    setSupplierToDelete(id);
    setConfirmOpen(true);
  }

  async function confirmDelete() {
  if (!supplierToDelete) return;

  try {
    await deleteSupplier(supplierToDelete);

    toast.success("Supplier deleted successfully.");

    setSupplierToDelete(null);
    setConfirmOpen(false);

    await loadSuppliers();

  } catch (error) {

    if (
      error.message?.includes("purchases_supplier_id_fkey") ||
      error.code === "23503"
    ) {
      toast.error(
        "This supplier cannot be deleted because it has purchase history."
      );
    } else {
      toast.error("Failed to delete supplier.");
    }

    console.error(error);
  }
}

  function handleCancel() {
    setEditingSupplier(null);
    setDialogOpen(false);
  }

  const filteredSuppliers = useMemo(() => {
    return suppliers.filter((supplier) =>
      supplier.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [suppliers, search]);

  return (
    <div className="space-y-6">
      <PageHeader
  title="Supplier Management"
  description="Manage suppliers, purchases and supplier information."
  buttonText="+ New Supplier"
  onButtonClick={() => {
    setEditingSupplier(null);
    setDialogOpen(true);
  }}
/>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

  <StatsCard
    title="Total Suppliers"
    value={suppliers.length}
    description="Registered suppliers"
    color="blue"
    icon="🏢"
  />

  <StatsCard
    title="Active"
    value={suppliers.filter(s => s.status === "Active").length}
    description="Currently active"
    color="green"
    icon="🟢"
  />

  <StatsCard
    title="Inactive"
    value={suppliers.filter(s => s.status === "Inactive").length}
    description="Disabled suppliers"
    color="red"
    icon="🔴"
  />

  <StatsCard
    title="Total Purchases"
    value={`R ${suppliers.reduce((sum, s) => sum + (Number(s.total_purchases || 0)), 0).toLocaleString()}`}
    description="Supplier purchases"
    color="purple"
    icon="💰"
  />

</div>
      <Toolbar>

  <SearchBar
    value={search}
    onChange={setSearch}
    placeholder="Search supplier, phone or email..."
  />

  <button className="px-4 py-2 rounded-lg border">
    Export
  </button>

</Toolbar>

      <SupplierDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={handleSave}
        editingSupplier={editingSupplier}
        onCancel={handleCancel}
      />

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Delete Supplier"
        description="Are you sure you want to delete this supplier? This action cannot be undone."
        onConfirm={confirmDelete}
      />

      {loading ? (
        <LoadingSpinner text="Loading suppliers..." />
      ) : filteredSuppliers.length === 0 ? (
        <EmptyState
          title="No Suppliers Found"
          description="Click 'New Supplier' to create your first supplier."
        />
      ) : (
        <SupplierTable
          suppliers={filteredSuppliers}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}