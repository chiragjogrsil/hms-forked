"use client"

import { useState } from "react"
import { ArrowLeft, Download, Package, Pill, Printer, Search, ShoppingBag } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"

export default function Pharmacy() {
  const [tab, setTab] = useState("dispense")

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6 flex items-center">
        <Button variant="ghost" size="icon" asChild className="mr-2">
          <Link href="/">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Pharmacy</h1>
      </div>

      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="dispense">Dispense Medicines</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value="dispense">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Dispense Medicines</CardTitle>
                  <CardDescription>View prescription and dispense medicines</CardDescription>
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
                        <label className="text-sm font-medium">Prescription ID</label>
                        <div className="mt-1 flex">
                          <Input placeholder="Enter prescription ID" className="rounded-r-none" />
                          <Button variant="secondary" className="rounded-l-none">
                            <Search className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-lg border p-4">
                      <div className="mb-4 flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">John Doe</h3>
                          <p className="text-sm text-muted-foreground">ID: P12345 | Age: 45 | Gender: Male</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">Dr. Smith</p>
                          <p className="text-xs text-muted-foreground">Prescription Date: 2023-05-01</p>
                        </div>
                      </div>

                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Medicine</TableHead>
                            <TableHead>Dosage</TableHead>
                            <TableHead>Frequency</TableHead>
                            <TableHead>Duration</TableHead>
                            <TableHead>Quantity</TableHead>
                            <TableHead>Available</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell>Amoxicillin 500mg</TableCell>
                            <TableCell>1 tablet</TableCell>
                            <TableCell>3 times a day</TableCell>
                            <TableCell>5 days</TableCell>
                            <TableCell>
                              <Input type="number" defaultValue="15" min="1" className="w-16" />
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">Yes</Badge>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Paracetamol 500mg</TableCell>
                            <TableCell>1 tablet</TableCell>
                            <TableCell>As needed</TableCell>
                            <TableCell>3 days</TableCell>
                            <TableCell>
                              <Input type="number" defaultValue="10" min="1" className="w-16" />
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">Yes</Badge>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Omeprazole 20mg</TableCell>
                            <TableCell>1 capsule</TableCell>
                            <TableCell>Once daily</TableCell>
                            <TableCell>7 days</TableCell>
                            <TableCell>
                              <Input type="number" defaultValue="7" min="1" className="w-16" />
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">Yes</Badge>
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>

                      <div className="mt-4">
                        <p className="text-sm font-medium">Special Instructions</p>
                        <p className="text-sm text-muted-foreground">
                          Take Amoxicillin after meals. Avoid alcohol during the course of treatment.
                        </p>
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="text-sm font-medium">Payment Method</label>
                        <Select defaultValue="cash">
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
                        <label className="text-sm font-medium">Discount (%)</label>
                        <Input className="mt-1" type="number" placeholder="0" min="0" max="100" />
                      </div>
                    </div>

                    <div className="rounded-lg border p-4">
                      <div className="mb-4 flex items-center justify-between">
                        <span className="text-sm font-medium">Subtotal</span>
                        <span>₹450.00</span>
                      </div>
                      <div className="mb-4 flex items-center justify-between">
                        <span className="text-sm font-medium">Discount (0%)</span>
                        <span>₹0.00</span>
                      </div>
                      <Separator className="my-2" />
                      <div className="flex items-center justify-between font-bold">
                        <span>Total Amount</span>
                        <span>₹450.00</span>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button variant="outline">
                        <Printer className="mr-2 h-4 w-4" />
                        Print Bill
                      </Button>
                      <Button>
                        <Pill className="mr-2 h-4 w-4" />
                        Dispense Medicines
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Patient Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-sm text-muted-foreground">Name</p>
                        <p className="font-medium">John Doe</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">ID</p>
                        <p className="font-medium">P12345</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Age</p>
                        <p className="font-medium">45</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Gender</p>
                        <p className="font-medium">Male</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Contact</p>
                        <p className="font-medium">+91 9876543210</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Allergies</p>
                        <p className="font-medium">Penicillin</p>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <p className="text-sm font-medium">Previous Medications</p>
                      <ul className="mt-2 space-y-2">
                        <li className="rounded-md border p-2 text-sm">
                          <div className="flex items-center justify-between">
                            <span>Atorvastatin 10mg</span>
                            <span className="text-xs text-muted-foreground">2023-04-15</span>
                          </div>
                        </li>
                        <li className="rounded-md border p-2 text-sm">
                          <div className="flex items-center justify-between">
                            <span>Metformin 500mg</span>
                            <span className="text-xs text-muted-foreground">2023-03-20</span>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Medicine Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="rounded-lg border p-4">
                      <h3 className="font-medium">Amoxicillin 500mg</h3>
                      <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <p className="text-muted-foreground">Batch</p>
                          <p>AMX2023-05</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Expiry</p>
                          <p>2024-05</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">MRP</p>
                          <p>₹15.00/tablet</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Stock</p>
                          <p>120 tablets</p>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-lg border p-4">
                      <h3 className="font-medium">Paracetamol 500mg</h3>
                      <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <p className="text-muted-foreground">Batch</p>
                          <p>PCM2023-08</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Expiry</p>
                          <p>2025-01</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">MRP</p>
                          <p>₹5.00/tablet</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Stock</p>
                          <p>250 tablets</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="inventory">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Medicine Inventory</CardTitle>
                  <CardDescription>Manage pharmacy stock</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex gap-4">
                      <Input placeholder="Search medicines by name, batch, or supplier" className="flex-1" />
                      <Select defaultValue="all">
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Filter by category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Categories</SelectItem>
                          <SelectItem value="antibiotics">Antibiotics</SelectItem>
                          <SelectItem value="analgesics">Analgesics</SelectItem>
                          <SelectItem value="antacids">Antacids</SelectItem>
                          <SelectItem value="antidiabetics">Antidiabetics</SelectItem>
                          <SelectItem value="cardiovascular">Cardiovascular</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button variant="secondary">
                        <Search className="mr-2 h-4 w-4" />
                        Search
                      </Button>
                    </div>

                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Medicine</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Batch</TableHead>
                          <TableHead>Expiry</TableHead>
                          <TableHead>MRP</TableHead>
                          <TableHead>Stock</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {[
                          {
                            name: "Amoxicillin 500mg",
                            category: "Antibiotics",
                            batch: "AMX2023-05",
                            expiry: "2024-05",
                            mrp: 15,
                            stock: 120,
                            status: "In Stock",
                          },
                          {
                            name: "Paracetamol 500mg",
                            category: "Analgesics",
                            batch: "PCM2023-08",
                            expiry: "2025-01",
                            mrp: 5,
                            stock: 250,
                            status: "In Stock",
                          },
                          {
                            name: "Omeprazole 20mg",
                            category: "Antacids",
                            batch: "OMP2023-03",
                            expiry: "2024-03",
                            mrp: 12,
                            stock: 80,
                            status: "In Stock",
                          },
                          {
                            name: "Metformin 500mg",
                            category: "Antidiabetics",
                            batch: "MET2023-06",
                            expiry: "2024-06",
                            mrp: 8,
                            stock: 15,
                            status: "Low Stock",
                          },
                          {
                            name: "Atorvastatin 10mg",
                            category: "Cardiovascular",
                            batch: "ATV2023-04",
                            expiry: "2024-04",
                            mrp: 18,
                            stock: 60,
                            status: "In Stock",
                          },
                          {
                            name: "Losartan 50mg",
                            category: "Cardiovascular",
                            batch: "LOS2023-02",
                            expiry: "2023-08",
                            mrp: 14,
                            stock: 30,
                            status: "Expiring Soon",
                          },
                        ].map((medicine, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{medicine.name}</TableCell>
                            <TableCell>{medicine.category}</TableCell>
                            <TableCell>{medicine.batch}</TableCell>
                            <TableCell>{medicine.expiry}</TableCell>
                            <TableCell>₹{medicine.mrp.toFixed(2)}</TableCell>
                            <TableCell>{medicine.stock}</TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  medicine.status === "In Stock"
                                    ? "outline"
                                    : medicine.status === "Low Stock"
                                      ? "default"
                                      : "secondary"
                                }
                              >
                                {medicine.status}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>

                    <div className="flex justify-end gap-2">
                      <Button variant="outline">
                        <Download className="mr-2 h-4 w-4" />
                        Export
                      </Button>
                      <Button variant="outline">
                        <Printer className="mr-2 h-4 w-4" />
                        Print
                      </Button>
                      <Button>
                        <Package className="mr-2 h-4 w-4" />
                        Add New Stock
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Add New Stock</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Medicine Name</label>
                      <Input className="mt-1" placeholder="Enter medicine name" />
                    </div>

                    <div>
                      <label className="text-sm font-medium">Category</label>
                      <Select>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="antibiotics">Antibiotics</SelectItem>
                          <SelectItem value="analgesics">Analgesics</SelectItem>
                          <SelectItem value="antacids">Antacids</SelectItem>
                          <SelectItem value="antidiabetics">Antidiabetics</SelectItem>
                          <SelectItem value="cardiovascular">Cardiovascular</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium">Supplier</label>
                      <Select>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select supplier" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="supplier1">ABC Pharmaceuticals</SelectItem>
                          <SelectItem value="supplier2">XYZ Medical Supplies</SelectItem>
                          <SelectItem value="supplier3">PQR Healthcare</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Batch Number</label>
                        <Input className="mt-1" placeholder="Enter batch number" />
                      </div>

                      <div>
                        <label className="text-sm font-medium">Expiry Date</label>
                        <Input className="mt-1" type="month" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Quantity</label>
                        <Input className="mt-1" type="number" min="1" />
                      </div>

                      <div>
                        <label className="text-sm font-medium">MRP (₹)</label>
                        <Input className="mt-1" type="number" min="0" step="0.01" />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium">Purchase Date</label>
                      <Input className="mt-1" type="date" />
                    </div>

                    <div>
                      <label className="text-sm font-medium">Notes</label>
                      <Textarea className="mt-1" placeholder="Any additional information" />
                    </div>

                    <Button className="w-full">
                      <ShoppingBag className="mr-2 h-4 w-4" />
                      Add to Inventory
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Inventory Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Total Items</span>
                      <span className="font-bold">120</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Low Stock Items</span>
                      <span className="font-bold">8</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Expiring Soon</span>
                      <span className="font-bold">12</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Out of Stock</span>
                      <span className="font-bold">5</span>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Total Value</span>
                      <span className="font-bold">₹85,250.00</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="alerts">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Low Stock Alerts</CardTitle>
                <CardDescription>Items that need to be reordered</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Medicine</TableHead>
                      <TableHead>Current Stock</TableHead>
                      <TableHead>Reorder Level</TableHead>
                      <TableHead>Supplier</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      { name: "Metformin 500mg", stock: 15, reorder: 30, supplier: "ABC Pharmaceuticals" },
                      { name: "Amlodipine 5mg", stock: 12, reorder: 25, supplier: "XYZ Medical Supplies" },
                      { name: "Ceftriaxone 1g Injection", stock: 8, reorder: 20, supplier: "PQR Healthcare" },
                      { name: "Salbutamol Inhaler", stock: 5, reorder: 15, supplier: "ABC Pharmaceuticals" },
                    ].map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>{item.stock}</TableCell>
                        <TableCell>{item.reorder}</TableCell>
                        <TableCell>{item.supplier}</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">
                            Reorder
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Expiry Alerts</CardTitle>
                <CardDescription>Items expiring within 3 months</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Medicine</TableHead>
                      <TableHead>Batch</TableHead>
                      <TableHead>Expiry Date</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      { name: "Losartan 50mg", batch: "LOS2023-02", expiry: "2023-08", quantity: 30 },
                      { name: "Diclofenac 50mg", batch: "DIC2023-01", expiry: "2023-09", quantity: 45 },
                      { name: "Ciprofloxacin 500mg", batch: "CIP2022-12", expiry: "2023-10", quantity: 60 },
                      { name: "Ranitidine 150mg", batch: "RAN2023-03", expiry: "2023-11", quantity: 25 },
                    ].map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>{item.batch}</TableCell>
                        <TableCell>{item.expiry}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">
                            Return
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Out of Stock Items</CardTitle>
                <CardDescription>Items that are currently unavailable</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Medicine</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Last Available</TableHead>
                      <TableHead>Supplier</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      {
                        name: "Insulin Glargine",
                        category: "Antidiabetics",
                        lastAvailable: "2023-04-15",
                        supplier: "ABC Pharmaceuticals",
                      },
                      {
                        name: "Montelukast 10mg",
                        category: "Respiratory",
                        lastAvailable: "2023-04-20",
                        supplier: "XYZ Medical Supplies",
                      },
                      {
                        name: "Levothyroxine 50mcg",
                        category: "Hormones",
                        lastAvailable: "2023-04-25",
                        supplier: "PQR Healthcare",
                      },
                    ].map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>{item.category}</TableCell>
                        <TableCell>{item.lastAvailable}</TableCell>
                        <TableCell>{item.supplier}</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">
                            Order
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Fast Moving Items</CardTitle>
                <CardDescription>Items with high consumption rate</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Medicine</TableHead>
                      <TableHead>Monthly Usage</TableHead>
                      <TableHead>Current Stock</TableHead>
                      <TableHead>Days Left</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      { name: "Paracetamol 500mg", usage: 500, stock: 250, days: 15 },
                      { name: "Amoxicillin 500mg", usage: 300, stock: 120, days: 12 },
                      { name: "Omeprazole 20mg", usage: 200, stock: 80, days: 12 },
                      { name: "Atorvastatin 10mg", usage: 150, stock: 60, days: 12 },
                    ].map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>{item.usage}</TableCell>
                        <TableCell>{item.stock}</TableCell>
                        <TableCell>{item.days}</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">
                            Restock
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
