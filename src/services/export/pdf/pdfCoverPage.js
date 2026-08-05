export function drawPDFCoverPage(doc) {

    doc.setFontSize(26);

    doc.text(
        "FEZHER SUPREME ERP",
        105,
        55,
        { align: "center" }
    );

    doc.setFontSize(18);

    doc.text(
        "Executive Business Report",
        105,
        70,
        { align: "center" }
    );

    doc.setFontSize(12);

    doc.text(
        `Generated on ${new Date().toLocaleString()}`,
        105,
        85,
        { align: "center" }
    );

}