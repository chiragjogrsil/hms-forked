"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  CheckCircle,
  AlertTriangle,
  IndianRupee,
  FileText,
  Calendar,
  User,
  Stethoscope,
  TestTube,
  Pill,
  Activity,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { PaymentConfirmationDialog } from "./payment-confirmation-dialog"
import { formatCurrency } from "@/lib/utils"

const completeVisitSchema = z.object({
  visitSummary: z.string().min(10, "Please provide a visit summary (minimum 10 characters)"),
  followUpRequired: z.enum(["yes", "no"], {
    required_error: "Please specify if follow-up is required",
  }),
  followUpDate: z.string().optional(),
  followUpInstructions: z.string().optional(),
  additionalNotes: z.string().optional(),
})

type CompleteVisitFormValues = z.infer<typeof completeVisitSchema>

interface CompleteVisitModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  visitData: any
  onVisitCompleted: (completedVisitData: any) => void
}

export function CompleteVisitModal({ open, onOpenChange, visitData, onVisitCompleted }: CompleteVisitModalProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPaymentPrompt, setShowPaymentPrompt] = useState(false)
  const [showPaymentDialog, setShowPaymentDialog] = useState(false)
  const [completedVisitData, setCompletedVisitData] = useState<any>(null)

  const form = useForm<CompleteVisitFormValues>({
    resolver: zodResolver(completeVisitSchema),
    defaultValues: {
      visitSummary: "",
      followUpRequired: "no",
      followUpDate: "",
      followUpInstructions: "",
      additionalNotes: "",
    },
  })

  const followUpRequired = form.watch("followUpRequired")

  // Calculate total cost
  const calculateTotalCost = () => {
    let total = 0

    // Consultation fee
    total += visitData?.consultationFee || 500

    // Prescriptions
    if (visitData?.prescriptions?.length > 0) {
      visitData.prescriptions.forEach((prescription: any) => {
        if (prescription.medications) {
          prescription.medications.forEach((med: any) => {
            total += med.cost || 0
          })
        }
      })
    }

    // Lab tests
    if (visitData?.labTests?.length > 0) {
      visitData.labTests.forEach((test: any) => {
        total += test.cost || 0
      })
    }

    // Radiology
    if (visitData?.radiologyTests?.length > 0) {
      visitData.radiologyTests.forEach((test: any) => {
        total += test.cost || 0
      })
    }

    // Procedures
    if (visitData?.procedures?.length > 0) {
      visitData.procedures.forEach((procedure: any) => {
        total += procedure.cost || 0
      })
    }

    // Physiotherapy
    if (visitData?.physiotherapy?.length > 0) {
      visitData.physiotherapy.forEach((treatment: any) => {
        total += treatment.cost || 0
      })
    }

    // Panchkarma
    if (visitData?.panchkarma?.length > 0) {
      visitData.panchkarma.forEach((treatment: any) => {
        total += treatment.cost || 0
      })
    }

    return total
  }

  const totalAmount = calculateTotalCost()
  const isUnpaid = visitData?.paymentStatus !== "paid" && totalAmount > 0

  const onSubmit = async (data: CompleteVisitFormValues) => {
    const visitCompletionData = {
      ...data,
      visitId: visitData?.id,
      patientId: visitData?.patientId,
      completedAt: new Date().toISOString(),
      totalAmount,
      paymentStatus: visitData?.paymentStatus || "unpaid",
    }

    setCompletedVisitData(visitCompletionData)

    // If visit is unpaid and has amount due, show payment prompt
    if (isUnpaid) {
      setShowPaymentPrompt(true)
    } else {
      // Complete visit directly if already paid or no amount due
      await completeVisit(visitCompletionData)
    }
  }

  const completeVisit = async (data: any) => {
    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Call the callback
      onVisitCompleted(data)

      // Close modal
      onOpenChange(false)

      // Show success toast
      toast({
        title: "Visit completed successfully",
        description: `Visit for ${visitData?.patientName} has been completed.`,
      })

      // Reset form
      form.reset()
    } catch (error) {
      toast({
        title: "Failed to complete visit",
        description: "Please try again or contact support.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCompleteWithoutPayment = async () => {
    setShowPaymentPrompt(false)
    await completeVisit(completedVisitData)
  }

  const handleCollectPayment = () => {
    setShowPaymentPrompt(false)
    setShowPaymentDialog(true)
  }

  const handlePaymentCompleted = async (paymentData: any) => {
    setShowPaymentDialog(false)

    // Update visit data with payment information
    const updatedVisitData = {
      ...completedVisitData,
      paymentStatus: "paid",
      paymentMethod: paymentData.paymentMethod,
      paymentDate: new Date().toISOString(),
      amountPaid: totalAmount,
    }

    await completeVisit(updatedVisitData)
  }

  const handleCancel = () => {
    onOpenChange(false)
    form.reset()
  }

  // Get minimum date for follow-up (tomorrow)
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const minFollowUpDate = tomorrow.toISOString().split("T")[0]

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Complete Visit
            </DialogTitle>
            <DialogDescription>
              Complete the visit for {visitData?.patientName} and provide summary details.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Visit Information Card */}
              <Card className="bg-gradient-to-r from-blue-50 to-teal-50 border-blue-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <User className="h-5 w-5 text-blue-600" />
                    Visit Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-600">Patient:</span>
                      <p className="font-semibold text-gray-800">{visitData?.patientName}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Visit ID:</span>
                      <p className="font-semibold text-gray-800">{visitData?.id}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Doctor:</span>
                      <p className="font-semibold text-gray-800">{visitData?.doctor}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Date:</span>
                      <p className="font-semibold text-gray-800">
                        {visitData?.date ? new Date(visitData.date).toLocaleDateString() : "Today"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Treatment Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Activity className="h-5 w-5 text-teal-600" />
                    Treatment Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Consultation */}
                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-2">
                      <Stethoscope className="h-4 w-4 text-blue-600" />
                      <span className="font-medium">Consultation Fee</span>
                    </div>
                    <span className="font-semibold">{formatCurrency(visitData?.consultationFee || 500)}</span>
                  </div>

                  {/* Prescriptions */}
                  {visitData?.prescriptions?.length > 0 && (
                    <>
                      <Separator />
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Pill className="h-4 w-4 text-green-600" />
                          <span className="font-medium">Prescriptions</span>
                        </div>
                        {visitData.prescriptions.map((prescription: any, index: number) => (
                          <div key={index} className="ml-6 space-y-1">
                            {prescription.medications?.map((med: any, medIndex: number) => (
                              <div key={medIndex} className="flex justify-between text-sm">
                                <span>
                                  {med.name} - {med.dosage}
                                </span>
                                <span>{formatCurrency(med.cost || 0)}</span>
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  {/* Lab Tests */}
                  {visitData?.labTests?.length > 0 && (
                    <>
                      <Separator />
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <TestTube className="h-4 w-4 text-purple-600" />
                          <span className="font-medium">Lab Tests</span>
                        </div>
                        <div className="ml-6 space-y-1">
                          {visitData.labTests.map((test: any, index: number) => (
                            <div key={index} className="flex justify-between text-sm">
                              <span>{test.name}</span>
                              <span>{formatCurrency(test.cost || 0)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  {/* Radiology */}
                  {visitData?.radiologyTests?.length > 0 && (
                    <>
                      <Separator />
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Activity className="h-4 w-4 text-orange-600" />
                          <span className="font-medium">Radiology</span>
                        </div>
                        <div className="ml-6 space-y-1">
                          {visitData.radiologyTests.map((test: any, index: number) => (
                            <div key={index} className="flex justify-between text-sm">
                              <span>{test.name}</span>
                              <span>{formatCurrency(test.cost || 0)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  {/* Procedures */}
                  {visitData?.procedures?.length > 0 && (
                    <>
                      <Separator />
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <FileText className="h-4 w-4 text-red-600" />
                          <span className="font-medium">Procedures</span>
                        </div>
                        <div className="ml-6 space-y-1">
                          {visitData.procedures.map((procedure: any, index: number) => (
                            <div key={index} className="flex justify-between text-sm">
                              <span>{procedure.name}</span>
                              <span>{formatCurrency(procedure.cost || 0)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  {/* Total */}
                  <Separator />
                  <div className="flex items-center justify-between py-2 bg-gray-50 px-3 rounded-lg">
                    <div className="flex items-center gap-2">
                      <IndianRupee className="h-5 w-5 text-green-600" />
                      <span className="font-bold text-lg">Total Amount</span>
                    </div>
                    <span className="font-bold text-xl text-green-600">{formatCurrency(totalAmount)}</span>
                  </div>

                  {/* Payment Status */}
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Payment Status:</span>
                    <Badge variant={visitData?.paymentStatus === "paid" ? "default" : "destructive"}>
                      {visitData?.paymentStatus === "paid" ? "Paid" : "Unpaid"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Visit Summary */}
              <FormField
                control={form.control}
                name="visitSummary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Visit Summary *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Provide a comprehensive summary of the visit, including diagnosis, treatment provided, and patient response..."
                        className="min-h-[100px] resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Follow-up Required */}
              <FormField
                control={form.control}
                name="followUpRequired"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Follow-up Required *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select if follow-up is required" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="no">No Follow-up Required</SelectItem>
                        <SelectItem value="yes">Follow-up Required</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Follow-up Details (conditional) */}
              {followUpRequired === "yes" && (
                <div className="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-800 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Follow-up Details
                  </h4>

                  <FormField
                    control={form.control}
                    name="followUpDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Follow-up Date</FormLabel>
                        <FormControl>
                          <input
                            type="date"
                            min={minFollowUpDate}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="followUpInstructions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Follow-up Instructions</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Specific instructions for the follow-up visit..."
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {/* Additional Notes */}
              <FormField
                control={form.control}
                name="additionalNotes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Any additional notes or observations..."
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter className="gap-2">
                <Button type="button" variant="outline" onClick={handleCancel} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting} className="bg-green-600 hover:bg-green-700">
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Completing...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Complete Visit
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Payment Prompt Dialog */}
      <AlertDialog open={showPaymentPrompt} onOpenChange={setShowPaymentPrompt}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              Payment Collection Required
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-3">
              <p>
                This visit has an unpaid amount of{" "}
                <strong className="text-amber-600">{formatCurrency(totalAmount)}</strong>.
              </p>
              <p>Would you like to collect the payment now or complete the visit without payment?</p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel onClick={handleCompleteWithoutPayment}>Complete Without Payment</AlertDialogCancel>
            <AlertDialogAction onClick={handleCollectPayment} className="bg-green-600 hover:bg-green-700">
              <IndianRupee className="h-4 w-4 mr-2" />
              Collect Payment
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Payment Collection Dialog */}
      {showPaymentDialog && (
        <PaymentConfirmationDialog
          open={showPaymentDialog}
          onOpenChange={setShowPaymentDialog}
          amount={totalAmount}
          patientName={visitData?.patientName}
          onPaymentConfirmed={handlePaymentCompleted}
        />
      )}
    </>
  )
}
