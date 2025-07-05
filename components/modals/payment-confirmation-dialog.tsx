"use client"

import { useState, useEffect } from "react"
import { Check, X, Receipt } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface PaymentConfirmationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  appointment: any
  onComplete: (paid: boolean, paymentMethod?: string, amount?: string) => void
  mode?: "collect" | "view" | "complete"
}

export function PaymentConfirmationDialog({
  open,
  onOpenChange,
  appointment,
  onComplete,
  mode = "complete",
}: PaymentConfirmationDialogProps) {
  const [payNow, setPayNow] = useState(mode === "collect" ? true : mode === "complete")
  const [paymentMethod, setPaymentMethod] = useState(appointment?.paymentMethod || "cash")
  const [paymentAmount, setPaymentAmount] = useState(appointment?.paymentAmount || appointment?.fee?.toString() || "")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Reset form when appointment changes
  useEffect(() => {
    if (appointment) {
      setPaymentMethod(appointment.paymentMethod || "cash")
      setPaymentAmount(appointment.paymentAmount || appointment.fee?.toString() || "")
      setPayNow(mode === "collect" ? true : mode === "complete")
    }
  }, [appointment, mode])

  const handleComplete = async () => {
    setIsSubmitting(true)

    try {
      // In a real app, this would be an API call to process payment
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Call the onComplete callback with payment status
      onComplete(payNow, payNow ? paymentMethod : undefined, payNow ? paymentAmount : undefined)

      // Reset form
      setPayNow(true)
      setPaymentMethod("cash")
    } catch (error) {
      console.error("Failed to process completion:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const getDialogTitle = () => {
    if (mode === "view") return "Payment Details"
    if (mode === "collect") return "Collect Payment"
    if (appointment?.paymentStatus === "unpaid") return "Process Payment"
    return "Complete Appointment"
  }

  const getDialogDescription = () => {
    if (mode === "view") return "View payment details for this appointment."
    if (mode === "collect") return "Collect payment for this completed appointment."
    if (appointment?.paymentStatus === "unpaid") return "Process payment for this completed appointment."
    return "Choose payment option to complete this appointment."
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{getDialogTitle()}</DialogTitle>
          <DialogDescription>{getDialogDescription()}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {mode === "complete" && (
            <div className="space-y-2">
              <Label>Payment Option</Label>
              <RadioGroup
                value={payNow ? "pay-now" : "pay-later"}
                onValueChange={(value) => setPayNow(value === "pay-now")}
                className="flex flex-col space-y-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="pay-now" id="pay-now" />
                  <Label htmlFor="pay-now" className="font-normal">
                    Pay Now
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="pay-later" id="pay-later" />
                  <Label htmlFor="pay-later" className="font-normal">
                    Pay Later
                  </Label>
                </div>
              </RadioGroup>
            </div>
          )}

          {(payNow || mode === "collect" || mode === "view") && (
            <>
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (₹)</Label>
                <Input
                  id="amount"
                  type="number"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  disabled={mode === "view"}
                />
              </div>

              <div className="space-y-2">
                <Label>Payment Method</Label>
                <RadioGroup
                  value={paymentMethod}
                  onValueChange={setPaymentMethod}
                  className="flex flex-col space-y-1"
                  disabled={mode === "view"}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="cash" id="cash" />
                    <Label htmlFor="cash" className="font-normal">
                      Cash
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="font-normal">
                      Card
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="upi" id="upi" />
                    <Label htmlFor="upi" className="font-normal">
                      UPI
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </>
          )}
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          {mode === "view" ? (
            <>
              <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full sm:w-auto">
                Close
              </Button>
              <Button variant="outline" className="w-full sm:w-auto">
                <Receipt className="mr-2 h-4 w-4" />
                Print Receipt
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full sm:w-auto">
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
              <Button
                onClick={handleComplete}
                disabled={isSubmitting || ((payNow || mode === "collect") && !paymentAmount)}
                className="w-full sm:w-auto"
              >
                {isSubmitting ? (
                  "Processing..."
                ) : (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    {mode === "collect"
                      ? "Collect Payment"
                      : appointment?.paymentStatus === "unpaid"
                        ? "Process Payment"
                        : payNow
                          ? "Complete & Pay"
                          : "Complete (Pay Later)"}
                  </>
                )}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
