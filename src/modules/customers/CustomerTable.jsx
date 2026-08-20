import {
  Eye,
  Pencil,
  Trash2,
  Mail,
  Phone,
  User,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

export default function CustomerTable({
  customers,
  onEdit,
  onDelete,
}) {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-xl shadow overflow-hidden">

      <table className="w-full">

        <thead className="bg-slate-100">

          <tr>

            <th className="p-3 text-left">
              Customer
            </th>

            <th className="p-3 text-left">
              Contact
            </th>

            <th className="p-3 text-left">
              Email
            </th>

            <th className="p-3 text-center">
              Status
            </th>

            <th className="p-3 text-center">
              Actions
            </th>

          </tr>

        </thead>

        <tbody>

          {customers.map((customer) => (

            <tr
              key={customer.id}
              className="border-b hover:bg-slate-50 transition"
            >

              <td className="p-3">

                <div className="flex items-center gap-3">

                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">

                    <User
                      className="text-blue-600"
                      size={18}
                    />

                  </div>

                  <div>

                    <p className="font-semibold">
                      {customer.name}
                    </p>

                    <p className="text-xs text-gray-500">
                      Customer
                    </p>

                  </div>

                </div>

              </td>

              <td className="p-3">

                <div className="flex items-center gap-2">

                  <Phone size={16} />

                  {customer.phone || "-"}

                </div>

              </td>

              <td className="p-3">

                <div className="flex items-center gap-2">

                  <Mail size={16} />

                  {customer.email || "-"}

                </div>

              </td>

              <td className="p-3 text-center">

                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    (customer.status || "Active") === "Active"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {customer.status || "Active"}
                </span>

              </td>

              <td className="p-3">

                <div className="flex justify-center gap-3">

                  <button
                    onClick={() =>
                      navigate(`/customers/${customer.id}`)
                    }
                    className="text-blue-600 hover:text-blue-800"
                    title="View"
                  >
                    <Eye size={18} />
                  </button>

                  <button
                    onClick={() => onEdit(customer)}
                    className="text-green-600 hover:text-green-800"
                    title="Edit"
                  >
                    <Pencil size={18} />
                  </button>

                  <button
                    onClick={() => onDelete(customer.id)}
                    className="text-red-600 hover:text-red-800"
                    title="Delete"
                  >
                    <Trash2 size={18} />
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