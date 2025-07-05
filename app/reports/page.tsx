"use client"

import { useState } from "react"
import { Calendar, Download, FileText, Filter, Printer, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState("financial")
  const [searchQuery, setSearchQuery] = useState("")
  const [dateRange, setDateRange] = useState({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    to: new Date(),
  })

  // Sample report data
  const financialReports = [
    { id: "FR001", name: "Monthly Revenue Summary", department: "Finance", date: "2023-04-15", status: "Completed" },
    {
      id: "FR002",
      name: "Quarterly Financial Statement",
      department: "Finance",
      date: "2023-04-01",
      status: "Completed",
    },
    { id: "FR003", name: "Insurance Claims Report", department: "Billing", date: "2023-04-10", status: "Completed" },
    { id: "FR004", name: "Outstanding Payments", department: "Billing", date: "2023-04-12", status: "Pending" },
    { id: "FR005", name: "Department Budget Analysis", department: "Finance", date: "2023-04-05", status: "Completed" },
  ]

  const clinicalReports = [
    { id: "CR001", name: "Patient Admission Summary", department: "General", date: "2023-04-14", status: "Completed" },
    { id: "CR002", name: "Diagnosis Distribution", department: "Pathology", date: "2023-04-08", status: "Completed" },
    { id: "CR003", name: "Treatment Outcomes", department: "Oncology", date: "2023-04-03", status: "Completed" },
    { id: "CR004", name: "Medication Usage", department: "Pharmacy", date: "2023-04-11", status: "Pending" },
    { id: "CR005", name: "Surgery Success Rates", department: "Surgery", date: "2023-04-07", status: "Completed" },
  ]

  const operationalReports = [
    { id: "OR001", name: "Staff Attendance", department: "HR", date: "2023-04-15", status: "Completed" },
    { id: "OR002", name: "Bed Occupancy Rate", department: "Administration", date: "2023-04-13", status: "Completed" },
    { id: "OR003", name: "Equipment Utilization", department: "Radiology", date: "2023-04-09", status: "Completed" },
    { id: "OR004", name: "Wait Time Analysis", department: "Outpatient", date: "2023-04-06", status: "Pending" },
    { id: "OR005", name: "Inventory Status", department: "Pharmacy", date: "2023-04-02", status: "Completed" },
  ]

  const customReports = [
    { id: "UR001", name: "COVID-19 Cases", department: "Infectious Disease", date: "2023-04-14", status: "Completed" },
    {
      id: "UR002",
      name: "Patient Satisfaction Survey",
      department: "Administration",
      date: "2023-04-10",
      status: "Completed",
    },
    { id: "UR003", name: "Staff Performance Review", department: "HR", date: "2023-04-05", status: "Pending" },
  ]

  // Recent reports across all categories
  const recentReports = [...financialReports, ...clinicalReports, ...operationalReports, ...customReports]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10)
    .map((report) => ({
      ...report,
      status: report.status || "Completed",
    }))

  // Scheduled reports
  const scheduledReports = [
    { id: "SR001", name: "Weekly Revenue Report", frequency: "Weekly", nextRun: "2023-04-17", department: "Finance" },
    {
      id: "SR002",
      name: "Monthly Patient Statistics",
      frequency: "Monthly",
      nextRun: "2023-05-01",
      department: "Administration",
    },
    {
      id: "SR003",
      name: "Quarterly Staff Performance",
      frequency: "Quarterly",
      nextRun: "2023-07-01",
      department: "HR",
    },
  ]

  // Get active reports based on selected tab
  const getActiveReports = () => {
    switch (activeTab) {
      case "financial":
        return financialReports
      case "clinical":
        return clinicalReports
      case "operational":
        return operationalReports
      case "custom":
        return customReports
      case "recent":
        return recentReports
      case "scheduled":
        return scheduledReports
      default:
        return financialReports
    }
  }

  // Filter reports based on search query
  const filteredReports = getActiveReports().filter(
    (report) =>
      report.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.id.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
          <p className="text-muted-foreground">Generate, view, and manage hospital reports</p>
        </div>
        <div className="flex items-center gap-4">
          <DatePickerWithRange date={dateRange} setDate={setDateRange} />
          <Button>
            <Calendar className="mr-2 h-4 w-4" />
            Schedule Report
          </Button>
          <Button variant="outline">
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Main content - Reports */}
        <div className="md:col-span-3">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle>Report Library</CardTitle>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search reports..."
                      className="pl-8 w-[250px]"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon">
                        <Filter className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>All Departments</DropdownMenuItem>
                      <DropdownMenuItem>Finance</DropdownMenuItem>
                      <DropdownMenuItem>Billing</DropdownMenuItem>
                      <DropdownMenuItem>Administration</DropdownMenuItem>
                      <DropdownMenuItem>HR</DropdownMenuItem>
                      <DropdownMenuItem>Pharmacy</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="financial" onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-6">
                  <TabsTrigger value="financial">Financial</TabsTrigger>
                  <TabsTrigger value="clinical">Clinical</TabsTrigger>
                  <TabsTrigger value="operational">Operational</TabsTrigger>
                  <TabsTrigger value="custom">Custom</TabsTrigger>
                  <TabsTrigger value="recent">Recent</TabsTrigger>
                  <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
                </TabsList>
                <div className="mt-4">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium">Report ID</th>
                        <th className="text-left py-3 px-4 font-medium">Name</th>
                        <th className="text-left py-3 px-4 font-medium">Department</th>
                        {activeTab !== "scheduled" ? (
                          <>
                            <th className="text-left py-3 px-4 font-medium">Date</th>
                            <th className="text-left py-3 px-4 font-medium">Status</th>
                          </>
                        ) : (
                          <>
                            <th className="text-left py-3 px-4 font-medium">Frequency</th>
                            <th className="text-left py-3 px-4 font-medium">Next Run</th>
                          </>
                        )}
                        <th className="text-right py-3 px-4 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredReports.length > 0 ? (
                        filteredReports.map((report) => (
                          <tr key={report.id} className="border-b hover:bg-muted/50">
                            <td className="py-3 px-4">{report.id}</td>
                            <td className="py-3 px-4">{report.name}</td>
                            <td className="py-3 px-4">{report.department}</td>
                            {activeTab !== "scheduled" ? (
                              <>
                                <td className="py-3 px-4">{report.date}</td>
                                <td className="py-3 px-4">
                                  {report.status && (
                                    <Badge
                                      variant={report.status === "Completed" ? "outline" : "secondary"}
                                      className={
                                        report.status === "Completed"
                                          ? "bg-green-100 text-green-800 hover:bg-green-100"
                                          : ""
                                      }
                                    >
                                      {report.status}
                                    </Badge>
                                  )}
                                </td>
                              </>
                            ) : (
                              <>
                                <td className="py-3 px-4">
                                  <Badge variant="outline">{report.frequency}</Badge>
                                </td>
                                <td className="py-3 px-4">{report.nextRun}</td>
                              </>
                            )}
                            <td className="py-3 px-4 text-right">
                              <div className="flex justify-end gap-2">
                                {activeTab !== "scheduled" ? (
                                  <>
                                    <Button variant="outline" size="sm">
                                      <FileText className="h-4 w-4 mr-1" />
                                      View
                                    </Button>
                                    <Button variant="outline" size="sm">
                                      <Download className="h-4 w-4 mr-1" />
                                      Export
                                    </Button>
                                  </>
                                ) : (
                                  <>
                                    <Button variant="outline" size="sm">
                                      <Calendar className="h-4 w-4 mr-1" />
                                      Edit
                                    </Button>
                                    <Button variant="outline" size="sm" className="text-red-500 hover:text-red-700">
                                      Cancel
                                    </Button>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="py-6 text-center text-muted-foreground">
                            No reports found matching your search criteria.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </Tabs>
            </CardContent>
            <CardFooter className="flex justify-between border-t px-6 py-4">
              <div className="text-sm text-muted-foreground">
                Showing {filteredReports.length} of {getActiveReports().length} reports
              </div>
              <div className="flex gap-2">
                <Select defaultValue="pdf">
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="Export as..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">Export as PDF</SelectItem>
                    <SelectItem value="excel">Export as Excel</SelectItem>
                    <SelectItem value="csv">Export as CSV</SelectItem>
                  </SelectContent>
                </Select>
                <Button>
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Recent Reports */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Reports</CardTitle>
              <CardDescription>Recently generated reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentReports.map((report) => (
                  <div key={report.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{report.name}</p>
                      <p className="text-sm text-muted-foreground">{report.department}</p>
                    </div>
                    <Button variant="ghost" size="icon">
                      <FileText className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Scheduled Reports */}
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Reports</CardTitle>
              <CardDescription>Upcoming automated reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {scheduledReports.map((report) => (
                  <div key={report.id} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">{report.name}</p>
                      <Badge variant="outline">{report.frequency}</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{report.department}</span>
                      <span>Next: {report.nextRun}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                <Calendar className="mr-2 h-4 w-4" />
                Manage Schedules
              </Button>
            </CardFooter>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full justify-start" variant="outline">
                <FileText className="mr-2 h-4 w-4" />
                Create New Report
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Calendar className="mr-2 h-4 w-4" />
                Schedule Report
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Batch Export
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
