import React from "react";

export default function ExecutiveAIInsights({

    narrative,

    recommendations,

    forecast

}) {

    return (

        <div className="bg-white rounded-xl shadow p-6 space-y-8">

            <div>

                <h2 className="text-xl font-bold mb-4">

                    AI Executive Summary

                </h2>

                <div className="space-y-3">

                    {narrative.map((item, index) => (

                        <div
                            key={index}
                            className="p-3 rounded-lg bg-blue-50 border-l-4 border-blue-600"
                        >

                            {item}

                        </div>

                    ))}

                </div>

            </div>

            <div>

                <h2 className="text-xl font-bold mb-4">

                    AI Recommendations

                </h2>

                <div className="space-y-3">

                    {recommendations.map((item, index) => (

                        <div
                            key={index}
                            className="p-3 rounded-lg bg-green-50 border-l-4 border-green-600"
                        >

                            {item}

                        </div>

                    ))}

                </div>

            </div>

            <div>

                <h2 className="text-xl font-bold mb-4">

                    Revenue Forecast

                </h2>

                <div className="rounded-lg bg-yellow-50 border-l-4 border-yellow-500 p-4">

                    <div className="font-semibold">

                        Projected Revenue

                    </div>

                    <div className="text-2xl font-bold mt-2">

                        R {forecast.projectedRevenue.toFixed(2)}

                    </div>

                    <div className="mt-2 text-gray-600">

                        {forecast.message}

                    </div>

                </div>

            </div>

        </div>

    );

}