import React from 'react'
import Button from './Button'

const ExportButtons = ({ 
  onExportImage, 
  onExportPDF, 
  onExportExcel, 
  onPrint,
  showImage = true,
  showPDF = true,
  showExcel = true,
  showPrint = true,
  className = ''
}) => {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {showImage && onExportImage && (
        <Button variant="secondary" size="sm" onClick={onExportImage}>
          🖼️ Export Image
        </Button>
      )}
      {showPDF && onExportPDF && (
        <Button variant="secondary" size="sm" onClick={onExportPDF}>
          📄 Export PDF
        </Button>
      )}
      {showExcel && onExportExcel && (
        <Button variant="secondary" size="sm" onClick={onExportExcel}>
          📊 Export Excel
        </Button>
      )}
      {showPrint && onPrint && (
        <Button variant="secondary" size="sm" onClick={onPrint}>
          🖨️ Print
        </Button>
      )}
    </div>
  )
}

export default ExportButtons