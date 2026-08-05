import React from "react";

export default function ReportsTable({ dashboard }) {

    const rows = [

        {
            module: "Sales",
            value: dashboard?.sales?.total_sales ?? 0,
            description: "Total Sales"
        },

        {
            module: "Revenue",
            value: `R ${dashboard?.finance?.revenue ?? 0}`,
            description: "Revenue"
        },

        {
            module: "Expenses",
            value: `R ${dashboard?.finance?.expenses ?? 0}`,
            description: "Expenses"
        },

        {
            module: "Profit",
            value: `R ${dashboard?.finance?.profit ?? 0}`,
            description: "Net Profit"
        },

        {
            module: "Products",
            value: dashboard?.inventory?.total_products ?? 0,
            description: "Inventory Products"
        },

        {
            module: "Customers",
            value: dashboard?.customers?.total_customers ?? 0,
            description: "Registered Customers"
        },

        {
            module: "Employees",
            value: dashboard?.employees?.total_employees ?? 0,
            description: "Employees"
        }

    ];

    return (

        <div className="bg-white rounded-xl shadow p-6">

            <h2 className="text-xl font-semibold mb-5">

                Business Report Summary

            </h2>

            <table className="w-full border-collapse">

                <thead>

                    <tr className="border-b">

                        <th className="text-left py-3">Module</th>

                        <th className="text-left py-3">Value</th>

                        <th className="text-left py-3">Description</th>

                    </tr>

                </thead>

                <tbody>

                    {rows.map((row, index) => (

                        <tr
                            key={index}
                            className="border-b hover:bg-gray-50"
                        >

                            <td className="py-3">

                                {row.module}

                            </td>

                            <td className="py-3 font-semibold">

                                {row.value}

                            </td>

                            <td className="py-3 text-gray-500">

                                {row.description}

                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>

    );

}