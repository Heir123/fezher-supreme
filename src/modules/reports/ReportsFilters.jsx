import React, { useState } from "react";

export default function ReportsFilters() {

    const [period, setPeriod] = useState("month");

    const [reportType, setReportType] = useState("all");

    return (

        <div className="bg-white rounded-xl shadow p-6">

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

                <div>

                    <label className="block text-sm font-medium mb-2">

                        Report Type

                    </label>

                    <select
                        className="w-full border rounded-lg p-2"
                        value={reportType}
                        onChange={(e) =>
                            setReportType(e.target.value)
                        }
                    >

                        <option value="all">All Reports</option>
                        <option value="sales">Sales</option>
                        <option value="finance">Finance</option>
                        <option value="inventory">Inventory</option>
                        <option value="customers">Customers</option>
                        <option value="employees">Employees</option>

                    </select>

                </div>

                <div>

                    <label className="block text-sm font-medium mb-2">

                        Period

                    </label>

                    <select
                        className="w-full border rounded-lg p-2"
                        value={period}
                        onChange={(e) =>
                            setPeriod(e.target.value)
                        }
                    >

                        <option value="today">Today</option>
                        <option value="week">This Week</option>
                        <option value="month">This Month</option>
                        <option value="quarter">This Quarter</option>
                        <option value="year">This Year</option>

                    </select>

                </div>

                <div>

                    <label className="block text-sm font-medium mb-2">

                        From

                    </label>

                    <input
                        type="date"
                        className="w-full border rounded-lg p-2"
                    />

                </div>

                <div>

                    <label className="block text-sm font-medium mb-2">

                        To

                    </label>

                    <input
                        type="date"
                        className="w-full border rounded-lg p-2"
                    />

                </div>

            </div>

            <div className="mt-6 flex gap-3 flex-wrap">

                <button className="bg-blue-600 text-white px-5 py-2 rounded-lg">

                    Apply Filters

                </button>

                <button className="bg-gray-200 px-5 py-2 rounded-lg">

                    Reset

                </button>

            </div>

        </div>

    );

}