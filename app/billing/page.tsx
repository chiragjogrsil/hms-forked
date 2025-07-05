"use client"

import { useState } from "react"
import { ArrowLeft, Download, Printer, Receipt, Search } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

export default function Billing() {
  const [tab, setTab] = useState("consultation")

  // Mock data for services
  const services = [
    { id: 1, name: "General Consultation", price: 500 },
    { id: 2, name: "Specialist Consultation", price: 1000 },
    { id: 3, name: "Blood Test - Complete Blood Count", price: 800 },
    { id: 4, name: "X-Ray - Chest", price: 1200 },
    { id: 5, name: "ECG", price: 600 },
    { id: 6, name: "Ultrasound", price: 1500 },
  ]

  // Mock data for packages
  const packages = [
    { id: 1, name: "Basic Health Checkup", price: 2500, services: ["General Consultation", "Blood Test", "ECG"] },
    {
      id: 2,
      name: "Comprehensive Health Checkup",
      price: 5000,
      services: ["Specialist Consultation", "Blood Test", "ECG", "X-Ray", "Ultrasound"],
    },
    {
      id: 3,
      name: "Cardiac Checkup",
      price: 3500,
      services: ["Cardiology Consultation", "ECG", "Echo", "Stress Test"],
    },
    {
      id: 4,
      name: "Diabetes Care",
      price: 3000,
      services: ["Endocrinology Consultation", "Blood Sugar Profile", "HbA1c", "Kidney Function Test"],
    },
  ]

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6 flex items-center">
        <Button variant="ghost" size="icon" asChild className="mr-2">
          <Link href="/">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Billing</h1>
      </div>

      <div className="space-y-6">
        <Tabs value={tab} onValueChange={setTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="consultation">Consultation Billing</TabsTrigger>
            <TabsTrigger value="service">Service Billing</TabsTrigger>
            <TabsTrigger value="advance">Advance Collection</TabsTrigger>
            <TabsTrigger value="history">Billing History</TabsTrigger>
          </TabsList>

          <TabsContent value="consultation">
            <Card>
              <CardHeader>
                <CardTitle>Consultation Billing</CardTitle>
                <CardDescription>Generate bill for doctor consultation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="text-sm font-medium">Patient ID</label>
                      <div className="mt-1 flex">
                        <Input placeholder="Enter patient ID" className="rounded-r-none" />
                        <Button variant="secondary" className="rounded-l-none">
                          <Search className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex-1">
                      <label className="text-sm font-medium">Patient Name</label>
                      <Input className="mt-1" placeholder="John Doe" disabled />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="text-sm font-medium">Doctor</label>
                      <Select>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select doctor" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="dr-smith">Dr. Smith (General Medicine)</SelectItem>
                          <SelectItem value="dr-johnson">Dr. Johnson (Cardiology)</SelectItem>
                          <SelectItem value="dr-williams">Dr. Williams (Pediatrics)</SelectItem>
                          <SelectItem value="dr-taylor">Dr. Taylor (Ophthalmology)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium">Consultation Type</label>
                      <Select>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">New Patient (₹500)</SelectItem>
                          <SelectItem value="follow-up">Follow-up (₹300)</SelectItem>
                          <SelectItem value="emergency">Emergency (₹1000)</SelectItem>
                          <SelectItem value="specialist">Specialist (₹1000)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="text-sm font-medium">Discount (%)</label>
                      <Input className="mt-1" type="number" placeholder="0" min="0" max="100" />
                    </div>

                    <div>
                      <label className="text-sm font-medium">Payment Method</label>
                      <Select>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select payment method" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cash">Cash</SelectItem>
                          <SelectItem value="card">Card</SelectItem>
                          <SelectItem value="upi">UPI</SelectItem>
                          <SelectItem value="insurance">Insurance</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="rounded-lg border p-4">
                    <div className="mb-4 flex items-center justify-between">
                      <span className="text-sm font-medium">Consultation Fee</span>
                      <span>₹500.00</span>
                    </div>
                    <div className="mb-4 flex items-center justify-between">
                      <span className="text-sm font-medium">Discount (0%)</span>
                      <span>₹0.00</span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex items-center justify-between font-bold">
                      <span>Total Amount</span>
                      <span>₹500.00</span>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button variant="outline">
                      <Printer className="mr-2 h-4 w-4" />
                      Print Invoice
                    </Button>
                    <Button>
                      <Receipt className="mr-2 h-4 w-4" />
                      Generate Receipt
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="service">
            <Card>
              <CardHeader>
                <CardTitle>Service Billing</CardTitle>
                <CardDescription>Generate bill for diagnostic tests and other services</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="text-sm font-medium">Patient ID</label>
                      <div className="mt-1 flex">
                        <Input placeholder="Enter patient ID" className="rounded-r-none" />
                        <Button variant="secondary" className="rounded-l-none">
                          <Search className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex-1">
                      <label className="text-sm font-medium">Patient Name</label>
                      <Input className="mt-1" placeholder="John Doe" disabled />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Add Services</label>
                    <div className="mt-1 flex gap-2">
                      <Select className="flex-1">
                        <SelectTrigger>
                          <SelectValue placeholder="Select service" />
                        </SelectTrigger>
                        <SelectContent>
                          {services.map((service) => (
                            <SelectItem key={service.id} value={service.id.toString()}>
                              {service.name} (₹{service.price})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button>Add</Button>
                    </div>
                  </div>

                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Service</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>Blood Test - Complete Blood Count</TableCell>
                        <TableCell>₹800.00</TableCell>
                        <TableCell>
                          <Input type="number" defaultValue="1" min="1" className="w-16" />
                        </TableCell>
                        <TableCell>₹800.00</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <span className="sr-only">Remove</span>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="h-4 w-4"
                            >
                              <path d="M18 6L6 18M6 6l12 12" />
                            </svg>
                          </Button>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>X-Ray - Chest</TableCell>
                        <TableCell>₹1,200.00</TableCell>
                        <TableCell>
                          <Input type="number" defaultValue="1" min="1" className="w-16" />
                        </TableCell>
                        <TableCell>₹1,200.00</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <span className="sr-only">Remove</span>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="h-4 w-4"
                            >
                              <path d="M18 6L6 18M6 6l12 12" />
                            </svg>
                          </Button>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="text-sm font-medium">Discount (%)</label>
                      <Input className="mt-1" type="number" placeholder="0" min="0" max="100" />
                    </div>

                    <div>
                      <label className="text-sm font-medium">Payment Method</label>
                      <Select>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select payment method" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cash">Cash</SelectItem>
                          <SelectItem value="card">Card</SelectItem>
                          <SelectItem value="upi">UPI</SelectItem>
                          <SelectItem value="insurance">Insurance</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="rounded-lg border p-4">
                    <div className="mb-4 flex items-center justify-between">
                      <span className="text-sm font-medium">Subtotal</span>
                      <span>₹2,000.00</span>
                    </div>
                    <div className="mb-4 flex items-center justify-between">
                      <span className="text-sm font-medium">Discount (0%)</span>
                      <span>₹0.00</span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex items-center justify-between font-bold">
                      <span>Total Amount</span>
                      <span>₹2,000.00</span>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button variant="outline">
                      <Printer className="mr-2 h-4 w-4" />
                      Print Invoice
                    </Button>
                    <Button>
                      <Receipt className="mr-2 h-4 w-4" />
                      Generate Receipt
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="advance">
            <Card>
              <CardHeader>
                <CardTitle>Advance Collection</CardTitle>
                <CardDescription>Collect advance for package-based OPD services</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="text-sm font-medium">Patient ID</label>
                      <div className="mt-1 flex">
                        <Input placeholder="Enter patient ID" className="rounded-r-none" />
                        <Button variant="secondary" className="rounded-l-none">
                          <Search className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex-1">
                      <label className="text-sm font-medium">Patient Name</label>
                      <Input className="mt-1" placeholder="John Doe" disabled />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Select Package</label>
                    <Select>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select package" />
                      </SelectTrigger>
                      <SelectContent>
                        {packages.map((pkg) => (
                          <SelectItem key={pkg.id} value={pkg.id.toString()}>
                            {pkg.name} (₹{pkg.price})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="rounded-lg border p-4">
                    <h3 className="mb-2 font-medium">Package Details</h3>
                    <div className="mb-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Package Name</span>
                        <span className="font-medium">Comprehensive Health Checkup</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Package Price</span>
                        <span className="font-medium">₹5,000.00</span>
                      </div>
                    </div>
                    <h4 className="mb-2 text-sm font-medium">Included Services</h4>
                    <ul className="mb-4 list-inside list-disc space-y-1 text-sm">
                      <li>Specialist Consultation</li>
                      <li>Blood Test</li>
                      <li>ECG</li>
                      <li>X-Ray</li>
                      <li>Ultrasound</li>
                    </ul>
                    <Separator className="my-2" />
                    <div className="mt-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Advance Amount</span>
                        <div className="flex items-center gap-2">
                          <Input type="number" placeholder="Enter amount" className="w-32" defaultValue="2500" />
                          <span className="text-sm text-gray-500">(Min: 50%)</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Balance Amount</span>
                        <span>₹2,500.00</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="text-sm font-medium">Payment Method</label>
                      <Select>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select payment method" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cash">Cash</SelectItem>
                          <SelectItem value="card">Card</SelectItem>
                          <SelectItem value="upi">UPI</SelectItem>
                          <SelectItem value="insurance">Insurance</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium">Scheduled Date</label>
                      <Input className="mt-1" type="date" />
                    </div>
                  </div>

                  <div className="flex items-start space-x-2">
                    <Checkbox id="terms" />
                    <div className="grid gap-1.5 leading-none">
                      <Label htmlFor="terms" className="text-sm font-medium">
                        Patient has been informed about package details and payment terms
                      </Label>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button variant="outline">
                      <Printer className="mr-2 h-4 w-4" />
                      Print Receipt
                    </Button>
                    <Button>
                      <Receipt className="mr-2 h-4 w-4" />
                      Collect Advance
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Billing History</CardTitle>
                <CardDescription>View and manage previous bills</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <Input placeholder="Search by patient ID, name, or receipt number" className="flex-1" />
                    <Button variant="secondary">
                      <Search className="mr-2 h-4 w-4" />
                      Search
                    </Button>
                  </div>

                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Receipt No.</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Patient</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {[
                        { id: "R001", date: "2023-05-01", patient: "John Doe", type: "Consultation", amount: 500 },
                        { id: "R002", date: "2023-05-01", patient: "Jane Smith", type: "Services", amount: 2000 },
                        {
                          id: "R003",
                          date: "2023-05-02",
                          patient: "Robert Brown",
                          type: "Consultation",
                          amount: 1000,
                        },
                        { id: "R004", date: "2023-05-02", patient: "Emily Davis", type: "Services", amount: 1500 },
                        {
                          id: "R005",
                          date: "2023-05-03",
                          patient: "Michael Wilson",
                          type: "Consultation",
                          amount: 500,
                        },
                        {
                          id: "R006",
                          date: "2023-05-03",
                          patient: "Sarah Johnson",
                          type: "Advance",
                          amount: 2500,
                        },
                      ].map((receipt) => (
                        <TableRow key={receipt.id}>
                          <TableCell className="font-medium">{receipt.id}</TableCell>
                          <TableCell>{receipt.date}</TableCell>
                          <TableCell>{receipt.patient}</TableCell>
                          <TableCell>{receipt.type}</TableCell>
                          <TableCell>₹{receipt.amount.toFixed(2)}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <Printer className="h-4 w-4" />
                                <span className="sr-only">Print</span>
                              </Button>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <Download className="h-4 w-4" />
                                <span className="sr-only">Download</span>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card>
          <CardHeader>
            <CardTitle>Payment Summary</CardTitle>
            <CardDescription>Today's billing statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Total Bills</span>
                <span className="font-bold">15</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Consultation Bills</span>
                <span className="font-bold">8</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Service Bills</span>
                <span className="font-bold">7</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Advance Collections</span>
                <span className="font-bold">3</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Total Amount</span>
                <span className="font-bold">₹12,500.00</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Cash</span>
                <span className="font-bold">₹5,500.00</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Card</span>
                <span className="font-bold">₹4,000.00</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">UPI</span>
                <span className="font-bold">₹3,000.00</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
