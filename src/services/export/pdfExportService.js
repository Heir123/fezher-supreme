import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import { drawPDFHeader } from "./pdf/pdfHeader";
import { drawPDFFooter } from "./pdf/pdfFooter";
import { drawPDFCoverPage } from "./pdf/pdfCoverPage";

export function exportExecutivePDF(dashboard) {

    const doc = new jsPDF();

    drawPDFHeader(doc);

    drawPDFCoverPage(doc);

    autoTable(doc, {

        startY: 100,

        head: [["Metric", "Value"]],

        body: [

            ["Revenue", `R ${dashboard.finance?.revenue ?? 0}`],

            ["Expenses", `R ${dashboard.finance?.expenses ?? 0}`],

            ["Profit", `R ${dashboard.finance?.profit ?? 0}`],

            ["Sales", dashboard.sales?.total_sales ?? 0],

            ["Products", dashboard.inventory?.total_products ?? 0],

            ["Customers", dashboard.customers?.total_customers ?? 0],

            ["Employees", dashboard.employees?.total_employees ?? 0]

        ]

    });

    drawPDFFooter(doc, 1);

    doc.save("Executive_Report.pdf");

}