"use client"

import { useState } from "react"
import { Package, Plus, Search, X } from "lucide-react"
import { format } from "date-fns"

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
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { type LabTest, type LabTestPackage, labTests, labTestPackages, getTestById } from "@/data/lab-test-packages"
import { toast } from "@/components/ui/use-toast"

interface BookMultipleLabTestsModalProps {
  isOpen: boolean
  onClose: () => void
  patientId: string
  patientName: string
  visitId?: string
}

export function BookMultipleLabTestsModal({
  isOpen,
  onClose,
  patientId,
  patientName,
  visitId,
}: BookMultipleLabTestsModalProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTests, setSelectedTests] = useState<LabTest[]>([])
  const [priority, setPriority] = useState("routine")
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [notes, setNotes] = useState("")
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)

  // Filter tests based on search term
  const filteredTests = labTests.filter(
    (test) =>
      test.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      test.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Group tests by category
  const testsByCategory = filteredTests.reduce<Record<string, LabTest[]>>((acc, test) => {
    if (!acc[test.category]) {
      acc[test.category] = []
    }
    acc[test.category].push(test)
    return acc
  }, {})

  // Check if a test is already selected
  const isTestSelected = (testId: string) => {
    return selectedTests.some((test) => test.id === testId)
  }

  // Add a test to the selection
  const addTest = (test: LabTest) => {
    if (!isTestSelected(test.id)) {
      setSelectedTests([...selectedTests, test])
    }
  }

  // Remove a test from the selection
  const removeTest = (testId: string) => {
    setSelectedTests(selectedTests.filter((test) => test.id !== testId))
  }

  // Add all tests from a package
  const addPackage = (pkg: LabTestPackage) => {
    const testsToAdd = pkg.tests
      .map((testId) => getTestById(testId))
      .filter((test): test is LabTest => !!test)
      .filter((test) => !isTestSelected(test.id))

    setSelectedTests([...selectedTests, ...testsToAdd])
    toast({
      title: "Package added",
      description: `Added ${testsToAdd.length} tests from ${pkg.name}`,
    })
  }

  // Calculate total price
  const totalPrice = selectedTests.reduce((sum, test) => sum + test.price, 0)

  // Handle form submission
  const handleSubmit = () => {
    if (selectedTests.length === 0) {
      toast({
        title: "No tests selected",
        description: "Please select at least one test to proceed",
        variant: "destructive",
      })
      return
    }

    // In a real app, this would call an API to create the lab test orders
    const orderData = {
      patientId,
      visitId,
      tests: selectedTests.map((test) => test.id),
      priority,
      scheduledDate: date,
      notes,
    }

    console.log("Submitting order:", orderData)

    // Show success message
    toast({
      title: "Lab tests ordered",
      description: `${selectedTests.length} tests have been ordered for ${patientName}`,
    })

    // Reset form and close modal
    setSelectedTests([])
    setPriority("routine")
    setDate(new Date())
    setNotes("")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Order Lab Tests</DialogTitle>
          <DialogDescription>Order multiple laboratory tests for {patientName}</DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <Tabs defaultValue="individual" className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="individual">Individual Tests</TabsTrigger>
              <TabsTrigger value="packages">Test Packages</TabsTrigger>
            </TabsList>

            <div className="mt-4 flex-1 overflow-hidden">
              <TabsContent value="individual" className="h-full flex flex-col">
                <div className="relative mb-4">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search tests by name or category..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[400px] overflow-auto p-1">
                  <div className="space-y-4">
                    <ScrollArea className="h-[400px] pr-4">
                      {Object.entries(testsByCategory).map(([category, tests]) => (
                        <div key={category} className="mb-4">
                          <h3 className="font-medium text-sm text-muted-foreground mb-2">{category}</h3>
                          <div className="space-y-2">
                            {tests.map((test) => (
                              <div
                                key={test.id}
                                className={cn(
                                  "flex items-center justify-between rounded-lg border p-3 text-sm",
                                  isTestSelected(test.id) && "border-primary bg-primary/5",
                                )}
                              >
                                <div className="flex-1">
                                  <div className="font-medium">{test.name}</div>
                                  {test.description && (
                                    <div className="text-xs text-muted-foreground mt-1">{test.description}</div>
                                  )}
                                  <div className="text-xs mt-1">₹{test.price.toFixed(2)}</div>
                                </div>
                                <div>
                                  {isTestSelected(test.id) ? (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => removeTest(test.id)}
                                      className="h-8 w-8 p-0"
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  ) : (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => addTest(test)}
                                      className="h-8 w-8 p-0"
                                    >
                                      <Plus className="h-4 w-4" />
                                    </Button>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </ScrollArea>
                  </div>

                  <div className="space-y-4">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle>Selected Tests ({selectedTests.length})</CardTitle>
                        <CardDescription>
                          {selectedTests.length === 0
                            ? "No tests selected yet"
                            : "Review your selected tests before ordering"}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <ScrollArea className="h-[200px] pr-4">
                          {selectedTests.length > 0 ? (
                            <div className="space-y-2">
                              {selectedTests.map((test) => (
                                <div key={test.id} className="flex items-center justify-between">
                                  <div className="flex-1">
                                    <div className="font-medium text-sm">{test.name}</div>
                                    <div className="text-xs text-muted-foreground">₹{test.price.toFixed(2)}</div>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeTest(test.id)}
                                    className="h-7 w-7 p-0"
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                              Select tests from the list
                            </div>
                          )}
                        </ScrollArea>
                      </CardContent>
                      <CardFooter className="pt-2">
                        <div className="w-full">
                          <Separator className="my-2" />
                          <div className="flex justify-between font-medium">
                            <span>Total</span>
                            <span>₹{totalPrice.toFixed(2)}</span>
                          </div>
                        </div>
                      </CardFooter>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle>Test Details</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="priority">Priority</Label>
                          <RadioGroup
                            id="priority"
                            value={priority}
                            onValueChange={setPriority}
                            className="flex flex-col space-y-1"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="routine" id="routine" />
                              <Label htmlFor="routine" className="font-normal">
                                Routine (24-48 hours)
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="urgent" id="urgent" />
                              <Label htmlFor="urgent" className="font-normal">
                                Urgent (4-6 hours)
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="stat" id="stat" />
                              <Label htmlFor="stat" className="font-normal">
                                STAT (As soon as possible)
                              </Label>
                            </div>
                          </RadioGroup>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="date">Scheduled Date</Label>
                          <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full justify-start text-left font-normal",
                                  !date && "text-muted-foreground",
                                )}
                              >
                                {date ? format(date, "PPP") : "Select a date"}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                selected={date}
                                onSelect={(date) => {
                                  setDate(date)
                                  setIsCalendarOpen(false)
                                }}
                                initialFocus
                                disabled={(date) => date < new Date()}
                              />
                            </PopoverContent>
                          </Popover>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="notes">Additional Notes</Label>
                          <Input
                            id="notes"
                            placeholder="Any special instructions or clinical information..."
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="packages" className="h-full">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[400px] overflow-auto p-1">
                  <div className="space-y-4">
                    <ScrollArea className="h-[400px] pr-4">
                      <div className="space-y-4">
                        {labTestPackages.map((pkg) => (
                          <Card key={pkg.id} className={pkg.popular ? "border-primary" : ""}>
                            <CardHeader className="pb-2">
                              <div className="flex items-center justify-between">
                                <CardTitle className="text-lg">{pkg.name}</CardTitle>
                                {pkg.popular && <Badge>Popular</Badge>}
                              </div>
                              <CardDescription>{pkg.description}</CardDescription>
                            </CardHeader>
                            <CardContent className="pb-2">
                              <div className="space-y-1">
                                <div className="text-sm font-medium">Includes:</div>
                                <ul className="text-sm list-disc pl-5 space-y-1">
                                  {pkg.tests.map((testId) => {
                                    const test = getTestById(testId)
                                    return test ? (
                                      <li key={testId}>
                                        {test.name}
                                        {isTestSelected(testId) && (
                                          <Badge variant="outline" className="ml-2 text-xs">
                                            Selected
                                          </Badge>
                                        )}
                                      </li>
                                    ) : null
                                  })}
                                </ul>
                              </div>
                            </CardContent>
                            <CardFooter className="flex justify-between items-center">
                              <div>
                                <div className="text-sm line-through text-muted-foreground">
                                  ₹{pkg.price.toFixed(2)}
                                </div>
                                <div className="text-lg font-bold">₹{pkg.discountedPrice.toFixed(2)}</div>
                              </div>
                              <Button onClick={() => addPackage(pkg)}>
                                <Package className="mr-2 h-4 w-4" />
                                Add Package
                              </Button>
                            </CardFooter>
                          </Card>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>

                  <div className="space-y-4">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle>Selected Tests ({selectedTests.length})</CardTitle>
                        <CardDescription>
                          {selectedTests.length === 0
                            ? "No tests selected yet"
                            : "Review your selected tests before ordering"}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <ScrollArea className="h-[200px] pr-4">
                          {selectedTests.length > 0 ? (
                            <div className="space-y-2">
                              {selectedTests.map((test) => (
                                <div key={test.id} className="flex items-center justify-between">
                                  <div className="flex-1">
                                    <div className="font-medium text-sm">{test.name}</div>
                                    <div className="text-xs text-muted-foreground">₹{test.price.toFixed(2)}</div>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeTest(test.id)}
                                    className="h-7 w-7 p-0"
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                              Select a package or individual tests
                            </div>
                          )}
                        </ScrollArea>
                      </CardContent>
                      <CardFooter className="pt-2">
                        <div className="w-full">
                          <Separator className="my-2" />
                          <div className="flex justify-between font-medium">
                            <span>Total</span>
                            <span>₹{totalPrice.toFixed(2)}</span>
                          </div>
                        </div>
                      </CardFooter>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle>Test Details</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="priority-pkg">Priority</Label>
                          <RadioGroup
                            id="priority-pkg"
                            value={priority}
                            onValueChange={setPriority}
                            className="flex flex-col space-y-1"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="routine" id="routine-pkg" />
                              <Label htmlFor="routine-pkg" className="font-normal">
                                Routine (24-48 hours)
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="urgent" id="urgent-pkg" />
                              <Label htmlFor="urgent-pkg" className="font-normal">
                                Urgent (4-6 hours)
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="stat" id="stat-pkg" />
                              <Label htmlFor="stat-pkg" className="font-normal">
                                STAT (As soon as possible)
                              </Label>
                            </div>
                          </RadioGroup>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="date-pkg">Scheduled Date</Label>
                          <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full justify-start text-left font-normal",
                                  !date && "text-muted-foreground",
                                )}
                              >
                                {date ? format(date, "PPP") : "Select a date"}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                selected={date}
                                onSelect={(date) => {
                                  setDate(date)
                                  setIsCalendarOpen(false)
                                }}
                                initialFocus
                                disabled={(date) => date < new Date()}
                              />
                            </PopoverContent>
                          </Popover>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="notes-pkg">Additional Notes</Label>
                          <Input
                            id="notes-pkg"
                            placeholder="Any special instructions or clinical information..."
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>

        <DialogFooter className="pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={selectedTests.length === 0}>
            Order {selectedTests.length} {selectedTests.length === 1 ? "Test" : "Tests"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
