"use client"

import { useState, useEffect } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Search, X } from "lucide-react"

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

// Available lab tests
const labTests = [
  { value: "cbc", label: "Complete Blood Count (CBC)", price: 500 },
  { value: "bmp", label: "Basic Metabolic Panel (BMP)", price: 600 },
  { value: "cmp", label: "Comprehensive Metabolic Panel (CMP)", price: 800 },
  { value: "lipid", label: "Lipid Panel", price: 700 },
  { value: "thyroid", label: "Thyroid Function Tests", price: 800 },
  { value: "hba1c", label: "Hemoglobin A1C", price: 600 },
  { value: "urinalysis", label: "Urinalysis", price: 300 },
  { value: "liver", label: "Liver Function Tests", price: 700 },
  { value: "kidney", label: "Kidney Function Tests", price: 600 },
  { value: "electrolytes", label: "Electrolytes Panel", price: 500 },
  { value: "coagulation", label: "Coagulation Panel", price: 900 },
  { value: "cardiac", label: "Cardiac Enzymes", price: 1200 },
  { value: "crp", label: "C-Reactive Protein (CRP)", price: 600 },
  { value: "esr", label: "Erythrocyte Sedimentation Rate (ESR)", price: 400 },
  { value: "blood-culture", label: "Blood Culture", price: 800 },
  { value: "covid", label: "COVID-19 Test", price: 1500 },
  { value: "glucose", label: "Glucose Test", price: 300 },
  { value: "iron", label: "Iron Studies", price: 800 },
  { value: "vitamin-d", label: "Vitamin D", price: 900 },
  { value: "vitamin-b12", label: "Vitamin B12", price: 800 },
]

// Form schema
const formSchema = z.object({
  testIds: z.array(z.string()).min(1, "Please select at least one test"),
  priority: z.enum(["routine", "urgent", "stat"], {
    required_error: "Please select a priority level",
  }),
  notes: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

interface OrderLabTestModalProps {
  isOpen: boolean
  onClose: () => void
  patientId: string
  patientName: string
  visitId: string
  onOrderTest: (data: FormValues) => void
}

export function OrderLabTestModal({
  isOpen,
  onClose,
  patientId,
  patientName,
  visitId,
  onOrderTest,
}: OrderLabTestModalProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      testIds: [],
      priority: "routine",
      notes: "",
    },
  })

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      form.reset({
        testIds: [],
        priority: "routine",
        notes: "",
      })
      setSearchTerm("")
    }
  }, [isOpen, form])

  // Filter tests based on search term
  const filteredTests = labTests.filter((test) => test.label.toLowerCase().includes(searchTerm.toLowerCase()))

  // Calculate total price
  const selectedTests = form.watch("testIds")
  const totalPrice = selectedTests.reduce((sum, testId) => {
    const test = labTests.find((test) => test.value === testId)
    return sum + (test?.price || 0)
  }, 0)

  function onSubmit(data: FormValues) {
    // In a real app, this would call an API to create the lab test order
    onOrderTest(data)

    // Show success message
    toast({
      title: "Lab tests ordered",
      description: `${data.testIds.length} tests have been ordered for ${patientName}`,
    })

    // Reset form and close modal
    form.reset()
    onClose()
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
      <DialogContent className="max-w-[95vw] w-full sm:max-w-[600px] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>Order Lab Tests</DialogTitle>
          <DialogDescription>Order laboratory tests for {patientName}</DialogDescription>
        </DialogHeader>

        <div className="overflow-y-auto flex-grow pr-1">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="search-tests">Test Selection</Label>
                  <div className="relative mt-1">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="search-tests"
                      placeholder="Search tests..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="testIds"
                  render={({ field }) => (
                    <FormItem>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Available Tests</Label>
                          <div className="h-[180px] rounded-md border overflow-hidden">
                            <ScrollArea className="h-full w-full">
                              <div className="p-2 space-y-1">
                                {filteredTests.length > 0 ? (
                                  filteredTests.map((test) => {
                                    const isSelected = field.value?.includes(test.value)
                                    return (
                                      <div
                                        key={test.value}
                                        className="flex flex-row items-start space-x-2 space-y-0 p-2 hover:bg-accent rounded-md"
                                      >
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
                                          <div className="text-xs text-muted-foreground">₹{test.price.toFixed(2)}</div>
                                        </Label>
                                      </div>
                                    )
                                  })
                                ) : (
                                  <div className="p-2 text-center text-sm text-muted-foreground">No tests found</div>
                                )}
                              </div>
                            </ScrollArea>
                          </div>
                        </div>

                        <div>
                          <Label>Selected Tests ({selectedTests.length})</Label>
                          <div className="h-[180px] rounded-md border overflow-hidden">
                            <ScrollArea className="h-full w-full">
                              <div className="p-2 space-y-1">
                                {selectedTests.length > 0 ? (
                                  selectedTests.map((testId) => {
                                    const test = labTests.find((t) => t.value === testId)
                                    return (
                                      <div
                                        key={testId}
                                        className="flex items-center justify-between rounded-md px-2 py-1 text-sm bg-accent/30"
                                      >
                                        <div className="mr-2 flex-1">
                                          <div className="font-medium">{test?.label}</div>
                                          <div className="text-xs text-muted-foreground">₹{test?.price.toFixed(2)}</div>
                                        </div>
                                        <Button
                                          type="button"
                                          variant="ghost"
                                          size="sm"
                                          className="h-7 w-7 p-0 flex-shrink-0 hover:bg-destructive/20"
                                          onClick={() => {
                                            const updatedValue = field.value.filter((id) => id !== testId)
                                            field.onChange(updatedValue)
                                          }}
                                        >
                                          <X className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    )
                                  })
                                ) : (
                                  <div className="p-2 text-center text-sm text-muted-foreground">
                                    No tests selected yet
                                  </div>
                                )}
                              </div>
                            </ScrollArea>
                          </div>

                          <div className="mt-2 rounded-md border p-2">
                            <div className="flex justify-between text-sm">
                              <span>Total</span>
                              <span className="font-medium">₹{totalPrice.toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
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
                          placeholder="Enter any special instructions or clinical information..."
                          className="resize-none h-20"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Include any relevant clinical information or special handling instructions
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
          <Button type="button" disabled={selectedTests.length === 0} onClick={form.handleSubmit(onSubmit)}>
            Order {selectedTests.length} {selectedTests.length === 1 ? "Test" : "Tests"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
