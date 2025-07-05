"use client"

import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { Printer, Download } from "lucide-react"

interface TokenReceiptProps {
  patientData: {
    id: string
    name: string
    tokenNumber: string
    registrationTime: Date
    urgency: string
    reason: string
    careOf?: string
    gender: string
    mobileNumber: string
  }
  onClose: () => void
}

export function TokenReceipt({ patientData, onClose }: TokenReceiptProps) {
  const handlePrint = () => {
    window.print()
  }

  const handleDownload = () => {
    // In a real app, this would generate a PDF
    alert("In a production app, this would download a PDF of the receipt")
  }

  return (
    <div className="p-4 max-w-md mx-auto bg-white rounded-lg" id="token-receipt">
      <div className="space-y-4">
        <div className="text-center">
          <h2 className="text-xl font-bold">Patient Registration Receipt</h2>
          <p className="text-sm text-muted-foreground">
            {format(patientData.registrationTime, "PPP")} at {format(patientData.registrationTime, "p")}
          </p>
        </div>

        <div className="rounded-lg border p-4">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Token Number</p>
              <p className="text-2xl font-bold">{patientData.tokenNumber}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Patient ID</p>
              <p className="font-medium">{patientData.id}</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium">{patientData.name}</p>
              </div>
              {patientData.careOf && (
                <div>
                  <p className="text-sm text-muted-foreground">C/O</p>
                  <p className="font-medium">{patientData.careOf}</p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-sm text-muted-foreground">Gender</p>
                <p className="font-medium">
                  {patientData.gender === "male" ? "Male" : patientData.gender === "female" ? "Female" : "Other"}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Mobile</p>
                <p className="font-medium">{patientData.mobileNumber}</p>
              </div>
            </div>

            {patientData.reason && (
              <div>
                <p className="text-sm text-muted-foreground">Reason for Visit</p>
                <p className="font-medium">{patientData.reason}</p>
              </div>
            )}

            {patientData.urgency && (
              <div>
                <p className="text-sm text-muted-foreground">Urgency</p>
                <p className="font-medium capitalize">{patientData.urgency}</p>
              </div>
            )}
          </div>
        </div>

        <div className="text-center text-sm text-muted-foreground">
          <p>Please keep this receipt and present it at the reception counter.</p>
          <p>Estimated waiting time: 15-20 minutes</p>
        </div>

        <div className="flex justify-center gap-2">
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
          <Button variant="default" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  )
}
