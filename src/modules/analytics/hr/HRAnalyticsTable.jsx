export default function HRAnalyticsTable({ dashboard }) {

  const employees =
    dashboard?.employees || [];

  return (

    <div className="bg-white rounded-xl shadow p-6">

      <h2 className="text-lg font-semibold mb-4">

        Employees

      </h2>

      <div className="overflow-x-auto">

        <table className="w-full">

          <thead>

            <tr className="border-b">

              <th className="text-left py-3">
                Employee
              </th>

              <th className="text-left py-3">
                Department
              </th>

              <th className="text-left py-3">
                Position
              </th>

              <th className="text-left py-3">
                Status
              </th>

            </tr>

          </thead>

          <tbody>

            {employees.map((emp) => (

              <tr
                key={emp.id}
                className="border-b"
              >

                <td className="py-3">

                  {emp.full_name}

                </td>

                <td className="py-3">

                  {emp.department}

                </td>

                <td className="py-3">

                  {emp.position}

                </td>

                <td className="py-3">

                  {emp.status}

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>

  );

}