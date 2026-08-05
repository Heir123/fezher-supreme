import React from "react";
import {
    DollarSign,
    TrendingUp,
    Package,
    Users,
    Briefcase,
    BarChart3
} from "lucide-react";

function ReportCard({ title, value, icon, color }) {

    return (

        <div className="bg-white rounded-xl shadow p-5 border">

            <div className="flex justify-between items-center">

                <div>

                    <p className="text-gray-500 text-sm">

                        {title}

                    </p>

                    <h2 className="text-2xl font-bold mt-2">

                        {value}

                    </h2>

                </div>

                <div
                    className={`p-3 rounded-full ${color}`}
                >

                    {icon}

                </div>

            </div>

        </div>

    );

}

export default function ReportsCards({ dashboard }) {

    return (

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

            <ReportCard

                title="Revenue"

                value={`R ${dashboard.finance?.revenue ?? 0}`}

                color="bg-green-100"

                icon={<DollarSign className="text-green-600" />}

            />

            <ReportCard

                title="Profit"

                value={`R ${dashboard.finance?.profit ?? 0}`}

                color="bg-blue-100"

                icon={<TrendingUp className="text-blue-600" />}

            />

            <ReportCard

                title="Inventory Value"

                value={`R ${dashboard.inventory?.inventory_retail_value ?? 0}`}

                color="bg-orange-100"

                icon={<Package className="text-orange-600" />}

            />

            <ReportCard

                title="Customers"

                value={dashboard.customers?.total_customers ?? 0}

                color="bg-purple-100"

                icon={<Users className="text-purple-600" />}

            />

            <ReportCard

                title="Employees"

                value={dashboard.employees?.total_employees ?? 0}

                color="bg-pink-100"

                icon={<Briefcase className="text-pink-600" />}

            />

            <ReportCard

                title="Sales"

                value={dashboard.sales?.total_sales ?? 0}

                color="bg-cyan-100"

                icon={<BarChart3 className="text-cyan-600" />}

            />

        </div>

    );

}