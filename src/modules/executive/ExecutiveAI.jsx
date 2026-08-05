import React from "react";

export default function ExecutiveAI({ report }) {

    return (

        <div className="bg-white rounded-xl shadow p-6">

            <h2 className="text-2xl font-bold mb-5">

                🤖 Executive AI Assistant

            </h2>

            <div className="space-y-4">

                {report.map((item, index) => (

                    <div
                        key={index}
                        className="border rounded-lg p-4"
                    >

                        <h4 className="font-semibold">

                            {item.title}

                        </h4>

                        <p className="text-gray-600">

                            {item.message}

                        </p>

                    </div>

                ))}

            </div>

        </div>

    );

}