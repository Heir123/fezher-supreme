import React from "react";

export default function BusinessHealth({ score }) {

    if (!score) {
        return null;
    }

    return (

        <div className="bg-white rounded-xl shadow p-6">

            <h2 className="text-2xl font-bold mb-6">
                📊 Business Health
            </h2>

            <div className="mb-6">

                <div className="text-5xl font-bold text-green-600">
                    {score.overall}
                </div>

                <p className="text-gray-500">
                    Overall Business Score
                </p>

            </div>

            <div className="space-y-3">

                <Metric label="Sales" value={score.sales} />
                <Metric label="Finance" value={score.finance} />
                <Metric label="Inventory" value={score.inventory} />
                <Metric label="CRM" value={score.crm} />
                <Metric label="HR" value={score.hr} />

            </div>

        </div>

    );

}

function Metric({ label, value }) {

    return (

        <div>

            <div className="flex justify-between">
                <span>{label}</span>
                <span>{value}%</span>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-3 mt-1">

                <div
                    className="bg-green-500 h-3 rounded-full"
                    style={{ width: `${value}%` }}
                />

            </div>

        </div>

    );

}