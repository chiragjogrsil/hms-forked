"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import {
  User,
  Phone,
  Calendar,
  FileText,
  TestTube,
  CreditCard,
  CheckCircle,
  AlertCircle,
  Play,
  Upload,
  Download,
  Printer,
  MessageSquare,
  Activity,
  DollarSign,
  Receipt,
  AlertTriangle,
  Pause,
  Clock,
  Send,
  Edit,
  Save,
  X,
} from "lucide-react"

interface TestDetailModalProps {
  isOpen: boolean
  onClose: () => void
  test: any
  type: "pathology" | "radiology" | "procedures" | "panchkarma"
}

export function TestDetailModal({ isOpen, onClose, test, type }: TestDetailModalProps) {
  const [currentStatus, setCurrentStatus] = useState(test?.status || "pending")
  const [paymentStatus, setPaymentStatus] = useState(test?.paymentStatus || "pending")
  const [results, setResults] = useState("")
  const [notes, setNotes] = useState("")
  const [isEditingResults, setIsEditingResults] = useState(false)

  if (!test) return null

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "scheduled":
        return "bg-blue-100 text-blue-800"
      case "in-progress":
        return "bg-orange-100 text-orange-800"
      case "completed":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "partial":
        return "bg-orange-100 text-orange-800"
      case "overdue":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "emergency":
        return "bg-red-100 text-red-800"
      case "urgent":
        return "bg-orange-100 text-orange-800"
      case "routine":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Mock payment and billing data
  const paymentDetails = {
    totalAmount: type === "pathology" ? 850 : type === "radiology" ? 2500 : type === "procedures" ? 1200 : 800,
    paidAmount: type === "pathology" ? 850 : type === "radiology" ? 1000 : type === "procedures" ? 600 : 0,
    pendingAmount: type === "pathology" ? 0 : type === "radiology" ? 1500 : type === "procedures" ? 600 : 800,
    paymentMethod: "Credit Card",
    transactionId: "TXN123456789",
    paymentDate: "2024-01-15",
    insuranceCovered: type === "radiology" ? 1000 : 0,
  }

  const handleStatusUpdate = (newStatus: string) => {
    setCurrentStatus(newStatus)
    console.log("Status updated to:", newStatus)
    // Here you would typically make an API call to update the status
  }

  const handlePaymentUpdate = () => {
    console.log("Payment status updated to:", paymentStatus)
    // Here you would typically make an API call to update payment status
  }

  const handleSaveResults = () => {
    console.log("Results saved:", results)
    console.log("Notes saved:", notes)
    setIsEditingResults(false)
    // Here you would typically make an API call to save results and notes
  }

  // Status-specific actions and content
  const getStatusSpecificActions = () => {
    switch (currentStatus) {
      case "pending":
        return (
          <div className="flex flex-wrap gap-2">
            {paymentStatus === "paid" || paymentStatus === "partial" ? (
              <Button onClick={() => handleStatusUpdate("in-progress")} className="bg-blue-600 hover:bg-blue-700">
                <Play className="h-4 w-4 mr-2" />
                Start Processing
              </Button>
            ) : (
              <Button disabled className="bg-gray-400">
                <AlertCircle className="h-4 w-4 mr-2" />
                Payment Required
              </Button>
            )}
            <Button variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Appointment
            </Button>
            <Button variant="outline">
              <Phone className="h-4 w-4 mr-2" />
              Contact Patient
            </Button>
            <Button variant="outline">
              <Printer className="h-4 w-4 mr-2" />
              Print Instructions
            </Button>
            {paymentDetails.pendingAmount > 0 && (
              <Button variant="outline" className="text-orange-600 border-orange-600 bg-transparent">
                <DollarSign className="h-4 w-4 mr-2" />
                Collect Payment (₹{paymentDetails.pendingAmount})
              </Button>
            )}
          </div>
        )

      case "in-progress":
        return (
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => handleStatusUpdate("completed")} className="bg-green-600 hover:bg-green-700">
              <CheckCircle className="h-4 w-4 mr-2" />
              Mark Complete
            </Button>
            <Button onClick={() => handleStatusUpdate("pending")} variant="outline">
              <Pause className="h-4 w-4 mr-2" />
              Pause Processing
            </Button>
            <Button variant="outline">
              <Clock className="h-4 w-4 mr-2" />
              Update Progress
            </Button>
            <Button variant="outline">
              <MessageSquare className="h-4 w-4 mr-2" />
              Add Notes
            </Button>
            <Button variant="outline">
              <Phone className="h-4 w-4 mr-2" />
              Contact Patient
            </Button>
          </div>
        )

      case "completed":
        return (
          <div className="flex flex-wrap gap-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Download Report
            </Button>
            <Button variant="outline">
              <Send className="h-4 w-4 mr-2" />
              Send to Doctor
            </Button>
            <Button variant="outline">
              <MessageSquare className="h-4 w-4 mr-2" />
              Send to Patient
            </Button>
            <Button variant="outline">
              <Printer className="h-4 w-4 mr-2" />
              Print Report
            </Button>
            <Button variant="outline" onClick={() => setIsEditingResults(true)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Results
            </Button>
            <Button variant="outline">
              <Receipt className="h-4 w-4 mr-2" />
              Generate Invoice
            </Button>
          </div>
        )

      case "scheduled":
        return (
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => handleStatusUpdate("in-progress")} className="bg-blue-600 hover:bg-blue-700">
              <Play className="h-4 w-4 mr-2" />
              Start Now
            </Button>
            <Button variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              Reschedule
            </Button>
            <Button variant="outline">
              <Phone className="h-4 w-4 mr-2" />
              Confirm with Patient
            </Button>
            <Button variant="outline">
              <MessageSquare className="h-4 w-4 mr-2" />
              Send Reminder
            </Button>
          </div>
        )

      case "cancelled":
        return (
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => handleStatusUpdate("pending")} variant="outline">
              <Play className="h-4 w-4 mr-2" />
              Reactivate Test
            </Button>
            <Button variant="outline">
              <MessageSquare className="h-4 w-4 mr-2" />
              Contact Patient
            </Button>
            <Button variant="outline">
              <Receipt className="h-4 w-4 mr-2" />
              Process Refund
            </Button>
          </div>
        )

      default:
        return null
    }
  }

  const getStatusSpecificContent = () => {
    switch (currentStatus) {
      case "pending":
        return (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center gap-2 text-yellow-800">
              <Clock className="h-4 w-4" />
              <span className="font-medium">Test Pending</span>
            </div>
            <p className="mt-1 text-sm text-yellow-700">
              {paymentStatus === "paid"
                ? "Payment confirmed. Ready to start processing."
                : "Waiting for payment confirmation before processing can begin."}
            </p>
          </div>
        )

      case "in-progress":
        return (
          <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <div className="flex items-center gap-2 text-orange-800">
              <Activity className="h-4 w-4" />
              <span className="font-medium">Test In Progress</span>
            </div>
            <p className="mt-1 text-sm text-orange-700">
              Test is currently being processed. Expected completion time: {test.duration || "30 minutes"}.
            </p>
            <div className="mt-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>65%</span>
              </div>
              <div className="w-full bg-orange-200 rounded-full h-2 mt-1">
                <div className="bg-orange-600 h-2 rounded-full" style={{ width: "65%" }}></div>
              </div>
            </div>
          </div>
        )

      case "completed":
        return (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2 text-green-800">
              <CheckCircle className="h-4 w-4" />
              <span className="font-medium">Test Completed</span>
            </div>
            <p className="mt-1 text-sm text-green-700">
              Test completed successfully on {new Date().toLocaleDateString()}. Results are available for review.
            </p>
          </div>
        )

      case "scheduled":
        return (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2 text-blue-800">
              <Calendar className="h-4 w-4" />
              <span className="font-medium">Test Scheduled</span>
            </div>
            <p className="mt-1 text-sm text-blue-700">Scheduled for tomorrow at 10:00 AM. Patient has been notified.</p>
          </div>
        )

      case "cancelled":
        return (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 text-red-800">
              <X className="h-4 w-4" />
              <span className="font-medium">Test Cancelled</span>
            </div>
            <p className="mt-1 text-sm text-red-700">
              Test was cancelled on {new Date().toLocaleDateString()}. Refund may be applicable.
            </p>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {type === "pathology" && <TestTube className="h-5 w-5" />}
            {type === "radiology" && <Activity className="h-5 w-5" />}
            {type === "procedures" && <FileText className="h-5 w-5" />}
            {type === "panchkarma" && <CheckCircle className="h-5 w-5" />}
            {test.testName} - {test.patientName}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="patient">Patient Info</TabsTrigger>
            <TabsTrigger value="clinical">Clinical</TabsTrigger>
            <TabsTrigger value="payment">Payment</TabsTrigger>
            <TabsTrigger value="results">Results</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Test Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Test Name:</span>
                    <span>{test.testName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Test ID:</span>
                    <span className="font-mono">{test.id}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Status:</span>
                    <Badge className={getStatusColor(currentStatus)}>{currentStatus}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Priority:</span>
                    <Badge className={getPriorityColor(test.priority)}>{test.priority}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Prescribed By:</span>
                    <span>{test.prescribedBy}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Prescribed Date:</span>
                    <span>{test.prescribedDate}</span>
                  </div>
                  {test.duration && (
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Duration:</span>
                      <span>{test.duration}</span>
                    </div>
                  )}
                  {test.sessions && (
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Sessions:</span>
                      <span>{test.sessions}</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Payment Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Payment Status:</span>
                    <Badge className={getPaymentStatusColor(paymentStatus)}>{paymentStatus}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Total Amount:</span>
                    <span className="font-semibold">₹{paymentDetails.totalAmount}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Paid Amount:</span>
                    <span className="text-green-600">₹{paymentDetails.paidAmount}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Pending Amount:</span>
                    <span className="text-red-600">₹{paymentDetails.pendingAmount}</span>
                  </div>
                  {paymentDetails.insuranceCovered > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Insurance Covered:</span>
                      <span className="text-blue-600">₹{paymentDetails.insuranceCovered}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Status-specific content */}
            {getStatusSpecificContent()}

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Actions</CardTitle>
              </CardHeader>
              <CardContent>{getStatusSpecificActions()}</CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="patient" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Patient Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Name:</span>
                      <span>{test.patientName}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Patient ID:</span>
                      <span className="font-mono">{test.patientId}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Age:</span>
                      <span>{test.age} years</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Gender:</span>
                      <span>{test.gender}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Phone:</span>
                      <span>{test.phone}</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Blood Group:</span>
                      <span>O+</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Emergency Contact:</span>
                      <span>+91 9876543200</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Insurance:</span>
                      <span>HDFC ERGO - 123456</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Address:</span>
                      <span className="text-right">123 Main St, City</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Current Vital Signs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">120/80</div>
                    <div className="text-sm text-muted-foreground">Blood Pressure</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">72</div>
                    <div className="text-sm text-muted-foreground">Heart Rate</div>
                  </div>
                  <div className="text-center p-3 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">98.6°F</div>
                    <div className="text-sm text-muted-foreground">Temperature</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">98%</div>
                    <div className="text-sm text-muted-foreground">SpO2</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="clinical" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Clinical Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="font-medium">Clinical Indication</Label>
                  <p className="mt-1 p-3 bg-gray-50 rounded-md">{test.indication}</p>
                </div>

                <div>
                  <Label className="font-medium">Prescribing Doctor's Notes</Label>
                  <p className="mt-1 p-3 bg-gray-50 rounded-md">
                    Patient presents with symptoms consistent with the indication. Please perform the test as per
                    standard protocol and report any abnormal findings immediately.
                  </p>
                </div>

                <div>
                  <Label className="font-medium">Special Instructions</Label>
                  <div className="mt-1 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                    <div className="flex items-center gap-2 text-yellow-800">
                      <AlertTriangle className="h-4 w-4" />
                      <span className="font-medium">Important:</span>
                    </div>
                    <ul className="mt-2 text-sm text-yellow-700 list-disc list-inside">
                      <li>Patient is fasting for 12 hours</li>
                      <li>Avoid caffeine 24 hours before test</li>
                      <li>Bring previous reports for comparison</li>
                    </ul>
                  </div>
                </div>

                {test.sampleType && (
                  <div>
                    <Label className="font-medium">Sample Information</Label>
                    <div className="mt-1 grid grid-cols-2 gap-4">
                      <div className="flex items-center justify-between">
                        <span>Sample Type:</span>
                        <span className="font-medium">{test.sampleType}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Collection Time:</span>
                        <span className="font-medium">Morning (Fasting)</span>
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <Label className="font-medium">Technician Notes</Label>
                  <Textarea
                    placeholder="Add any observations or notes..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="mt-1"
                    disabled={currentStatus === "completed" && !isEditingResults}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payment" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Receipt className="h-5 w-5" />
                  Payment Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-semibold">Billing Information</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Test Fee:</span>
                        <span>₹{paymentDetails.totalAmount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Discount:</span>
                        <span className="text-green-600">-₹0</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tax (GST):</span>
                        <span>₹{Math.round(paymentDetails.totalAmount * 0.18)}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between font-semibold">
                        <span>Total Amount:</span>
                        <span>₹{paymentDetails.totalAmount + Math.round(paymentDetails.totalAmount * 0.18)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold">Payment Status</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Paid Amount:</span>
                        <span className="text-green-600">₹{paymentDetails.paidAmount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Pending Amount:</span>
                        <span className="text-red-600">₹{paymentDetails.pendingAmount}</span>
                      </div>
                      {paymentDetails.insuranceCovered > 0 && (
                        <div className="flex justify-between">
                          <span>Insurance Covered:</span>
                          <span className="text-blue-600">₹{paymentDetails.insuranceCovered}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span>Payment Method:</span>
                        <span>{paymentDetails.paymentMethod}</span>
                      </div>
                      {paymentDetails.transactionId && (
                        <div className="flex justify-between">
                          <span>Transaction ID:</span>
                          <span className="font-mono text-sm">{paymentDetails.transactionId}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <h4 className="font-semibold">Payment Actions</h4>
                  <div className="flex flex-wrap gap-2">
                    {paymentDetails.pendingAmount > 0 && (
                      <Button className="bg-green-600 hover:bg-green-700">
                        <DollarSign className="h-4 w-4 mr-2" />
                        Collect Payment (₹{paymentDetails.pendingAmount})
                      </Button>
                    )}
                    <Button variant="outline">
                      <Receipt className="h-4 w-4 mr-2" />
                      Generate Invoice
                    </Button>
                    <Button variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Download Receipt
                    </Button>
                    <Button variant="outline">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Send Payment Reminder
                    </Button>
                  </div>
                </div>

                {paymentStatus === "overdue" && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center gap-2 text-red-800">
                      <AlertCircle className="h-4 w-4" />
                      <span className="font-medium">Payment Overdue</span>
                    </div>
                    <p className="mt-1 text-sm text-red-700">
                      Payment is overdue by 5 days. Please collect payment before proceeding with the test.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="results" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Test Results & Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="status">Update Status</Label>
                    <Select value={currentStatus} onValueChange={setCurrentStatus}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="scheduled">Scheduled</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="payment-status">Payment Status</Label>
                    <Select value={paymentStatus} onValueChange={setPaymentStatus}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="partial">Partial</SelectItem>
                        <SelectItem value="paid">Paid</SelectItem>
                        <SelectItem value="overdue">Overdue</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label htmlFor="results">Test Results</Label>
                    {currentStatus === "completed" && !isEditingResults && (
                      <Button size="sm" variant="outline" onClick={() => setIsEditingResults(true)}>
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    )}
                  </div>
                  <Textarea
                    id="results"
                    placeholder={
                      currentStatus === "completed"
                        ? "Test results and findings..."
                        : "Results will be available after test completion"
                    }
                    value={
                      currentStatus === "completed"
                        ? "Normal values within reference range. No abnormalities detected."
                        : results
                    }
                    onChange={(e) => setResults(e.target.value)}
                    rows={6}
                    disabled={currentStatus !== "completed" && currentStatus !== "in-progress"}
                    readOnly={currentStatus === "completed" && !isEditingResults}
                  />
                  {isEditingResults && (
                    <div className="flex gap-2 mt-2">
                      <Button size="sm" onClick={handleSaveResults}>
                        <Save className="h-4 w-4 mr-1" />
                        Save Changes
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setIsEditingResults(false)}>
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>

                {(currentStatus === "in-progress" || currentStatus === "completed") && (
                  <div>
                    <Label>Upload Files</Label>
                    <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600">Drag and drop files here, or click to browse</p>
                      <p className="text-xs text-gray-500 mt-1">Supported formats: PDF, JPG, PNG, DICOM (Max 10MB)</p>
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  {currentStatus === "in-progress" && (
                    <Button onClick={handleSaveResults} className="bg-green-600 hover:bg-green-700">
                      <Save className="h-4 w-4 mr-2" />
                      Save Progress
                    </Button>
                  )}
                  {currentStatus === "completed" && (
                    <>
                      <Button variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Download Report
                      </Button>
                      <Button variant="outline">
                        <Send className="h-4 w-4 mr-2" />
                        Send to Doctor
                      </Button>
                    </>
                  )}
                  <Button onClick={handlePaymentUpdate} variant="outline">
                    Update Payment
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Activity Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium">Test Prescribed</p>
                      <p className="text-sm text-muted-foreground">
                        {test.prescribedDate} by {test.prescribedBy}
                      </p>
                    </div>
                  </div>

                  {paymentStatus === "paid" && (
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <div>
                        <p className="font-medium">Payment Received</p>
                        <p className="text-sm text-muted-foreground">
                          {paymentDetails.paymentDate} - ₹{paymentDetails.paidAmount} via {paymentDetails.paymentMethod}
                        </p>
                      </div>
                    </div>
                  )}

                  {currentStatus === "scheduled" && (
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div>
                        <p className="font-medium">Test Scheduled</p>
                        <p className="text-sm text-muted-foreground">Tomorrow at 10:00 AM - Patient notified</p>
                      </div>
                    </div>
                  )}

                  {currentStatus === "in-progress" && (
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                      <div>
                        <p className="font-medium">Processing Started</p>
                        <p className="text-sm text-muted-foreground">Today - Test processing initiated</p>
                      </div>
                    </div>
                  )}

                  {currentStatus === "completed" && (
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <div>
                        <p className="font-medium">Test Completed</p>
                        <p className="text-sm text-muted-foreground">Today - Results available for review</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
