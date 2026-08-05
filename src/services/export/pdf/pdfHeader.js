export function drawPDFHeader(doc, companyName = "Fezher Supreme ERP") {

    doc.setFillColor(26, 32, 44);

    doc.rect(0, 0, 210, 18, "F");

    doc.setTextColor(255);

    doc.setFontSize(16);

    doc.text(companyName, 14, 12);

}