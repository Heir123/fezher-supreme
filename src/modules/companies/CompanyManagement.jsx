import { useEffect, useState } from "react";

import CompanyDialog from "./CompanyDialog";
import CompanyTable from "./CompanyTable";

import {
  getCompanies,
  addCompany,
  updateCompany,
  deleteCompany,
} from "../../services/companyService";

export default function CompanyManagement() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);

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
      alert("Failed to load companies.");
    } finally {
      setLoading(false);
    }
  }

  function handleAdd() {
    setSelectedCompany(null);
    setDialogOpen(true);
  }

  function handleEdit(company) {
    setSelectedCompany(company);
    setDialogOpen(true);
  }

  async function handleSave(company) {
    if (selectedCompany) {
      await updateCompany(selectedCompany.id, company);
    } else {
      await addCompany(company);
    }

    await loadCompanies();
  }

  async function handleDelete(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this company?"
    );

    if (!confirmed) return;

    try {
      await deleteCompany(id);
      await loadCompanies();
    } catch (error) {
      console.error(error);
      alert("Failed to delete company.");
    }
  }

  return (
    <div className="p-6">

      <div className="flex justify-between items-center mb-6">

        <div>
          <h1 className="text-3xl font-bold">
            Company Management
          </h1>

          <p className="text-gray-500">
            Manage your companies.
          </p>
        </div>

        <button
          onClick={handleAdd}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg"
        >
          + New Company
        </button>

      </div>

      {loading ? (
        <div className="text-center py-10">
          Loading companies...
        </div>
      ) : (
        <CompanyTable
          companies={companies}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      <CompanyDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSave={handleSave}
        initialData={selectedCompany}
      />

    </div>
  );
}