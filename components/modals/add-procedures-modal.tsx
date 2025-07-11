"use client"

import { useState, useEffect } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Search, X, Plus } from "lucide-react"

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

// Available procedures by department
const procedures = [
  // General Medicine
  {
    value: "gen-vaccination",
    label: "Vaccination",
    department: "General Medicine",
    sessions: 1,
    duration: "1 day",
    price: 500,
  },
  {
    value: "gen-health-checkup",
    label: "Comprehensive Health Checkup",
    department: "General Medicine",
    sessions: 1,
    duration: "1 day",
    price: 2000,
  },

  // Cardiology
  {
    value: "cardio-echo",
    label: "Echocardiogram",
    department: "Cardiology",
    sessions: 1,
    duration: "1 day",
    price: 2500,
  },
  {
    value: "cardio-stress-test",
    label: "Cardiac Stress Test",
    department: "Cardiology",
    sessions: 1,
    duration: "1 day",
    price: 3000,
  },
  {
    value: "cardio-holter",
    label: "24-Hour Holter Monitor",
    department: "Cardiology",
    sessions: 1,
    duration: "2 days",
    price: 3500,
  },

  // Orthopedics
  {
    value: "ortho-physio-rehab",
    label: "Physiotherapy Rehabilitation",
    department: "Orthopedics",
    sessions: 10,
    duration: "3 weeks",
    price: 5000,
  },
  {
    value: "ortho-joint-injection",
    label: "Joint Injection",
    department: "Orthopedics",
    sessions: 1,
    duration: "1 day",
    price: 1500,
  },

  // Dermatology
  {
    value: "derm-biopsy",
    label: "Skin Biopsy",
    department: "Dermatology",
    sessions: 1,
    duration: "1 day",
    price: 1800,
  },
  {
    value: "derm-phototherapy",
    label: "Phototherapy Treatment",
    department: "Dermatology",
    sessions: 8,
    duration: "4 weeks",
    price: 4000,
  },
  {
    value: "derm-laser-therapy",
    label: "Laser Therapy",
    department: "Dermatology",
    sessions: 5,
    duration: "2 weeks",
    price: 6000,
  },

  // Neurology
  {
    value: "neuro-eeg",
    label: "Electroencephalogram (EEG)",
    department: "Neurology",
    sessions: 1,
    duration: "1 day",
    price: 2000,
  },
  {
    value: "neuro-emg",
    label: "Electromyography (EMG)",
    department: "Neurology",
    sessions: 1,
    duration: "1 day",
    price: 2500,
  },

  // Ayurveda
  {
    value: "abhyanga",
    label: "Abhyanga Therapy",
    department: "Ayurveda",
    sessions: 5,
    duration: "1 week",
    price: 3000,
  },
  {
    value: "shirodhara",
    label: "Shirodhara Treatment",
    department: "Ayurveda",
    sessions: 7,
    duration: "2 weeks",
    price: 4500,
  },
  {
    value: "panchkarma-basic",
    label: "Basic Panchkarma Package",
    department: "Ayurveda",
    sessions: 7,
    duration: "2 weeks",
    price: 8000,
  },
  {
    value: "panchkarma-premium",
    label: "Premium Panchkarma Package",
    department: "Ayurveda",
    sessions: 14,
    duration: "4 weeks",
    price: 15000,
  },

  // Gynecology
  {
    value: "gynec-pap-smear",
    label: "Pap Smear",
    department: "Gynecology",
    sessions: 1,
    duration: "1 day",
    price: 800,
  },
  {
    value: "gynec-colposcopy",
    label: "Colposcopy",
    department: "Gynecology",
    sessions: 1,
    duration: "1 day",
    price: 1500,
  },

  // Ophthalmology
  {
    value: "ophthal-laser",
    label: "Laser Eye Treatment",
    department: "Ophthalmology",
    sessions: 1,
    duration: "1 day",
    price: 8000,
  },
  {
    value: "ophthal-retinal-exam",
    label: "Comprehensive Retinal Examination",
    department: "Ophthalmology",
    sessions: 1,
    duration: "1 day",
    price: 1200,
  },
]

// Form schema
const formSchema = z.object({
  procedureIds: z.array(z.string()).min(1, "Please select at least one procedure"),
  priority: z.enum(["routine", "urgent", "stat"], {
    required_error: "Please select a priority level",
  }),
  indication: z.string().min(1, "Please provide clinical indication"),
  notes: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

interface AddProceduresModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  patientId: string
  patientName: string
}

export function AddProceduresModal({ isOpen, onClose, onSuccess, patientId, patientName }: AddProceduresModalProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all")

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      procedureIds: [],
      priority: "routine",
      indication: "",
      notes: "",
    },
  })

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      form.reset({
        procedureIds: [],
        priority: "routine",
        indication: "",
        notes: "",
      })
      setSearchTerm("")
      setSelectedDepartment("all")
    }
  }, [isOpen, form])

  // Get unique departments
  const departments = ["all", ...Array.from(new Set(procedures.map((procedure) => procedure.department)))]

  // Filter procedures based on search term and department
  const filteredProcedures = procedures.filter((procedure) => {
    const matchesSearch = procedure.label.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDepartment = selectedDepartment === "all" || procedure.department === selectedDepartment
    return matchesSearch && matchesDepartment
  })

  // Calculate total price and sessions
  const selectedProcedures = form.watch("procedureIds")
  const totalPrice = selectedProcedures.reduce((sum, procedureId) => {
    const procedure = procedures.find((procedure) => procedure.value === procedureId)
    return sum + (procedure?.price || 0)
  }, 0)

  const totalSessions = selectedProcedures.reduce((sum, procedureId) => {
    const procedure = procedures.find((procedure) => procedure.value === procedureId)
    return sum + (procedure?.sessions || 0)
  }, 0)

  function onSubmit(data: FormValues) {
    // In a real app, this would call an API to add the procedures
    console.log("Adding procedures:", data)

    // Show success message
    toast({
      title: "Procedures added successfully",
      description: `${data.procedureIds.length} procedures have been added for ${patientName}`,
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
      <DialogContent className="max-w-[95vw] w-full sm:max-w-[700px] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add Medical Procedures
          </DialogTitle>
          <DialogDescription>Add medical procedures and treatments for {patientName}</DialogDescription>
        </DialogHeader>

        <div className="overflow-y-auto flex-grow pr-1">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                {/* Search and Filter */}
                <div className="space-y-3">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search procedures..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {departments.map((department) => (
                      <Button
                        key={department}
                        type="button"
                        variant={selectedDepartment === department ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedDepartment(department)}
                      >
                        {department === "all" ? "All Departments" : department}
                      </Button>
                    ))}
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="procedureIds"
                  render={({ field }) => (
                    <FormItem>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Available Procedures</Label>
                          <div className="h-[200px] rounded-md border overflow-hidden">
                            <ScrollArea className="h-full w-full">
                              <div className="p-2 space-y-1">
                                {filteredProcedures.length > 0 ? (
                                  filteredProcedures.map((procedure) => {
                                    const isSelected = field.value?.includes(procedure.value)
                                    return (
                                      <div
                                        key={procedure.value}
                                        className="flex flex-row items-start space-x-2 space-y-0 p-2 hover:bg-accent rounded-md"
                                      >
                                        <Checkbox
                                          id={`procedure-${procedure.value}`}
                                          checked={isSelected}
                                          onCheckedChange={(checked) => {
                                            const updatedValue = checked
                                              ? [...field.value, procedure.value]
                                              : field.value.filter((value) => value !== procedure.value)
                                            field.onChange(updatedValue)
                                          }}
                                        />
                                        <Label
                                          htmlFor={`procedure-${procedure.value}`}
                                          className="flex-1 cursor-pointer text-sm"
                                        >
                                          <span className="font-medium">{procedure.label}</span>
                                          <div className="text-xs text-muted-foreground">
                                            {procedure.department} • {procedure.sessions} sessions •{" "}
                                            {procedure.duration} • ₹{procedure.price.toFixed(2)}
                                          </div>
                                        </Label>
                                      </div>
                                    )
                                  })
                                ) : (
                                  <div className="p-2 text-center text-sm text-muted-foreground">
                                    No procedures found
                                  </div>
                                )}
                              </div>
                            </ScrollArea>
                          </div>
                        </div>

                        <div>
                          <Label>Selected Procedures ({selectedProcedures.length})</Label>
                          <div className="h-[200px] rounded-md border overflow-hidden">
                            <ScrollArea className="h-full w-full">
                              <div className="p-2 space-y-1">
                                {selectedProcedures.length > 0 ? (
                                  selectedProcedures.map((procedureId) => {
                                    const procedure = procedures.find((p) => p.value === procedureId)
                                    return (
                                      <div
                                        key={procedureId}
                                        className="flex items-center justify-between rounded-md px-2 py-1 text-sm bg-accent/30"
                                      >
                                        <div className="mr-2 flex-1">
                                          <div className="font-medium">{procedure?.label}</div>
                                          <div className="text-xs text-muted-foreground">
                                            {procedure?.sessions} sessions • ₹{procedure?.price.toFixed(2)}
                                          </div>
                                        </div>
                                        <Button
                                          type="button"
                                          variant="ghost"
                                          size="sm"
                                          className="h-7 w-7 p-0 flex-shrink-0 hover:bg-destructive/20"
                                          onClick={() => {
                                            const updatedValue = field.value.filter((id) => id !== procedureId)
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
                                    No procedures selected yet
                                  </div>
                                )}
                              </div>
                            </ScrollArea>
                          </div>

                          <div className="mt-2 rounded-md border p-2 space-y-1">
                            <div className="flex justify-between text-sm">
                              <span>Total Sessions</span>
                              <span className="font-medium">{totalSessions}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Total Cost</span>
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
                  name="indication"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Clinical Indication *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter the clinical reason for these procedures..."
                          className="resize-none h-20"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Provide the medical reason or symptoms that justify these procedures
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
                            <FormLabel className="font-normal">Routine (Schedule within 1-2 weeks)</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="urgent" />
                            </FormControl>
                            <FormLabel className="font-normal">Urgent (Schedule within 2-3 days)</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="stat" />
                            </FormControl>
                            <FormLabel className="font-normal">STAT (Schedule immediately)</FormLabel>
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
            disabled={selectedProcedures.length === 0}
            onClick={form.handleSubmit(onSubmit)}
            className="bg-green-600 hover:bg-green-700"
          >
            Add {selectedProcedures.length} {selectedProcedures.length === 1 ? "Procedure" : "Procedures"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
