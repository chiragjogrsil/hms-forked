"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Camera, Clock, CheckCircle, AlertCircle, Zap, FileImage } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Radiology-specific imaging data
const imagingStudies = [
  {
    id: "RAD001",
    patientName: "Mike Wilson",
    patientId: "P003",
    age: 28,
    studyName: "Chest X-Ray",
    studyCode: "CXR",
    modality: "X-Ray",
    bodyPart: "Chest",
    prescribedBy: "Dr. Brown",
    prescribedDate: "2024-01-14",
    priority: "Routine",
    status: "Scheduled",
    scheduledDate: "2024-01-16",
    scheduledTime: "10:00 AM",
    estimatedDuration: "15 mins",
    contrast: false,
    preparation: "Remove all metal objects",
    notes: "Follow-up for pneumonia",
  },
  {
    id: "RAD002",
    patientName: "Sarah Davis",
    patientId: "P004",
    age: 55,
    studyName: "Brain MRI",
    studyCode: "MRI-BRAIN",
    modality: "MRI",
    bodyPart: "Brain",
    prescribedBy: "Dr. Wilson",
    prescribedDate: "2024-01-15",
    priority: "Urgent",
    status: "In Progress",
    scheduledDate: "2024-01-15",
    scheduledTime: "2:00 PM",
    estimatedDuration: "60 mins",
    contrast: true,
    contrastType: "Gadolinium",
    technician: "MRI Tech Johnson",
    preparation: "Remove all metal objects, inform about claustrophobia",
    notes: "Investigate headaches and dizziness",
  },
  {
    id: "RAD003",
    patientName: "Robert Brown",
    patientId: "P005",
    age: 38,
    studyName: "Abdominal CT",
    studyCode: "CT-ABD",
    modality: "CT Scan",
    bodyPart: "Abdomen",
    prescribedBy: "Dr. Davis",
    prescribedDate: "2024-01-15",
    priority: "Urgent",
    status: "Completed",
    scheduledDate: "2024-01-15",
    scheduledTime: "11:30 AM",
    completedDate: "2024-01-15",
    completedTime: "12:15 PM",
    estimatedDuration: "30 mins",
    contrast: true,
    contrastType: "Iodine",
    technician: "CT Tech Patel",
    radiologist: "Dr. Kumar",
    preparation: "Fast for 4 hours, drink contrast solution",
    notes: "Abdominal pain evaluation",
  },
  {
    id: "RAD004",
    patientName: "Lisa Anderson",
    patientId: "P006",
    age: 42,
    studyName: "Pelvic Ultrasound",
    studyCode: "US-PELV",
    modality: "Ultrasound",
    bodyPart: "Pelvis",
    prescribedBy: "Dr. Martinez",
    prescribedDate: "2024-01-14",
    priority: "Routine",
    status: "Ready for Review",
    scheduledDate: "2024-01-15",
    scheduledTime: "9:00 AM",
    completedDate: "2024-01-15",
    completedTime: "9:30 AM",
    estimatedDuration: "30 mins",
    contrast: false,
    technician: "US Tech Singh",
    preparation: "Full bladder required",
    notes: "Routine gynecological examination",
  },
  {
    id: "RAD005",
    patientName: "David Garcia",
    patientId: "P007",
    age: 35,
    studyName: "Knee MRI",
    studyCode: "MRI-KNEE",
    modality: "MRI",
    bodyPart: "Knee",
    prescribedBy: "Dr. Thompson",
    prescribedDate: "2024-01-15",
    priority: "Routine",
    status: "Scheduled",
    scheduledDate: "2024-01-16",
    scheduledTime: "3:00 PM",
    estimatedDuration: "45 mins",
    contrast: false,
    preparation: "Remove all metal objects",
    notes: "Sports injury evaluation",
  },
]

export default function RadiologyServicesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [modalityFilter, setModalityFilter] = useState("all")
  const [activeTab, setActiveTab] = useState("all")
  const { toast } = useToast()

  // Filter studies based on search and filters
  const filteredStudies = imagingStudies.filter((study) => {
    const matchesSearch =
      study.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      study.studyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      study.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      study.studyCode.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus =
      statusFilter === "all" || study.status.toLowerCase().replace(" ", "") === statusFilter.toLowerCase()
    const matchesPriority = priorityFilter === "all" || study.priority.toLowerCase() === priorityFilter.toLowerCase()
    const matchesModality = modalityFilter === "all" || study.modality === modalityFilter
    const matchesTab = activeTab === "all" || study.status.toLowerCase().replace(" ", "") === activeTab.toLowerCase()

    return matchesSearch && matchesStatus && matchesPriority && matchesModality && matchesTab
  })

  // Get counts for overview cards
  const scheduledCount = imagingStudies.filter((study) => study.status === "Scheduled").length
  const inProgressCount = imagingStudies.filter((study) => study.status === "In Progress").length
  const completedCount = imagingStudies.filter((study) => study.status === "Completed").length
  const readyForReviewCount = imagingStudies.filter((study) => study.status === "Ready for Review").length

  const handleStartStudy = (studyId: string, studyName: string, patientName: string) => {
    toast({
      title: "Study Started",
      description: `${studyName} for ${patientName} has been started.`,
      duration: 4000,
    })
  }

  const handleCompleteStudy = (studyId: string, studyName: string, patientName: string) => {
    toast({
      title: "Study Completed",
      description: `${studyName} for ${patientName} has been completed. Images are ready for review.`,
      duration: 4000,
    })
  }

  const handleViewImages = (studyId: string, studyName: string, patientName: string) => {
    toast({
      title: "View Images",
      description: `Opening DICOM viewer for ${studyName} - ${patientName}`,
      duration: 3000,
    })
  }

  const handleSendToRadiologist = (studyId: string, studyName: string, patientName: string) => {
    toast({
      title: "Sent to Radiologist",
      description: `${studyName} for ${patientName} has been sent to radiologist for interpretation.`,
      duration: 4000,
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Scheduled":
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            <Clock className="w-3 h-3 mr-1" />
            Scheduled
          </Badge>
        )
      case "In Progress":
        return (
          <Badge variant="secondary" className="bg-orange-100 text-orange-800">
            <Zap className="w-3 h-3 mr-1" />
            In Progress
          </Badge>
        )
      case "Completed":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Completed
          </Badge>
        )
      case "Ready for Review":
        return (
          <Badge variant="secondary" className="bg-purple-100 text-purple-800">
            <FileImage className="w-3 h-3 mr-1" />
            Ready for Review
          </Badge>
        )
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getPriorityBadge = (priority: string) => {
    return priority === "Urgent" ? (
      <Badge variant="destructive" className="bg-red-100 text-red-800">
        <AlertCircle className="w-3 h-3 mr-1" />
        Urgent
      </Badge>
    ) : (
      <Badge variant="outline">Routine</Badge>
    )
  }

  const getActionButton = (study: any) => {
    switch (study.status) {
      case "Scheduled":
        return (
          <Button
            size="sm"
            onClick={() => handleStartStudy(study.id, study.studyName, study.patientName)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Start Study
          </Button>
        )
      case "In Progress":
        return (
          <Button
            size="sm"
            onClick={() => handleCompleteStudy(study.id, study.studyName, study.patientName)}
            className="bg-green-600 hover:bg-green-700"
          >
            Complete
          </Button>
        )
      case "Completed":
        return (
          <Button
            size="sm"
            onClick={() => handleSendToRadiologist(study.id, study.studyName, study.patientName)}
            className="bg-purple-600 hover:bg-purple-700"
          >
            Send to Radiologist
          </Button>
        )
      case "Ready for Review":
        return (
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleViewImages(study.id, study.studyName, study.patientName)}
          >
            View Images
          </Button>
        )
      default:
        return null
    }
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Radiology Services</h2>
        <div className="flex items-center space-x-2">
          <Camera className="h-5 w-5" />
          <span className="text-sm text-muted-foreground">Radiology Technician Dashboard</span>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{scheduledCount}</div>
            <p className="text-xs text-muted-foreground">Awaiting imaging</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Zap className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{inProgressCount}</div>
            <p className="text-xs text-muted-foreground">Currently imaging</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{completedCount}</div>
            <p className="text-xs text-muted-foreground">Images acquired</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ready for Review</CardTitle>
            <FileImage className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{readyForReviewCount}</div>
            <p className="text-xs text-muted-foreground">Awaiting interpretation</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Imaging Studies</CardTitle>
          <CardDescription>Search and filter radiology studies by various criteria</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by patient name, study name, or patient ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="inprogress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="readyforreview">Ready for Review</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="routine">Routine</SelectItem>
              </SelectContent>
            </Select>
            <Select value={modalityFilter} onValueChange={setModalityFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by modality" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Modalities</SelectItem>
                <SelectItem value="X-Ray">X-Ray</SelectItem>
                <SelectItem value="CT Scan">CT Scan</SelectItem>
                <SelectItem value="MRI">MRI</SelectItem>
                <SelectItem value="Ultrasound">Ultrasound</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Studies Table with Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>Imaging Studies</CardTitle>
          <CardDescription>Manage radiology workflow from scheduling to image interpretation</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all">All ({imagingStudies.length})</TabsTrigger>
              <TabsTrigger value="scheduled">Scheduled ({scheduledCount})</TabsTrigger>
              <TabsTrigger value="inprogress">In Progress ({inProgressCount})</TabsTrigger>
              <TabsTrigger value="completed">Completed ({completedCount})</TabsTrigger>
              <TabsTrigger value="readyforreview">Review ({readyForReviewCount})</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patient</TableHead>
                      <TableHead>Study Details</TableHead>
                      <TableHead>Modality & Body Part</TableHead>
                      <TableHead>Contrast Info</TableHead>
                      <TableHead>Prescribed By</TableHead>
                      <TableHead>Schedule</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudies.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                          No studies found matching your criteria
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredStudies.map((study) => (
                        <TableRow key={study.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{study.patientName}</div>
                              <div className="text-sm text-muted-foreground">
                                {study.patientId} • Age {study.age}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{study.studyName}</div>
                              <div className="text-sm text-muted-foreground">{study.studyCode}</div>
                              <div className="text-xs text-muted-foreground">Duration: {study.estimatedDuration}</div>
                              {study.notes && <div className="text-xs text-muted-foreground mt-1">{study.notes}</div>}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="text-sm font-medium">{study.modality}</div>
                              <div className="text-sm text-muted-foreground">{study.bodyPart}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              {study.contrast ? (
                                <div>
                                  <Badge variant="outline" className="text-xs mb-1">
                                    Contrast: Yes
                                  </Badge>
                                  {study.contrastType && (
                                    <div className="text-xs text-muted-foreground">{study.contrastType}</div>
                                  )}
                                </div>
                              ) : (
                                <Badge variant="outline" className="text-xs">
                                  No Contrast
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="text-sm">{study.prescribedBy}</div>
                              {study.technician && (
                                <div className="text-xs text-muted-foreground">Tech: {study.technician}</div>
                              )}
                              {study.radiologist && (
                                <div className="text-xs text-muted-foreground">Rad: {study.radiologist}</div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="text-sm">{study.scheduledDate}</div>
                              <div className="text-sm text-muted-foreground">{study.scheduledTime}</div>
                              {study.completedDate && (
                                <div className="text-sm text-green-600">
                                  Done: {study.completedDate} {study.completedTime}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>{getPriorityBadge(study.priority)}</TableCell>
                          <TableCell>{getStatusBadge(study.status)}</TableCell>
                          <TableCell>{getActionButton(study)}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
