import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";

import ProductTable from "./ProductTable";
import ProductDialog from "./ProductDialog";
import ProductStats from "./ProductStats";

import { getProducts } from "@/services/productService";;

import {
  getCompanies,
  addCompany,
  updateCompany,
  deleteCompany,
} from "@/services/companyService";

export default function CompanyManagement() {
  const [companies, setCompanies] = useState([]);
  const [search, setSearch] = useState("");
const [loading, setLoading] = useState(true);
  const [editingCompany, setEditingCompany] = useState(null);
const [dialogOpen, setDialogOpen] = useState(false);
const [confirmOpen, setConfirmOpen] = useState(false);
const [companyToDelete, setCompanyToDelete] = useState(null);
  useEffect(() => {
    loadCompanies();
  }, []);

  async function loadCompanies() {
  try {
    setLoading(true);

    const data = await getCompanies();

    setCompanies(data || []);
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
}

  async function handleSave(company) {
    try {
      if (editingCompany) {
        await updateCompany(editingCompany.id, company);
      } else {
        await addCompany(company);
      }
toast.success(
  editingCompany
    ? "Company updated successfully."
    : "Company created successfully."
);
      setEditingCompany(null);
      setDialogOpen(false);
      await loadCompanies();
    } catch (error) {
      console.error(error);
     toast.error("Failed to save company.");
    }
  }

  async function handleDelete(id) {
  setCompanyToDelete(id);
  setConfirmOpen(true);
}
async function confirmDelete() {
  if (!companyToDelete) return;

  try {
    await deleteCompany(companyToDelete);

    setConfirmOpen(false);
    setCompanyToDelete(null);

    await loadCompanies();
    toast.success("Company deleted successfully.");
  } catch (error) {
    console.error(error);
    toast.error("Failed to delete company.");
  }
}
  function handleEdit(company) {
  setEditingCompany(company);
  setDialogOpen(true);
}

 function handleCancel() {
  setEditingCompany(null);
  setDialogOpen(false);
}
const filteredCompanies = useMemo(() => {
  return companies.filter((company) =>
    company.name.toLowerCase().includes(search.toLowerCase())
  );
}, [companies, search]);
  return (
  <div className="space-y-6">
    <PageHeader
  title="Company Management"
  description="Manage all companies in the system."
  buttonText="+ New Company"
  onButtonClick={() => {
    setEditingCompany(null);
    setDialogOpen(true);
  }}
/>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <StatsCard
        title="Total Companies"
        value={companies.length}
        description="Registered companies"
      />
    </div>

    <Toolbar>
      <SearchBar
        value={search}
        onChange={setSearch}
        placeholder="Search companies..."
      />
    </Toolbar>
 <CompanyDialog
  open={dialogOpen}
  onOpenChange={setDialogOpen}
  onSave={handleSave}
  editingCompany={editingCompany}
  onCancel={handleCancel}
/>
<ConfirmDialog
  open={confirmOpen}
  onOpenChange={setConfirmOpen}
  title="Delete Company"
  description="Are you sure you want to delete this company? This action cannot be undone."
  onConfirm={confirmDelete}
/>
    {loading ? (
      <LoadingSpinner text="Loading companies..." />
    ) : filteredCompanies.length === 0 ? (
      <EmptyState
        title="No Companies Found"
        description="Click 'Add Company' to create your first company."
      />
    ) : (
      <>
       

        <CompanyTable
          companies={filteredCompanies}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </>
    )}
  </div>
);
}