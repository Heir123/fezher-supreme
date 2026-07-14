import { Button } from "@/components/ui/button";

export default function CompanyTable({
  companies,
  onEdit,
  onDelete,
}) {
  if (companies.length === 0) {
    return (
      <div className="text-center py-10">
        No companies found.
      </div>
    );
  }

  return (
    <table className="w-full border rounded-lg overflow-hidden">
      <thead className="bg-gray-100">
        <tr>
          <th className="text-left p-3">Name</th>
          <th className="text-left p-3">Email</th>
          <th className="text-left p-3">Phone</th>
          <th className="text-left p-3">Address</th>
          <th className="text-center p-3">Actions</th>
        </tr>
      </thead>

      <tbody>
        {companies.map((company) => (
          <tr key={company.id} className="border-t">
            <td className="p-3">{company.name}</td>
            <td className="p-3">{company.email}</td>
            <td className="p-3">{company.phone}</td>
            <td className="p-3">{company.address}</td>

            <td className="p-3 flex gap-2 justify-center">
              <Button
                variant="outline"
                onClick={() => onEdit(company)}
              >
                Edit
              </Button>

              <Button
                variant="destructive"
                onClick={() => onDelete(company.id)}
              >
                Delete
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}