"use client"

import { useState } from "react"
import { ArrowLeft, Printer, Search, Plus, Download, Copy } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function Interdepartmental() {
  const [tab, setTab] = useState("lab")
  const [labSearchQuery, setLabSearchQuery] = useState("")
  const [radiologySearchQuery, setRadiologySearchQuery] = useState("")
  const [referralSearchQuery, setReferralSearchQuery] = useState("")
  const [documentsSearchQuery, setDocumentsSearchQuery] = useState("")
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([])
  const [mergeFormat, setMergeFormat] = useState("pdf")

  // Sample lab tests data
  const labTests = [
    {
      id: "CBC001",
      name: "Complete Blood Count (CBC)",
      department: "Hematology",
      price: 800,
      turnaround: "Same day",
      status: "Available",
    },
    {
      id: "LFT001",
      name: "Liver Function Test (LFT)",
      department: "Biochemistry",
      price: 1200,
      turnaround: "1 day",
      status: "Available",
    },
    {
      id: "KFT001",
      name: "Kidney Function Test (KFT)",
      department: "Biochemistry",
      price: 1000,
      turnaround: "1 day",
      status: "Available",
    },
    {
      id: "LP001",
      name: "Lipid Profile",
      department: "Biochemistry",
      price: 900,
      turnaround: "1 day",
      status: "Available",
    },
    {
      id: "TP001",
      name: "Thyroid Profile",
      department: "Endocrinology",
      price: 1500,
      turnaround: "2 days",
      status: "Available",
    },
    {
      id: "BG001",
      name: "Blood Glucose",
      department: "Biochemistry",
      price: 300,
      turnaround: "Same day",
      status: "Available",
    },
    { id: "HBA1C", name: "HbA1c", department: "Endocrinology", price: 800, turnaround: "1 day", status: "Available" },
    {
      id: "CRP001",
      name: "C-Reactive Protein",
      department: "Immunology",
      price: 700,
      turnaround: "1 day",
      status: "Available",
    },
    {
      id: "ESR001",
      name: "Erythrocyte Sedimentation Rate",
      department: "Hematology",
      price: 400,
      turnaround: "Same day",
      status: "Available",
    },
    {
      id: "FERR01",
      name: "Ferritin",
      department: "Biochemistry",
      price: 900,
      turnaround: "2 days",
      status: "Available",
    },
    {
      id: "VIT001",
      name: "Vitamin B12",
      department: "Biochemistry",
      price: 1200,
      turnaround: "2 days",
      status: "Available",
    },
    {
      id: "VIT002",
      name: "Vitamin D",
      department: "Biochemistry",
      price: 1500,
      turnaround: "2 days",
      status: "Available",
    },
  ]

  // Sample radiology tests data
  const radiologyTests = [
    {
      id: "XR001",
      name: "Chest X-Ray",
      type: "X-Ray",
      price: 800,
      duration: "15 min",
      preparation: "No special preparation",
      status: "Available",
    },
    {
      id: "XR002",
      name: "Abdomen X-Ray",
      type: "X-Ray",
      price: 900,
      duration: "15 min",
      preparation: "No food 4 hours prior",
      status: "Available",
    },
    {
      id: "XR003",
      name: "Skull X-Ray",
      type: "X-Ray",
      price: 1000,
      duration: "20 min",
      preparation: "No special preparation",
      status: "Available",
    },
    {
      id: "XR004",
      name: "Spine X-Ray",
      type: "X-Ray",
      price: 1200,
      duration: "20 min",
      preparation: "No special preparation",
      status: "Available",
    },
    {
      id: "US001",
      name: "Abdomen Ultrasound",
      type: "Ultrasound",
      price: 1500,
      duration: "30 min",
      preparation: "Fast for 8-12 hours",
      status: "Available",
    },
    {
      id: "US002",
      name: "Pelvis Ultrasound",
      type: "Ultrasound",
      price: 1500,
      duration: "30 min",
      preparation: "Full bladder required",
      status: "Available",
    },
    {
      id: "US003",
      name: "Thyroid Ultrasound",
      type: "Ultrasound",
      price: 1200,
      duration: "20 min",
      preparation: "No special preparation",
      status: "Available",
    },
    {
      id: "CT001",
      name: "CT Scan - Head",
      type: "CT Scan",
      price: 4500,
      duration: "30 min",
      preparation: "No metal objects",
      status: "Available",
    },
    {
      id: "CT002",
      name: "CT Scan - Chest",
      type: "CT Scan",
      price: 5000,
      duration: "30 min",
      preparation: "No metal objects",
      status: "Available",
    },
    {
      id: "CT003",
      name: "CT Scan - Abdomen",
      type: "CT Scan",
      price: 5500,
      duration: "45 min",
      preparation: "Fast for 4-6 hours",
      status: "Available",
    },
    {
      id: "MRI001",
      name: "MRI - Brain",
      type: "MRI",
      price: 8000,
      duration: "45 min",
      preparation: "No metal objects or implants",
      status: "Available",
    },
    {
      id: "MRI002",
      name: "MRI - Spine",
      type: "MRI",
      price: 8500,
      duration: "45 min",
      preparation: "No metal objects or implants",
      status: "Available",
    },
    {
      id: "MRI003",
      name: "MRI - Knee",
      type: "MRI",
      price: 7000,
      duration: "30 min",
      preparation: "No metal objects or implants",
      status: "Available",
    },
    {
      id: "MAM001",
      name: "Mammography",
      type: "Mammography",
      price: 2000,
      duration: "30 min",
      preparation: "No deodorant or powder",
      status: "Available",
    },
  ]

  // Sample referral templates data
  const referralTemplates = [
    {
      id: "REF001",
      name: "Cardiology Referral",
      specialty: "Cardiology",
      description: "For patients with heart-related issues requiring specialist consultation",
      lastUpdated: "2023-04-15",
      status: "Active",
    },
    {
      id: "REF002",
      name: "Orthopedic Referral",
      specialty: "Orthopedics",
      description: "For patients with bone, joint, and musculoskeletal issues",
      lastUpdated: "2023-04-20",
      status: "Active",
    },
    {
      id: "REF003",
      name: "Neurology Referral",
      specialty: "Neurology",
      description: "For patients with neurological disorders requiring specialist evaluation",
      lastUpdated: "2023-04-10",
      status: "Active",
    },
    {
      id: "REF004",
      name: "Gastroenterology Referral",
      specialty: "Gastroenterology",
      description: "For patients with digestive system disorders",
      lastUpdated: "2023-04-05",
      status: "Active",
    },
    {
      id: "REF005",
      name: "Endocrinology Referral",
      specialty: "Endocrinology",
      description: "For patients with hormonal and metabolic disorders",
      lastUpdated: "2023-04-12",
      status: "Active",
    },
    {
      id: "REF006",
      name: "Oncology Referral",
      specialty: "Oncology",
      description: "For patients requiring cancer evaluation and treatment",
      lastUpdated: "2023-04-18",
      status: "Active",
    },
    {
      id: "REF007",
      name: "Dermatology Referral",
      specialty: "Dermatology",
      description: "For patients with skin conditions requiring specialist care",
      lastUpdated: "2023-04-22",
      status: "Active",
    },
    {
      id: "REF008",
      name: "Ophthalmology Referral",
      specialty: "Ophthalmology",
      description: "For patients with eye disorders requiring specialist evaluation",
      lastUpdated: "2023-04-25",
      status: "Active",
    },
    {
      id: "REF009",
      name: "ENT Referral",
      specialty: "ENT",
      description: "For patients with ear, nose, and throat conditions",
      lastUpdated: "2023-04-28",
      status: "Active",
    },
    {
      id: "REF010",
      name: "Psychiatry Referral",
      specialty: "Psychiatry",
      description: "For patients requiring mental health evaluation and treatment",
      lastUpdated: "2023-04-30",
      status: "Active",
    },
    {
      id: "REF011",
      name: "Urology Referral",
      specialty: "Urology",
      description: "For patients with urinary tract and reproductive system issues",
      lastUpdated: "2023-05-02",
      status: "Active",
    },
    {
      id: "REF012",
      name: "Nephrology Referral",
      specialty: "Nephrology",
      description: "For patients with kidney disorders requiring specialist care",
      lastUpdated: "2023-05-05",
      status: "Active",
    },
  ]

  // Sample documents data
  const documents = [
    {
      id: "DOC001",
      name: "Lab Report - CBC",
      patient: "John Doe",
      patientId: "P12345",
      type: "Lab Report",
      department: "Hematology",
      date: "2023-05-01",
      size: "1.2 MB",
      format: "PDF",
    },
    {
      id: "DOC002",
      name: "X-Ray Report - Chest",
      patient: "John Doe",
      patientId: "P12345",
      type: "Radiology Report",
      department: "Radiology",
      date: "2023-05-01",
      size: "3.5 MB",
      format: "PDF",
    },
    {
      id: "DOC003",
      name: "Consultation Notes",
      patient: "John Doe",
      patientId: "P12345",
      type: "Clinical Notes",
      department: "General Medicine",
      date: "2023-05-02",
      size: "0.5 MB",
      format: "PDF",
    },
    {
      id: "DOC004",
      name: "Prescription",
      patient: "John Doe",
      patientId: "P12345",
      type: "Prescription",
      department: "General Medicine",
      date: "2023-05-02",
      size: "0.3 MB",
      format: "PDF",
    },
    {
      id: "DOC005",
      name: "Lab Report - LFT",
      patient: "Jane Smith",
      patientId: "P12346",
      type: "Lab Report",
      department: "Biochemistry",
      date: "2023-05-03",
      size: "1.1 MB",
      format: "PDF",
    },
    {
      id: "DOC006",
      name: "MRI Report - Brain",
      patient: "Jane Smith",
      patientId: "P12346",
      type: "Radiology Report",
      department: "Radiology",
      date: "2023-05-03",
      size: "5.2 MB",
      format: "PDF",
    },
    {
      id: "DOC007",
      name: "Cardiology Consultation",
      patient: "Jane Smith",
      patientId: "P12346",
      type: "Clinical Notes",
      department: "Cardiology",
      date: "2023-05-04",
      size: "0.7 MB",
      format: "PDF",
    },
    {
      id: "DOC008",
      name: "ECG Report",
      patient: "Jane Smith",
      patientId: "P12346",
      type: "Diagnostic Report",
      department: "Cardiology",
      date: "2023-05-04",
      size: "1.8 MB",
      format: "PDF",
    },
    {
      id: "DOC009",
      name: "Discharge Summary",
      patient: "Robert Brown",
      patientId: "P12347",
      type: "Summary",
      department: "Orthopedics",
      date: "2023-05-05",
      size: "2.3 MB",
      format: "PDF",
    },
    {
      id: "DOC010",
      name: "Physical Therapy Plan",
      patient: "Robert Brown",
      patientId: "P12347",
      type: "Treatment Plan",
      department: "Physiotherapy",
      date: "2023-05-06",
      size: "1.5 MB",
      format: "PDF",
    },
    {
      id: "DOC011",
      name: "X-Ray Report - Knee",
      patient: "Robert Brown",
      patientId: "P12347",
      type: "Radiology Report",
      department: "Radiology",
      date: "2023-05-05",
      size: "2.8 MB",
      format: "PDF",
    },
    {
      id: "DOC012",
      name: "Lab Report - ESR",
      patient: "Robert Brown",
      patientId: "P12347",
      type: "Lab Report",
      department: "Hematology",
      date: "2023-05-05",
      size: "0.9 MB",
      format: "PDF",
    },
  ]

  // Filter lab tests based on search query
  const filteredLabTests = labTests.filter(
    (test) =>
      test.name.toLowerCase().includes(labSearchQuery.toLowerCase()) ||
      test.id.toLowerCase().includes(labSearchQuery.toLowerCase()) ||
      test.department.toLowerCase().includes(labSearchQuery.toLowerCase()),
  )

  // Filter radiology tests based on search query
  const filteredRadiologyTests = radiologyTests.filter(
    (test) =>
      test.name.toLowerCase().includes(radiologySearchQuery.toLowerCase()) ||
      test.id.toLowerCase().includes(radiologySearchQuery.toLowerCase()) ||
      test.type.toLowerCase().includes(radiologySearchQuery.toLowerCase()),
  )

  // Filter referral templates based on search query
  const filteredReferralTemplates = referralTemplates.filter(
    (template) =>
      template.name.toLowerCase().includes(referralSearchQuery.toLowerCase()) ||
      template.id.toLowerCase().includes(referralSearchQuery.toLowerCase()) ||
      template.specialty.toLowerCase().includes(referralSearchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(referralSearchQuery.toLowerCase()),
  )

  // Filter documents based on search query
  const filteredDocuments = documents.filter(
    (doc) =>
      doc.name.toLowerCase().includes(documentsSearchQuery.toLowerCase()) ||
      doc.id.toLowerCase().includes(documentsSearchQuery.toLowerCase()) ||
      doc.patient.toLowerCase().includes(documentsSearchQuery.toLowerCase()) ||
      doc.patientId.toLowerCase().includes(documentsSearchQuery.toLowerCase()) ||
      doc.type.toLowerCase().includes(documentsSearchQuery.toLowerCase()) ||
      doc.department.toLowerCase().includes(documentsSearchQuery.toLowerCase()),
  )

  // Handle document selection
  const toggleDocumentSelection = (documentId: string) => {
    if (selectedDocuments.includes(documentId)) {
      setSelectedDocuments(selectedDocuments.filter((id) => id !== documentId))
    } else {
      setSelectedDocuments([...selectedDocuments, documentId])
    }
  }

  // Get selected document details
  const getSelectedDocuments = () => {
    return documents.filter((doc) => selectedDocuments.includes(doc.id))
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6 flex items-center">
        <Button variant="ghost" size="icon" asChild className="mr-2">
          <Link href="/">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Interdepartmental Coordination</h1>
      </div>

      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="lab">Lab Tests</TabsTrigger>
          <TabsTrigger value="radiology">Radiology</TabsTrigger>
          <TabsTrigger value="referral">Referrals</TabsTrigger>
        </TabsList>

        <TabsContent value="lab">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Lab Tests</CardTitle>
                <CardDescription>Available diagnostic tests</CardDescription>
              </div>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Book Lab Tests
              </Button>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search tests by name, code or department..."
                    className="pl-8"
                    value={labSearchQuery}
                    onChange={(e) => setLabSearchQuery(e.target.value)}
                  />
                </div>
                <Select defaultValue="all">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    <SelectItem value="hematology">Hematology</SelectItem>
                    <SelectItem value="biochemistry">Biochemistry</SelectItem>
                    <SelectItem value="microbiology">Microbiology</SelectItem>
                    <SelectItem value="immunology">Immunology</SelectItem>
                    <SelectItem value="endocrinology">Endocrinology</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Test Code</TableHead>
                      <TableHead>Test Name</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Price (₹)</TableHead>
                      <TableHead>Turnaround Time</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLabTests.map((test) => (
                      <TableRow key={test.id}>
                        <TableCell className="font-medium">{test.id}</TableCell>
                        <TableCell>{test.name}</TableCell>
                        <TableCell>{test.department}</TableCell>
                        <TableCell>{test.price}</TableCell>
                        <TableCell>{test.turnaround}</TableCell>
                        <TableCell>
                          <Badge variant={test.status === "Available" ? "outline" : "secondary"}>{test.status}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm">
                            Book
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="text-sm text-muted-foreground">
                Showing {filteredLabTests.length} of {labTests.length} tests
              </div>
              <Button variant="outline" size="sm">
                <Printer className="mr-2 h-4 w-4" />
                Print Test List
              </Button>
            </CardFooter>
          </Card>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Test Packages</CardTitle>
                <CardDescription>Common test packages</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "Basic Health Checkup", tests: "CBC, Blood Glucose, Urine Routine", price: 1200 },
                    {
                      name: "Comprehensive Health Package",
                      tests: "CBC, LFT, KFT, Lipid Profile, Thyroid",
                      price: 4500,
                    },
                    { name: "Diabetes Package", tests: "FBS, PPBS, HbA1c, Urine Microalbumin", price: 2000 },
                    { name: "Cardiac Risk Assessment", tests: "Lipid Profile, ECG, Cardiac Markers", price: 3000 },
                  ].map((pkg, index) => (
                    <div key={index} className="rounded-lg border p-4">
                      <div className="mb-2 flex items-center justify-between">
                        <h3 className="font-medium">{pkg.name}</h3>
                        <Badge variant="outline">₹{pkg.price}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{pkg.tests}</p>
                      <Button variant="outline" size="sm" className="mt-2 w-full">
                        Select Package
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Lab Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { patient: "John Doe", tests: "CBC, LFT", date: "2023-05-01", status: "Completed" },
                    { patient: "Jane Smith", tests: "Thyroid Profile", date: "2023-05-02", status: "Pending" },
                    { patient: "Robert Brown", tests: "Lipid Profile", date: "2023-05-03", status: "In Process" },
                    {
                      patient: "Emily Johnson",
                      tests: "Vitamin B12, Vitamin D",
                      date: "2023-05-04",
                      status: "Pending",
                    },
                    { patient: "Michael Wilson", tests: "Diabetes Package", date: "2023-05-05", status: "Completed" },
                  ].map((order, index) => (
                    <div key={index} className="flex items-center justify-between rounded-lg border p-3">
                      <div className="flex flex-col">
                        <span className="font-medium">{order.patient}</span>
                        <span className="text-xs text-muted-foreground">{order.tests}</span>
                      </div>
                      <div className="flex flex-col items-end">
                        <Badge
                          variant={
                            order.status === "Completed"
                              ? "outline"
                              : order.status === "Pending"
                                ? "secondary"
                                : "default"
                          }
                        >
                          {order.status}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{order.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="radiology">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Radiology/Imaging Tests</CardTitle>
                <CardDescription>Available imaging procedures</CardDescription>
              </div>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Book Imaging
              </Button>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search tests by name, code or type..."
                    className="pl-8"
                    value={radiologySearchQuery}
                    onChange={(e) => setRadiologySearchQuery(e.target.value)}
                  />
                </div>
                <Select defaultValue="all">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="x-ray">X-Ray</SelectItem>
                    <SelectItem value="ultrasound">Ultrasound</SelectItem>
                    <SelectItem value="ct">CT Scan</SelectItem>
                    <SelectItem value="mri">MRI</SelectItem>
                    <SelectItem value="mammography">Mammography</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Test Code</TableHead>
                      <TableHead>Test Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Price (₹)</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRadiologyTests.map((test) => (
                      <TableRow key={test.id}>
                        <TableCell className="font-medium">{test.id}</TableCell>
                        <TableCell>{test.name}</TableCell>
                        <TableCell>{test.type}</TableCell>
                        <TableCell>{test.price}</TableCell>
                        <TableCell>{test.duration}</TableCell>
                        <TableCell>
                          <Badge variant={test.status === "Available" ? "outline" : "secondary"}>{test.status}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm">
                            Book
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="text-sm text-muted-foreground">
                Showing {filteredRadiologyTests.length} of {radiologyTests.length} tests
              </div>
              <Button variant="outline" size="sm">
                <Printer className="mr-2 h-4 w-4" />
                Print Test List
              </Button>
            </CardFooter>
          </Card>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Preparation Instructions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="rounded-lg border p-4">
                    <h3 className="mb-2 font-medium">CT Scan</h3>
                    <ul className="ml-4 list-disc space-y-1 text-sm text-muted-foreground">
                      <li>Fast for 4-6 hours before the scan</li>
                      <li>Wear comfortable, loose-fitting clothes</li>
                      <li>Remove all metal objects</li>
                      <li>Inform if pregnant or have allergies</li>
                    </ul>
                  </div>
                  <div className="rounded-lg border p-4">
                    <h3 className="mb-2 font-medium">MRI</h3>
                    <ul className="ml-4 list-disc space-y-1 text-sm text-muted-foreground">
                      <li>No special preparation needed</li>
                      <li>Remove all metal objects</li>
                      <li>Inform if claustrophobic</li>
                      <li>Inform if have any implants</li>
                    </ul>
                  </div>
                  <div className="rounded-lg border p-4">
                    <h3 className="mb-2 font-medium">Ultrasound</h3>
                    <ul className="ml-4 list-disc space-y-1 text-sm text-muted-foreground">
                      <li>For abdominal ultrasound, fast for 8-12 hours</li>
                      <li>For pelvic ultrasound, drink water and have a full bladder</li>
                      <li>Wear comfortable, loose-fitting clothes</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Imaging Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { patient: "John Doe", test: "Chest X-Ray", date: "2023-05-01", status: "Completed" },
                    { patient: "Jane Smith", test: "Abdomen Ultrasound", date: "2023-05-02", status: "Scheduled" },
                    { patient: "Robert Brown", test: "CT Scan - Head", date: "2023-05-03", status: "Pending" },
                    { patient: "Emily Johnson", test: "MRI - Knee", date: "2023-05-04", status: "Scheduled" },
                    { patient: "Michael Wilson", test: "Mammography", date: "2023-05-05", status: "Completed" },
                  ].map((order, index) => (
                    <div key={index} className="flex items-center justify-between rounded-lg border p-3">
                      <div className="flex flex-col">
                        <span className="font-medium">{order.patient}</span>
                        <span className="text-xs text-muted-foreground">{order.test}</span>
                      </div>
                      <div className="flex flex-col items-end">
                        <Badge
                          variant={
                            order.status === "Completed"
                              ? "outline"
                              : order.status === "Scheduled"
                                ? "secondary"
                                : "default"
                          }
                        >
                          {order.status}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{order.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="referral">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Referral Templates</CardTitle>
                <CardDescription>Available referral templates for different specialties</CardDescription>
              </div>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Generate Referral
              </Button>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search templates by name, specialty or description..."
                    className="pl-8"
                    value={referralSearchQuery}
                    onChange={(e) => setReferralSearchQuery(e.target.value)}
                  />
                </div>
                <Select defaultValue="all">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by specialty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Specialties</SelectItem>
                    <SelectItem value="cardiology">Cardiology</SelectItem>
                    <SelectItem value="orthopedics">Orthopedics</SelectItem>
                    <SelectItem value="neurology">Neurology</SelectItem>
                    <SelectItem value="gastroenterology">Gastroenterology</SelectItem>
                    <SelectItem value="endocrinology">Endocrinology</SelectItem>
                    <SelectItem value="oncology">Oncology</SelectItem>
                    <SelectItem value="dermatology">Dermatology</SelectItem>
                    <SelectItem value="ophthalmology">Ophthalmology</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Template ID</TableHead>
                      <TableHead>Template Name</TableHead>
                      <TableHead>Specialty</TableHead>
                      <TableHead>Last Updated</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredReferralTemplates.map((template) => (
                      <TableRow key={template.id}>
                        <TableCell className="font-medium">{template.id}</TableCell>
                        <TableCell>{template.name}</TableCell>
                        <TableCell>{template.specialty}</TableCell>
                        <TableCell>{template.lastUpdated}</TableCell>
                        <TableCell>
                          <Badge variant={template.status === "Active" ? "outline" : "secondary"}>
                            {template.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm">
                              <Copy className="mr-2 h-3 w-3" />
                              Use
                            </Button>
                            <Button variant="outline" size="sm">
                              <Download className="mr-2 h-3 w-3" />
                              Download
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="text-sm text-muted-foreground">
                Showing {filteredReferralTemplates.length} of {referralTemplates.length} templates
              </div>
              <Button variant="outline" size="sm">
                <Printer className="mr-2 h-4 w-4" />
                Print Template List
              </Button>
            </CardFooter>
          </Card>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Template Preview</CardTitle>
                <CardDescription>Select a template above to preview</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border p-6">
                  <div className="mb-6 text-center">
                    <h3 className="text-xl font-bold">City Hospital</h3>
                    <p className="text-sm text-muted-foreground">123 Medical Center Blvd, City, State 12345</p>
                    <p className="text-sm text-muted-foreground">Phone: (123) 456-7890 | Fax: (123) 456-7891</p>
                  </div>

                  <div className="mb-6 text-center">
                    <h4 className="text-lg font-semibold">MEDICAL REFERRAL FORM</h4>
                    <p className="text-sm font-medium">Cardiology Department</p>
                  </div>

                  <div className="mb-4 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium">Patient Information:</p>
                      <p className="text-sm">Name: ____________________</p>
                      <p className="text-sm">DOB: ____________________</p>
                      <p className="text-sm">MRN: ____________________</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Referring Physician:</p>
                      <p className="text-sm">Name: ____________________</p>
                      <p className="text-sm">Contact: ____________________</p>
                      <p className="text-sm">Date: ____________________</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm font-medium">Reason for Referral:</p>
                    <div className="mt-1 h-20 rounded-md border p-2 text-sm text-muted-foreground">
                      Patient presenting with symptoms requiring cardiology evaluation...
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm font-medium">Clinical Information:</p>
                    <div className="mt-1 h-20 rounded-md border p-2 text-sm text-muted-foreground">
                      Relevant medical history, current medications, allergies, and recent test results...
                    </div>
                  </div>

                  <div className="mb-4 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium">Urgency:</p>
                      <div className="mt-1 flex gap-4">
                        <div className="flex items-center gap-1">
                          <div className="h-3 w-3 rounded-full border"></div>
                          <span className="text-sm">Routine</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="h-3 w-3 rounded-full border"></div>
                          <span className="text-sm">Urgent</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="h-3 w-3 rounded-full border"></div>
                          <span className="text-sm">Emergency</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Attachments:</p>
                      <div className="mt-1 flex gap-4">
                        <div className="flex items-center gap-1">
                          <div className="h-3 w-3 rounded border"></div>
                          <span className="text-sm">Lab Reports</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="h-3 w-3 rounded border"></div>
                          <span className="text-sm">Imaging</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="h-3 w-3 rounded border"></div>
                          <span className="text-sm">Other</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 border-t pt-4 text-center">
                    <p className="text-xs text-muted-foreground">
                      This referral is valid for 30 days from the date of issue. Please contact our referral coordinator
                      at (123) 456-7890 for any questions.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Referrals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { patient: "John Doe", to: "City Hospital", date: "2023-05-01", type: "Cardiology" },
                    { patient: "Jane Smith", to: "Dr. Johnson", date: "2023-05-02", type: "Neurology" },
                    { patient: "Robert Brown", to: "Metro Diagnostics", date: "2023-05-03", type: "Orthopedics" },
                    { patient: "Emily Johnson", to: "Dr. Williams", date: "2023-05-04", type: "Gastroenterology" },
                    { patient: "Michael Wilson", to: "University Hospital", date: "2023-05-05", type: "Oncology" },
                  ].map((referral, index) => (
                    <div key={index} className="flex items-center justify-between rounded-lg border p-3">
                      <div className="flex flex-col">
                        <span className="font-medium">{referral.patient}</span>
                        <span className="text-xs text-muted-foreground">To: {referral.to}</span>
                      </div>
                      <div className="flex flex-col items-end">
                        <Badge variant="outline">{referral.type}</Badge>
                        <span className="text-xs text-muted-foreground">{referral.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full">
                  View All Referrals
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
