"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { FileText, Clock, CheckCircle2, AlertTriangle, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock data for test results
const mockLabResults = [
  {
    id: "lab-001",
    type: "lab",
    name: "Complete Blood Count",
    date: "2023-05-15",
    doctor: "Dr. Sharma",
    status: "Completed",
    abnormal: false,
    parameters: [
      { name: "Hemoglobin", value: "14.2", unit: "g/dL", range: "13.5-17.5", abnormal: false },
      { name: "WBC", value: "7.5", unit: "10^3/µL", range: "4.5-11.0", abnormal: false },
      { name: "RBC", value: "5.2", unit: "10^6/µL", range: "4.5-5.9", abnormal: false },
      { name: "Platelets", value: "250", unit: "10^3/µL", range: "150-450", abnormal: false },
      { name: "Hematocrit", value: "42", unit: "%", range: "41-50", abnormal: false },
    ],
    summary: "All parameters within normal range. No significant abnormalities detected.",
  },
  {
    id: "lab-002",
    type: "lab",
    name: "Lipid Profile",
    date: "2023-05-10",
    doctor: "Dr. Gupta",
    status: "Completed",
    abnormal: true,
    parameters: [
      { name: "Total Cholesterol", value: "220", unit: "mg/dL", range: "<200", abnormal: true },
      { name: "LDL", value: "145", unit: "mg/dL", range: "<100", abnormal: true },
      { name: "HDL", value: "45", unit: "mg/dL", range: ">40", abnormal: false },
      { name: "Triglycerides", value: "160", unit: "mg/dL", range: "<150", abnormal: true },
    ],
    summary:
      "Elevated cholesterol levels. LDL and triglycerides above normal range. Dietary modifications recommended.",
  },
  {
    id: "lab-003",
    type: "lab",
    name: "Liver Function Test",
    date: "2023-04-28",
    doctor: "Dr. Sharma",
    status: "Completed",
    abnormal: false,
    parameters: [
      { name: "ALT", value: "25", unit: "U/L", range: "7-55", abnormal: false },
      { name: "AST", value: "22", unit: "U/L", range: "8-48", abnormal: false },
      { name: "ALP", value: "68", unit: "U/L", range: "45-115", abnormal: false },
      { name: "Bilirubin Total", value: "0.8", unit: "mg/dL", range: "0.1-1.2", abnormal: false },
    ],
    summary: "Liver function parameters within normal limits.",
  },
]

const mockRadiologyResults = [
  {
    id: "rad-001",
    type: "radiology",
    name: "Chest X-Ray",
    date: "2023-05-12",
    doctor: "Dr. Patel",
    status: "Completed",
    abnormal: false,
    findings:
      "Clear lung fields. No evidence of consolidation, effusion, or pneumothorax. Heart size within normal limits. No bony abnormalities.",
    impression: "Normal chest radiograph.",
    imageUrl: "/placeholder.svg?height=300&width=400",
  },
  {
    id: "rad-002",
    type: "radiology",
    name: "MRI Lumbar Spine",
    date: "2023-04-20",
    doctor: "Dr. Singh",
    status: "Completed",
    abnormal: true,
    findings:
      "L4-L5 disc shows moderate posterior bulge with mild compression of the thecal sac. Mild facet arthropathy. No significant foraminal stenosis.",
    impression: "Moderate L4-L5 disc bulge with mild thecal sac compression.",
    imageUrl: "/placeholder.svg?height=300&width=400",
  },
  {
    id: "rad-003",
    type: "radiology",
    name: "Ultrasound Abdomen",
    date: "2023-03-15",
    doctor: "Dr. Kumar",
    status: "Completed",
    abnormal: false,
    findings:
      "Liver normal in size and echotexture. No focal lesions. Gallbladder, pancreas, and spleen appear normal. No free fluid in the abdomen.",
    impression: "Normal abdominal ultrasound study.",
    imageUrl: "/placeholder.svg?height=300&width=400",
  },
]

// Combine all results
const allResults = [...mockLabResults, ...mockRadiologyResults].sort(
  (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
)

interface TestResultsSectionProps {
  patientId?: string
}

export function TestResultsSection({ patientId }: TestResultsSectionProps) {
  const [activeTab, setActiveTab] = useState<"all" | "lab" | "radiology">("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [timeFilter, setTimeFilter] = useState<"all" | "recent" | "month" | "year">("recent")
  const [selectedResult, setSelectedResult] = useState<any>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)

  // Filter results based on search term, type, and time
  const filteredResults = allResults.filter((result) => {
    // Filter by search term
    const matchesSearch =
      result.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.doctor.toLowerCase().includes(searchTerm.toLowerCase())

    // Filter by type
    const matchesType = activeTab === "all" || result.type === activeTab

    // Filter by time
    let matchesTime = true
    const resultDate = new Date(result.date)
    const now = new Date()

    if (timeFilter === "recent") {
      // Last 30 days
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(now.getDate() - 30)
      matchesTime = resultDate >= thirtyDaysAgo
    } else if (timeFilter === "month") {
      // Current month
      matchesTime = resultDate.getMonth() === now.getMonth() && resultDate.getFullYear() === now.getFullYear()
    } else if (timeFilter === "year") {
      // Current year
      matchesTime = resultDate.getFullYear() === now.getFullYear()
    }

    return matchesSearch && matchesType && matchesTime
  })

  const viewResultDetail = (result: any) => {
    setSelectedResult(result)
    setShowDetailModal(true)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Test Results</h3>
        <div className="flex items-center gap-2">
          <Select value={timeFilter} onValueChange={(value: any) => setTimeFilter(value)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Time Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Last 30 Days</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search test results..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <Tabs value={activeTab} onValueChange={(value: any) => setActiveTab(value)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All Results</TabsTrigger>
          <TabsTrigger value="lab">Lab Tests</TabsTrigger>
          <TabsTrigger value="radiology">Radiology</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-4">
          {filteredResults.length > 0 ? (
            <div className="space-y-3">
              {filteredResults.map((result) => (
                <Card
                  key={result.id}
                  className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => viewResultDetail(result)}
                >
                  <CardHeader className="py-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-base flex items-center gap-2">
                          {result.name}
                          {result.abnormal && (
                            <Badge variant="destructive" className="text-xs">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              Abnormal
                            </Badge>
                          )}
                        </CardTitle>
                        <div className="text-sm text-muted-foreground mt-1">
                          {result.date} • {result.doctor}
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className={
                          result.status === "Completed"
                            ? "bg-green-50 text-green-700 border-green-200"
                            : "bg-blue-50 text-blue-700 border-blue-200"
                        }
                      >
                        {result.status === "Completed" ? (
                          <CheckCircle2 className="mr-1 h-3 w-3" />
                        ) : (
                          <Clock className="mr-1 h-3 w-3" />
                        )}
                        {result.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="py-0 pb-3">
                    <div className="text-sm">
                      {result.type === "lab" ? (
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-blue-500" />
                          <span>
                            {result.parameters.filter((p: any) => p.abnormal).length > 0
                              ? `${result.parameters.filter((p: any) => p.abnormal).length} abnormal parameters`
                              : "All parameters normal"}
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-green-500" />
                          <span className="line-clamp-1">{result.impression}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">No test results found matching your criteria.</div>
          )}
        </TabsContent>
      </Tabs>

      {/* Detail Modal */}
      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>{selectedResult?.name}</span>
              <Badge
                variant={selectedResult?.abnormal ? "destructive" : "outline"}
                className={selectedResult?.abnormal ? "" : "bg-green-50 text-green-700"}
              >
                {selectedResult?.abnormal ? "Abnormal Results" : "Normal Results"}
              </Badge>
            </DialogTitle>
          </DialogHeader>

          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Date</p>
                  <p className="font-medium">{selectedResult?.date}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Doctor</p>
                  <p className="font-medium">{selectedResult?.doctor}</p>
                </div>
              </div>

              <Separator />

              {selectedResult?.type === "lab" ? (
                <div className="space-y-4">
                  <h4 className="font-medium">Test Parameters</h4>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Parameter</TableHead>
                        <TableHead>Result</TableHead>
                        <TableHead>Unit</TableHead>
                        <TableHead>Reference Range</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedResult?.parameters.map((param: any, index: number) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{param.name}</TableCell>
                          <TableCell>{param.value}</TableCell>
                          <TableCell>{param.unit}</TableCell>
                          <TableCell>{param.range}</TableCell>
                          <TableCell>
                            <Badge
                              variant={param.abnormal ? "destructive" : "outline"}
                              className={param.abnormal ? "" : "bg-green-50 text-green-700"}
                            >
                              {param.abnormal ? "Abnormal" : "Normal"}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  <div>
                    <h4 className="font-medium mb-2">Summary</h4>
                    <p className="text-sm">{selectedResult?.summary}</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Findings</h4>
                    <p className="text-sm">{selectedResult?.findings}</p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Impression</h4>
                    <p className="text-sm">{selectedResult?.impression}</p>
                  </div>

                  {selectedResult?.imageUrl && (
                    <div>
                      <h4 className="font-medium mb-2">Images</h4>
                      <div className="border rounded-md overflow-hidden">
                        <img
                          src={selectedResult.imageUrl || "/placeholder.svg"}
                          alt={selectedResult.name}
                          className="w-full h-auto object-contain"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="flex justify-end mt-4">
            <Button variant="outline" onClick={() => setShowDetailModal(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
