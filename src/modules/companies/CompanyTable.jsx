export default function CompanyTable({
  companies,
  onEdit,
  onDelete,
}) {
  if (!companies.length) {
    return (
      <div className="text-center py-10 text-gray-500">
        No companies found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border">

      <table className="min-w-full">

        <thead className="bg-gray-100">

          <tr>
            <th className="text-left p-3">Company</th>
            <th className="text-left p-3">Email</th>
            <th className="text-left p-3">Phone</th>
            <th className="text-left p-3">Address</th>
            <th className="text-center p-3">Actions</th>
          </tr>

        </thead>

        <tbody>

          {companies.map((company) => (

            <tr
              key={company.id}
              className="border-t hover:bg-gray-50"
            >
              <td className="p-3 font-medium">
                {company.name}
              </td>

              <td className="p-3">
                {company.email || "-"}
              </td>

              <td className="p-3">
                {company.phone || "-"}
              </td>

              <td className="p-3">
                {company.address || "-"}
              </td>

              <td className="p-3">

                <div className="flex justify-center gap-2">

                  <button
                    onClick={() => onEdit(company)}
                    className="px-3 py-1 rounded bg-yellow-500 text-white"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => onDelete(company.id)}
                    className="px-3 py-1 rounded bg-red-600 text-white"
                  >
                    Delete
                  </button>

                </div>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}