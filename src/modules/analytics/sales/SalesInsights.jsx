import React from "react";

export default function SalesInsights({ insights }) {

    return (

        <div className="bg-white rounded-xl shadow p-5">

            <h2 className="text-xl font-semibold mb-4">

                🤖 AI Sales Insights

            </h2>

            <div className="space-y-3">

                {insights.map((item, index) => (

                    <div
                        key={index}
                        className="border rounded-lg p-3"
                    >

                        <h4 className="font-semibold">

                            {item.title}

                        </h4>

                        <p className="text-sm text-gray-600">

                            {item.message}

                        </p>

                    </div>

                ))}

            </div>

        </div>

    );

}