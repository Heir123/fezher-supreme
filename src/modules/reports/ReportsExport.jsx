import React from "react";

import {

    FileSpreadsheet,

    FileText,

    Printer,

    Download

} from "lucide-react";

import { exportExecutivePDF }

from "@/services/export/pdfExportService";


export default function ReportsExport({ dashboard }) {

    function exportPDF() {

    exportExecutivePDF(dashboard);

}

    function exportExcel() {

        alert("Excel Export will be connected in Phase E.2");

    }

    function exportCSV() {

        alert("CSV Export will be connected in Phase E.2");

    }

    function printReport() {

        window.print();

    }

    return (

        <div className="bg-white rounded-xl shadow p-6">

            <h2 className="text-xl font-bold mb-5">

                Export Reports

            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

                <button

                    onClick={exportPDF}

                    className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white rounded-lg p-4 transition"

                >

                    <FileText size={20} />

                    PDF

                </button>

                <button

                    onClick={exportExcel}

                    className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white rounded-lg p-4 transition"

                >

                    <FileSpreadsheet size={20} />

                    Excel

                </button>

                <button

                    onClick={exportCSV}

                    className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg p-4 transition"

                >

                    <Download size={20} />

                    CSV

                </button>

                <button

                    onClick={printReport}

                    className="flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-800 text-white rounded-lg p-4 transition"

                >

                    <Printer size={20} />

                    Print

                </button>

            </div>

        </div>

    );

}