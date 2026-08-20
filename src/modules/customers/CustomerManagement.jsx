import { useEffect, useMemo, useState } from "react";

import CustomerDialog from "./CustomerDialog";
import CustomerTable from "./CustomerTable";

import PageHeader from "@/components/common/PageHeader";
import StatsCard from "@/components/common/StatsCard";
import SearchBar from "@/components/common/SearchBar";
import Toolbar from "@/components/common/Toolbar";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import EmptyState from "@/components/common/EmptyState";
import ConfirmDialog from "@/components/common/ConfirmDialog";

import { toast } from "sonner";

import {
  getCustomers,
  addCustomer,
  updateCustomer,
  deleteCustomer,
} from "@/services/customerService";

export default function CustomerManagement() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [editingCustomer, setEditingCustomer] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);

  useEffect(() => {
    loadCustomers();
  }, []);

  async function loadCustomers() {
    try {
      setLoading(true);

      const data = await getCustomers();

      setCustomers(data || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load customers.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(customer) {
    try {
      if (editingCustomer) {
        await updateCustomer(editingCustomer.id, customer);
        toast.success("Customer updated successfully.");
      } else {
        await addCustomer(customer);
        toast.success("Customer created successfully.");
      }

      setEditingCustomer(null);
      setDialogOpen(false);

      await loadCustomers();
    } catch (error) {
      console.error(error);
      toast.error("Failed to save customer.");
    }
  }

  function handleEdit(customer) {
    setEditingCustomer(customer);
    setDialogOpen(true);
  }

  function handleDelete(id) {
    setCustomerToDelete(id);
    setConfirmOpen(true);
  }

  async function confirmDelete() {
    if (!customerToDelete) return;

    try {
      await deleteCustomer(customerToDelete);

      toast.success("Customer deleted successfully.");

      setCustomerToDelete(null);
      setConfirmOpen(false);

      await loadCustomers();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete customer.");
    }
  }

  function handleCancel() {
    setEditingCustomer(null);
    setDialogOpen(false);
  }

  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) =>
      customer.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [customers, search]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Customer Management"
        description="Manage all customers in the system."
        buttonText="+ New Customer"
        onButtonClick={() => {
          setEditingCustomer(null);
          setDialogOpen(true);
        }}
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

  <StatsCard
    title="Total Customers"
    value={customers.length}
    description="Registered customers"
  />

  <StatsCard
    title="Active Customers"
    value={
      customers.filter(
        (c) => (c.status || "Active") === "Active"
      ).length
    }
    description="Currently active"
  />

  <StatsCard
    title="New This Month"
    value={
      customers.filter((c) => {
        if (!c.created_at) return false;

        const created = new Date(c.created_at);
        const today = new Date();

        return (
          created.getMonth() === today.getMonth() &&
          created.getFullYear() === today.getFullYear()
        );
      }).length
    }
    description="New registrations"
  />

  <StatsCard
    title="Lifetime Sales"
    value="R 0.00"
    description="CRM Analytics"
  />

</div>

     <Toolbar>

  <SearchBar
    value={search}
    onChange={setSearch}
    placeholder="Search customer name, phone or email..."
  />

</Toolbar>

      <CustomerDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={handleSave}
        editingCustomer={editingCustomer}
        onCancel={handleCancel}
      />

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Delete Customer"
        description="Are you sure you want to delete this customer? This action cannot be undone."
        onConfirm={confirmDelete}
      />

      {loading ? (
        <LoadingSpinner text="Loading customers..." />
      ) : filteredCustomers.length === 0 ? (
        <EmptyState
          title="No Customers Found"
          description="Click 'New Customer' to create your first customer."
        />
      ) : (
        <CustomerTable
          customers={filteredCustomers}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}