"use client"

import { useState, useEffect } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Search, Plus, Package, TestTube } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from "@/components/ui/use-toast"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"

import { labTestPackages } from "@/data/lab-test-packages"

// Available lab tests
const labTests = [
  { value: "cbc", label: "Complete Blood Count (CBC)", price: 500, category: "Hematology" },
  { value: "bmp", label: "Basic Metabolic Panel (BMP)", price: 600, category: "Chemistry" },
  { value: "cmp", label: "Comprehensive Metabolic Panel (CMP)", price: 800, category: "Chemistry" },
  { value: "lipid", label: "Lipid Panel", price: 700, category: "Chemistry" },
  { value: "thyroid", label: "Thyroid Function Tests", price: 800, category: "Endocrinology" },
  { value: "hba1c", label: "Hemoglobin A1C", price: 600, category: "Diabetes" },
  { value: "urinalysis", label: "Urinalysis", price: 300, category: "Urology" },
  { value: "liver", label: "Liver Function Tests", price: 700, category: "Chemistry" },
  { value: "kidney", label: "Kidney Function Tests", price: 600, category: "Chemistry" },
  { value: "electrolytes", label: "Electrolytes Panel", price: 500, category: "Chemistry" },
  { value: "coagulation", label: "Coagulation Panel", price: 900, category: "Hematology" },
  { value: "cardiac", label: "Cardiac Enzymes", price: 1200, category: "Cardiology" },
  { value: "crp", label: "C-Reactive Protein (CRP)", price: 600, category: "Inflammation" },
  { value: "esr", label: "Erythrocyte Sedimentation Rate (ESR)", price: 400, category: "Inflammation" },
  { value: "blood-culture", label: "Blood Culture", price: 800, category: "Microbiology" },
  { value: "covid", label: "COVID-19 Test", price: 1500, category: "Infectious Disease" },
  { value: "glucose", label: "Glucose Test", price: 300, category: "Diabetes" },
  { value: "iron", label: "Iron Studies", price: 800, category: "Hematology" },
  { value: "vitamin-d", label: "Vitamin D", price: 900, category: "Vitamins" },
  { value: "vitamin-b12", label: "Vitamin B12", price: 800, category: "Vitamins" },
]

// Form schema
const formSchema = z.object({
  selectedPackages: z.array(z.string()),
  selectedIndividualTests: z.array(z.string()),
  priority: z.enum(["routine", "urgent", "stat"], {
    required_error: "Please select a priority level",
  }),
  indication: z.string().min(1, "Please provide clinical indication"),
  notes: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

interface PrescribeTestsModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  patientId: string
  patientName: string
}

export function PrescribeTestsModal({ isOpen, onClose, onSuccess, patientId, patientName }: PrescribeTestsModalProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [viewMode, setViewMode] = useState<"packages" | "individual">("packages")

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      selectedPackages: [],
      selectedIndividualTests: [],
      priority: "routine",
      indication: "",
      notes: "",
    },
  })

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      form.reset({
        selectedPackages: [],
        selectedIndividualTests: [],
        priority: "routine",
        indication: "",
        notes: "",
      })
      setSearchTerm("")
      setSelectedCategory("all")
      setViewMode("packages")
    }
  }, [isOpen, form])

  // Get all tests included in selected packages
  const selectedPackages = form.watch("selectedPackages")
  const selectedIndividualTests = form.watch("selectedIndividualTests")

  const testsFromPackages = selectedPackages.flatMap((packageId) => {
    const pkg = labTestPackages.find((p) => p.id === packageId)
    return pkg?.tests || []
  })

  // Get unique categories
  const categories = ["all", ...Array.from(new Set(labTests.map((test) => test.category)))]

  // Filter tests based on search term and category, excluding tests already in packages
  const filteredTests = labTests.filter((test) => {
    const matchesSearch = test.label.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || test.category === selectedCategory
    const notInPackage = !testsFromPackages.includes(test.value)
    return matchesSearch && matchesCategory && notInPackage
  })

  // Filter packages based on search term
  const filteredPackages = labTestPackages.filter(
    (pkg) =>
      pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pkg.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Calculate total price
  const packagePrice = selectedPackages.reduce((sum, pkgId) => {
    const pkg = labTestPackages.find((p) => p.id === pkgId)
    return sum + (pkg?.discountedPrice || 0)
  }, 0)

  const individualTestPrice = selectedIndividualTests.reduce((sum, testId) => {
    const test = labTests.find((test) => test.value === testId)
    return sum + (test?.price || 0)
  }, 0)

  const totalPrice = packagePrice + individualTestPrice
  const totalTests = testsFromPackages.length + selectedIndividualTests.length

  // Calculate savings from packages
  const totalSavings = selectedPackages.reduce((sum, pkgId) => {
    const pkg = labTestPackages.find((p) => p.id === pkgId)
    return sum + ((pkg?.price || 0) - (pkg?.discountedPrice || 0))
  }, 0)

  function onSubmit(data: FormValues) {
    // Combine all tests
    const allTests = [...testsFromPackages, ...data.selectedIndividualTests]

    if (allTests.length === 0) {
      toast({
        title: "No tests selected",
        description: "Please select at least one test or package",
        variant: "destructive",
      })
      return
    }

    // In a real app, this would call an API to prescribe the tests
    console.log("Prescribing tests:", {
      ...data,
      allTests,
      totalTests: allTests.length,
      totalPrice,
    })

    // Show success message
    toast({
      title: "Tests prescribed successfully",
      description: `${allTests.length} tests have been prescribed for ${patientName}`,
    })

    // Call success callback
    onSuccess()
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          onClose()
        }
      }}
    >
      <DialogContent className="max-w-[95vw] w-full sm:max-w-[800px] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Prescribe Laboratory Tests
          </DialogTitle>
          <DialogDescription>Select packages and individual tests for {patientName}</DialogDescription>
        </DialogHeader>

        <div className="overflow-y-auto flex-grow pr-1">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                {/* View Mode Toggle */}
                <div className="flex space-x-1 rounded-lg bg-muted p-1">
                  <Button
                    type="button"
                    variant={viewMode === "packages" ? "default" : "ghost"}
                    size="sm"
                    className="flex-1"
                    onClick={() => setViewMode("packages")}
                  >
                    <Package className="h-4 w-4 mr-2" />
                    Test Packages
                  </Button>
                  <Button
                    type="button"
                    variant={viewMode === "individual" ? "default" : "ghost"}
                    size="sm"
                    className="flex-1"
                    onClick={() => setViewMode("individual")}
                  >
                    <TestTube className="h-4 w-4 mr-2" />
                    Individual Tests
                  </Button>
                </div>

                {/* Search and Filter */}
                <div className="space-y-3">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder={viewMode === "packages" ? "Search packages..." : "Search tests..."}
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  {viewMode === "individual" && (
                    <div className="flex flex-wrap gap-2">
                      {categories.map((category) => (
                        <Button
                          key={category}
                          type="button"
                          variant={selectedCategory === category ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedCategory(category)}
                        >
                          {category === "all" ? "All Categories" : category}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  {/* Left Panel - Available Items */}
                  <div className="lg:col-span-2">
                    <Label className="text-base font-medium">
                      {viewMode === "packages" ? "Available Packages" : "Available Tests"}
                    </Label>
                    <div className="h-[300px] rounded-md border overflow-hidden mt-2">
                      <ScrollArea className="h-full w-full">
                        <div className="p-3 space-y-2">
                          {viewMode === "packages" ? (
                            // Package Selection
                            filteredPackages.length > 0 ? (
                              filteredPackages.map((pkg) => {
                                const isSelected = selectedPackages.includes(pkg.id)
                                const savings = pkg.price - pkg.discountedPrice
                                const savingsPercent = Math.round((savings / pkg.price) * 100)

                                return (
                                  <FormField
                                    key={pkg.id}
                                    control={form.control}
                                    name="selectedPackages"
                                    render={({ field }) => (
                                      <div
                                        className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                                          isSelected ? "border-primary bg-primary/5" : "border-border hover:bg-accent"
                                        }`}
                                        onClick={() => {
                                          const updatedPackages = isSelected
                                            ? field.value.filter((id) => id !== pkg.id)
                                            : [...field.value, pkg.id]
                                          field.onChange(updatedPackages)
                                        }}
                                      >
                                        <div className="flex items-start justify-between">
                                          <div className="flex-1">
                                            <div className="font-medium text-sm">{pkg.name}</div>
                                            {pkg.popular && (
                                              <Badge variant="secondary" className="mt-1">
                                                Popular
                                              </Badge>
                                            )}
                                            <div className="text-xs text-muted-foreground mt-1">{pkg.description}</div>
                                            <div className="text-xs text-muted-foreground mt-1">
                                              {pkg.tests.length} tests included
                                            </div>
                                          </div>
                                          <div className="text-right ml-2">
                                            <div className="text-sm font-medium text-green-600">
                                              ₹{pkg.discountedPrice.toFixed(2)}
                                            </div>
                                            <div className="text-xs text-muted-foreground line-through">
                                              ₹{pkg.price.toFixed(2)}
                                            </div>
                                            <div className="text-xs text-green-600">Save {savingsPercent}%</div>
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                  />
                                )
                              })
                            ) : (
                              <div className="p-4 text-center text-sm text-muted-foreground">No packages found</div>
                            )
                          ) : // Individual Test Selection
                          filteredTests.length > 0 ? (
                            filteredTests.map((test) => {
                              const isSelected = selectedIndividualTests.includes(test.value)

                              return (
                                <FormField
                                  key={test.value}
                                  control={form.control}
                                  name="selectedIndividualTests"
                                  render={({ field }) => (
                                    <div className="flex flex-row items-start space-x-3 space-y-0 p-2 hover:bg-accent rounded-md">
                                      <Checkbox
                                        id={`test-${test.value}`}
                                        checked={isSelected}
                                        onCheckedChange={(checked) => {
                                          const updatedValue = checked
                                            ? [...field.value, test.value]
                                            : field.value.filter((value) => value !== test.value)
                                          field.onChange(updatedValue)
                                        }}
                                      />
                                      <Label htmlFor={`test-${test.value}`} className="flex-1 cursor-pointer text-sm">
                                        <span className="font-medium">{test.label}</span>
                                        <div className="text-xs text-muted-foreground">
                                          {test.category} • ₹{test.price.toFixed(2)}
                                        </div>
                                      </Label>
                                    </div>
                                  )}
                                />
                              )
                            })
                          ) : (
                            <div className="p-4 text-center text-sm text-muted-foreground">
                              {testsFromPackages.length > 0 && viewMode === "individual"
                                ? "All tests in this category are already included in selected packages"
                                : "No tests found"}
                            </div>
                          )}
                        </div>
                      </ScrollArea>
                    </div>
                  </div>

                  {/* Right Panel - Selected Summary */}
                  <div>
                    <Label className="text-base font-medium">Selected Summary</Label>
                    <div className="mt-2 space-y-3">
                      {/* Selected Packages */}
                      {selectedPackages.length > 0 && (
                        <div className="rounded-md border p-3">
                          <div className="text-sm font-medium mb-2 flex items-center gap-2">
                            <Package className="h-4 w-4" />
                            Packages ({selectedPackages.length})
                          </div>
                          <div className="space-y-2">
                            {selectedPackages.map((packageId) => {
                              const pkg = labTestPackages.find((p) => p.id === packageId)
                              if (!pkg) return null

                              return (
                                <div key={packageId} className="text-xs bg-blue-50 rounded p-2">
                                  <div className="font-medium">{pkg.name}</div>
                                  <div className="text-muted-foreground">
                                    {pkg.tests.length} tests • ₹{pkg.discountedPrice.toFixed(2)}
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      )}

                      {/* Selected Individual Tests */}
                      {selectedIndividualTests.length > 0 && (
                        <div className="rounded-md border p-3">
                          <div className="text-sm font-medium mb-2 flex items-center gap-2">
                            <TestTube className="h-4 w-4" />
                            Individual Tests ({selectedIndividualTests.length})
                          </div>
                          <div className="space-y-1">
                            {selectedIndividualTests.map((testId) => {
                              const test = labTests.find((t) => t.value === testId)
                              if (!test) return null

                              return (
                                <div key={testId} className="text-xs bg-green-50 rounded p-2">
                                  <div className="font-medium">{test.label}</div>
                                  <div className="text-muted-foreground">₹{test.price.toFixed(2)}</div>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      )}

                      {/* Price Summary */}
                      <div className="rounded-md border p-3 bg-gray-50">
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Total Tests</span>
                            <span className="font-medium">{totalTests}</span>
                          </div>
                          {packagePrice > 0 && (
                            <div className="flex justify-between">
                              <span>Package Price</span>
                              <span>₹{packagePrice.toFixed(2)}</span>
                            </div>
                          )}
                          {individualTestPrice > 0 && (
                            <div className="flex justify-between">
                              <span>Individual Tests</span>
                              <span>₹{individualTestPrice.toFixed(2)}</span>
                            </div>
                          )}
                          {totalSavings > 0 && (
                            <div className="flex justify-between text-green-600">
                              <span>Package Savings</span>
                              <span>-₹{totalSavings.toFixed(2)}</span>
                            </div>
                          )}
                          <div className="flex justify-between font-medium text-base border-t pt-2">
                            <span>Total</span>
                            <span>₹{totalPrice.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>

                      {totalTests === 0 && (
                        <div className="text-center text-sm text-muted-foreground p-4">No tests selected yet</div>
                      )}
                    </div>
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="indication"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Clinical Indication *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter the clinical reason for ordering these tests..."
                          className="resize-none h-20"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>Provide the medical reason or symptoms that justify these tests</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Priority</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="routine" />
                            </FormControl>
                            <FormLabel className="font-normal">Routine (24-48 hours)</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="urgent" />
                            </FormControl>
                            <FormLabel className="font-normal">Urgent (4-6 hours)</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="stat" />
                            </FormControl>
                            <FormLabel className="font-normal">STAT (As soon as possible)</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Additional Notes</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter any special instructions or additional information..."
                          className="resize-none h-20"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Include any special handling instructions or relevant clinical information
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </form>
          </Form>
        </div>

        <DialogFooter className="flex-shrink-0 pt-4 border-t mt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="button"
            disabled={totalTests === 0}
            onClick={form.handleSubmit(onSubmit)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Prescribe {totalTests} {totalTests === 1 ? "Test" : "Tests"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
