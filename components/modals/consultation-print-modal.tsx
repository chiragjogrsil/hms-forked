"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Printer, Download, X } from "lucide-react"
import { ConsultationPrintPreview } from "@/components/consultation-print-preview"
import { toast } from "sonner"

interface ConsultationPrintModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  patientData: any
  consultationData: any
  department: string
}

export function ConsultationPrintModal({
  open,
  onOpenChange,
  patientData,
  consultationData,
  department,
}: ConsultationPrintModalProps) {
  const [isPrinting, setIsPrinting] = useState(false)

  const handlePrint = async () => {
    setIsPrinting(true)

    try {
      // Create a new window for printing
      const printWindow = window.open("", "_blank")
      if (!printWindow) {
        toast.error("Please allow popups to print the consultation")
        return
      }

      // Get the print content
      const printContent = document.getElementById("consultation-print-content")
      if (!printContent) {
        toast.error("Print content not found")
        return
      }

      // Write the HTML content to the new window
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Consultation Report - ${patientData?.name || "Patient"}</title>
            <style>
              * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
              }
              
              body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                background: white;
              }
              
              .print-container {
                max-width: 210mm;
                margin: 0 auto;
                padding: 20mm;
                background: white;
              }
              
              h1, h2, h3 {
                color: #2c3e50;
                margin-bottom: 0.5em;
              }
              
              h1 {
                font-size: 24px;
                text-align: center;
                border-bottom: 2px solid #3498db;
                padding-bottom: 10px;
                margin-bottom: 20px;
              }
              
              h2 {
                font-size: 20px;
                margin-top: 20px;
              }
              
              h3 {
                font-size: 16px;
                margin-top: 15px;
                border-bottom: 1px solid #bdc3c7;
                padding-bottom: 5px;
              }
              
              table {
                width: 100%;
                border-collapse: collapse;
                margin: 10px 0;
                font-size: 12px;
              }
              
              th, td {
                border: 1px solid #ddd;
                padding: 8px;
                text-align: left;
                vertical-align: top;
              }
              
              th {
                background-color: #f8f9fa;
                font-weight: bold;
              }
              
              .grid {
                display: grid;
                gap: 15px;
                margin: 10px 0;
              }
              
              .grid-2 {
                grid-template-columns: 1fr 1fr;
              }
              
              .grid-4 {
                grid-template-columns: repeat(4, 1fr);
              }
              
              .info-item {
                margin-bottom: 10px;
              }
              
              .info-label {
                font-size: 12px;
                color: #666;
                font-weight: 500;
              }
              
              .info-value {
                font-weight: 600;
                color: #333;
              }
              
              .signature-section {
                margin-top: 40px;
                padding-top: 20px;
                border-top: 2px solid #ddd;
                display: flex;
                justify-content: space-between;
                align-items: end;
              }
              
              .signature-line {
                border-bottom: 2px solid #333;
                width: 200px;
                margin-top: 30px;
              }
              
              .footer-note {
                text-align: center;
                font-size: 10px;
                color: #666;
                margin-top: 20px;
                font-style: italic;
              }
              
              .allergy-warning {
                background-color: #fff5f5;
                border: 2px solid #fed7d7;
                border-radius: 8px;
                padding: 15px;
                margin: 15px 0;
              }
              
              .allergy-title {
                color: #c53030;
                font-weight: bold;
                margin-bottom: 10px;
              }
              
              .allergy-item {
                background-color: #fed7d7;
                color: #c53030;
                padding: 4px 12px;
                border-radius: 20px;
                display: inline-block;
                margin: 2px;
                font-size: 12px;
                font-weight: 500;
              }
              
              @media print {
                body {
                  -webkit-print-color-adjust: exact;
                  print-color-adjust: exact;
                }
                
                .print-container {
                  padding: 15mm;
                  max-width: none;
                }
                
                h1 {
                  font-size: 22px;
                }
                
                h2 {
                  font-size: 18px;
                }
                
                h3 {
                  font-size: 14px;
                }
                
                table {
                  font-size: 11px;
                }
                
                th, td {
                  padding: 6px;
                }
                
                .grid-4 {
                  grid-template-columns: repeat(2, 1fr);
                }
                
                .page-break {
                  page-break-before: always;
                }
              }
            </style>
          </head>
          <body>
            <div class="print-container">
              ${printContent.innerHTML}
            </div>
          </body>
        </html>
      `)

      printWindow.document.close()

      // Wait for content to load then print
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print()
          printWindow.close()
          toast.success("Consultation report sent to printer")
        }, 500)
      }
    } catch (error) {
      console.error("Print error:", error)
      toast.error("Failed to print consultation report")
    } finally {
      setIsPrinting(false)
    }
  }

  const handleDownloadPDF = () => {
    toast.info("PDF download feature coming soon")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <Printer className="h-5 w-5" />
              Print Consultation Report
            </DialogTitle>
            <div className="flex gap-2">
              <Button
                onClick={handleDownloadPDF}
                variant="outline"
                size="sm"
                className="flex items-center gap-2 bg-transparent"
              >
                <Download className="h-4 w-4" />
                Download PDF
              </Button>
              <Button
                onClick={handlePrint}
                disabled={isPrinting}
                size="sm"
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
              >
                <Printer className="h-4 w-4" />
                {isPrinting ? "Printing..." : "Print"}
              </Button>
              <Button onClick={() => onOpenChange(false)} variant="ghost" size="sm">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-auto bg-gray-100 p-4 rounded-lg">
          <div id="consultation-print-content" className="bg-white shadow-lg">
            <ConsultationPrintPreview
              patientData={patientData}
              consultationData={consultationData}
              department={department}
            />
          </div>
        </div>

        <div className="flex-shrink-0 pt-4 border-t">
          <div className="flex justify-between items-center text-sm text-gray-600">
            <p>Preview your consultation report before printing</p>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={handlePrint} disabled={isPrinting} className="bg-blue-600 hover:bg-blue-700">
                <Printer className="h-4 w-4 mr-2" />
                {isPrinting ? "Printing..." : "Print Report"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
