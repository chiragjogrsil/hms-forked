"use client"

import { useState, useEffect } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Search, Plus, Package, Zap } from "lucide-react"

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

// Available radiology services
const radiologyServices = [
  { value: "xray-chest", label: "X-Ray Chest", price: 800, category: "X-Ray", bodyPart: "Chest" },
  { value: "xray-abdomen", label: "X-Ray Abdomen", price: 700, category: "X-Ray", bodyPart: "Abdomen" },
  { value: "xray-spine", label: "X-Ray Spine", price: 900, category: "X-Ray", bodyPart: "Spine" },
  { value: "xray-extremities", label: "X-Ray Extremities", price: 600, category: "X-Ray", bodyPart: "Limbs" },
  { value: "ct-head", label: "CT Scan Head", price: 3500, category: "CT Scan", bodyPart: "Head" },
  { value: "ct-chest", label: "CT Scan Chest", price: 4000, category: "CT Scan", bodyPart: "Chest" },
  { value: "ct-abdomen", label: "CT Scan Abdomen", price: 4500, category: "CT Scan", bodyPart: "Abdomen" },
  { value: "mri-brain", label: "MRI Brain", price: 8000, category: "MRI", bodyPart: "Brain" },
  { value: "mri-spine", label: "MRI Spine", price: 9000, category: "MRI", bodyPart: "Spine" },
  { value: "mri-knee", label: "MRI Knee", price: 7500, category: "MRI", bodyPart: "Knee" },
  { value: "mri-shoulder", label: "MRI Shoulder", price: 7500, category: "MRI", bodyPart: "Shoulder" },
  {
    value: "ultrasound-abdomen",
    label: "Ultrasound Abdomen",
    price: 1200,
    category: "Ultrasound",
    bodyPart: "Abdomen",
  },
  { value: "ultrasound-pelvis", label: "Ultrasound Pelvis", price: 1300, category: "Ultrasound", bodyPart: "Pelvis" },
  {
    value: "ultrasound-thyroid",
    label: "Ultrasound Thyroid",
    price: 1000,
    category: "Ultrasound",
    bodyPart: "Thyroid",
  },
  { value: "ultrasound-cardiac", label: "Echocardiogram", price: 2500, category: "Ultrasound", bodyPart: "Heart" },
  { value: "mammography", label: "Mammography", price: 2000, category: "Mammography", bodyPart: "Breast" },
  { value: "dexa-scan", label: "DEXA Scan", price: 1800, category: "DEXA", bodyPart: "Bone Density" },
  { value: "pet-scan", label: "PET Scan", price: 15000, category: "PET", bodyPart: "Whole Body" },
  { value: "angiography", label: "Angiography", price: 12000, category: "Angiography", bodyPart: "Blood Vessels" },
]

// Radiology packages
const radiologyPackages = [
  {
    id: "spine-complete",
    name: "Complete Spine Evaluation",
    description: "Comprehensive spine assessment with X-ray and MRI",
    services: ["xray-spine", "mri-spine"],
    price: 9900,
    discountedPrice: 8500,
    popular: true,
  },
  {
    id: "brain-complete",
    name: "Complete Brain Evaluation",
    description: "Thorough brain assessment with CT and MRI",
    services: ["ct-head", "mri-brain"],
    price: 11500,
    discountedPrice: 10000,
    popular: true,
  },
  {
    id: "chest-complete",
    name: "Complete Chest Evaluation",
    description: "Comprehensive chest imaging with X-ray and CT",
    services: ["xray-chest", "ct-chest"],
    price: 4800,
    discountedPrice: 4200,
  },
  {
    id: "abdomen-complete",
    name: "Complete Abdominal Evaluation",
    description: "Full abdominal assessment with ultrasound and CT",
    services: ["ultrasound-abdomen", "ct-abdomen"],
    price: 5700,
    discountedPrice: 5000,
  },
  {
    id: "cardiac-imaging",
    name: "Cardiac Imaging Package",
    description: "Heart evaluation with echocardiogram and chest X-ray",
    services: ["ultrasound-cardiac", "xray-chest"],
    price: 3300,
    discountedPrice: 2900,
  },
  {
    id: "womens-health",
    name: "Women's Health Imaging",
    description: "Comprehensive women's health screening",
    services: ["ultrasound-pelvis", "mammography", "ultrasound-thyroid"],
    price: 4300,
    discountedPrice: 3800,
  },
]

// Form schema
const formSchema = z.object({
  selectedPackages: z.array(z.string()),
  selectedIndividualServices: z.array(z.string()),
  priority: z.enum(["routine", "urgent", "stat"], {
    required_error: "Please select a priority level",
  }),
  indication: z.string().min(1, "Please provide clinical indication"),
  notes: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

interface PrescribeRadiologyModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  patientId: string
  patientName: string
}

export function PrescribeRadiologyModal({
  isOpen,
  onClose,
  onSuccess,
  patientId,
  patientName,
}: PrescribeRadiologyModalProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [viewMode, setViewMode] = useState<"packages" | "individual">("packages")

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      selectedPackages: [],
      selectedIndividualServices: [],
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
        selectedIndividualServices: [],
        priority: "routine",
        indication: "",
        notes: "",
      })
      setSearchTerm("")
      setSelectedCategory("all")
      setViewMode("packages")
    }
  }, [isOpen, form])

  // Get all services included in selected packages
  const selectedPackages = form.watch("selectedPackages")
  const selectedIndividualServices = form.watch("selectedIndividualServices")

  const servicesFromPackages = selectedPackages.flatMap((packageId) => {
    const pkg = radiologyPackages.find((p) => p.id === packageId)
    return pkg?.services || []
  })

  // Get unique categories
  const categories = ["all", ...Array.from(new Set(radiologyServices.map((service) => service.category)))]

  // Filter services based on search term and category, excluding services already in packages
  const filteredServices = radiologyServices.filter((service) => {
    const matchesSearch =
      service.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.bodyPart.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || service.category === selectedCategory
    const notInPackage = !servicesFromPackages.includes(service.value)
    return matchesSearch && matchesCategory && notInPackage
  })

  // Filter packages based on search term
  const filteredPackages = radiologyPackages.filter(
    (pkg) =>
      pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pkg.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Calculate total price
  const packagePrice = selectedPackages.reduce((sum, pkgId) => {
    const pkg = radiologyPackages.find((p) => p.id === pkgId)
    return sum + (pkg?.discountedPrice || 0)
  }, 0)

  const individualServicePrice = selectedIndividualServices.reduce((sum, serviceId) => {
    const service = radiologyServices.find((service) => service.value === serviceId)
    return sum + (service?.price || 0)
  }, 0)

  const totalPrice = packagePrice + individualServicePrice
  const totalServices = servicesFromPackages.length + selectedIndividualServices.length

  // Calculate savings from packages
  const totalSavings = selectedPackages.reduce((sum, pkgId) => {
    const pkg = radiologyPackages.find((p) => p.id === pkgId)
    return sum + ((pkg?.price || 0) - (pkg?.discountedPrice || 0))
  }, 0)

  function onSubmit(data: FormValues) {
    // Combine all services
    const allServices = [...servicesFromPackages, ...data.selectedIndividualServices]

    if (allServices.length === 0) {
      toast({
        title: "No services selected",
        description: "Please select at least one service or package",
        variant: "destructive",
      })
      return
    }

    // In a real app, this would call an API to prescribe the radiology services
    console.log("Prescribing radiology services:", {
      ...data,
      allServices,
      totalServices: allServices.length,
      totalPrice,
    })

    // Show success message
    toast({
      title: "Radiology services prescribed successfully",
      description: `${allServices.length} services have been prescribed for ${patientName}`,
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
            Prescribe Radiology Services
          </DialogTitle>
          <DialogDescription>Select packages and individual services for {patientName}</DialogDescription>
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
                    Imaging Packages
                  </Button>
                  <Button
                    type="button"
                    variant={viewMode === "individual" ? "default" : "ghost"}
                    size="sm"
                    className="flex-1"
                    onClick={() => setViewMode("individual")}
                  >
                    <Zap className="h-4 w-4 mr-2" />
                    Individual Services
                  </Button>
                </div>

                {/* Search and Filter */}
                <div className="space-y-3">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder={viewMode === "packages" ? "Search packages..." : "Search services or body parts..."}
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
                          {category === "all" ? "All Types" : category}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  {/* Left Panel - Available Items */}
                  <div className="lg:col-span-2">
                    <Label className="text-base font-medium">
                      {viewMode === "packages" ? "Available Packages" : "Available Services"}
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
                                              {pkg.services.length} services included
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
                          ) : // Individual Service Selection
                          filteredServices.length > 0 ? (
                            filteredServices.map((service) => {
                              const isSelected = selectedIndividualServices.includes(service.value)

                              return (
                                <FormField
                                  key={service.value}
                                  control={form.control}
                                  name="selectedIndividualServices"
                                  render={({ field }) => (
                                    <div className="flex flex-row items-start space-x-3 space-y-0 p-2 hover:bg-accent rounded-md">
                                      <Checkbox
                                        id={`service-${service.value}`}
                                        checked={isSelected}
                                        onCheckedChange={(checked) => {
                                          const updatedValue = checked
                                            ? [...field.value, service.value]
                                            : field.value.filter((value) => value !== service.value)
                                          field.onChange(updatedValue)
                                        }}
                                      />
                                      <Label
                                        htmlFor={`service-${service.value}`}
                                        className="flex-1 cursor-pointer text-sm"
                                      >
                                        <span className="font-medium">{service.label}</span>
                                        <div className="text-xs text-muted-foreground">
                                          {service.category} • {service.bodyPart} • ₹{service.price.toFixed(2)}
                                        </div>
                                      </Label>
                                    </div>
                                  )}
                                />
                              )
                            })
                          ) : (
                            <div className="p-4 text-center text-sm text-muted-foreground">
                              {servicesFromPackages.length > 0 && viewMode === "individual"
                                ? "All services in this category are already included in selected packages"
                                : "No services found"}
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
                              const pkg = radiologyPackages.find((p) => p.id === packageId)
                              if (!pkg) return null

                              return (
                                <div key={packageId} className="text-xs bg-purple-50 rounded p-2">
                                  <div className="font-medium">{pkg.name}</div>
                                  <div className="text-muted-foreground">
                                    {pkg.services.length} services • ₹{pkg.discountedPrice.toFixed(2)}
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      )}

                      {/* Selected Individual Services */}
                      {selectedIndividualServices.length > 0 && (
                        <div className="rounded-md border p-3">
                          <div className="text-sm font-medium mb-2 flex items-center gap-2">
                            <Zap className="h-4 w-4" />
                            Individual Services ({selectedIndividualServices.length})
                          </div>
                          <div className="space-y-1">
                            {selectedIndividualServices.map((serviceId) => {
                              const service = radiologyServices.find((s) => s.value === serviceId)
                              if (!service) return null

                              return (
                                <div key={serviceId} className="text-xs bg-green-50 rounded p-2">
                                  <div className="font-medium">{service.label}</div>
                                  <div className="text-muted-foreground">₹{service.price.toFixed(2)}</div>
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
                            <span>Total Services</span>
                            <span className="font-medium">{totalServices}</span>
                          </div>
                          {packagePrice > 0 && (
                            <div className="flex justify-between">
                              <span>Package Price</span>
                              <span>₹{packagePrice.toFixed(2)}</span>
                            </div>
                          )}
                          {individualServicePrice > 0 && (
                            <div className="flex justify-between">
                              <span>Individual Services</span>
                              <span>₹{individualServicePrice.toFixed(2)}</span>
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

                      {totalServices === 0 && (
                        <div className="text-center text-sm text-muted-foreground p-4">No services selected yet</div>
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
                          placeholder="Enter the clinical reason for ordering these imaging services..."
                          className="resize-none h-20"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Provide the medical reason or symptoms that justify these imaging studies
                      </FormDescription>
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
                        Include any special preparation instructions or relevant clinical information
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
            disabled={totalServices === 0}
            onClick={form.handleSubmit(onSubmit)}
            className="bg-purple-600 hover:bg-purple-700"
          >
            Prescribe {totalServices} {totalServices === 1 ? "Service" : "Services"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
