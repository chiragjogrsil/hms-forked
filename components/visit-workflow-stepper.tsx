"use client"

import type React from "react"

import { Check, Clock, FileText, Stethoscope, FlaskRoundIcon as Flask, CreditCard } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useVisitWorkflow } from "@/contexts/visit-workflow-context"

interface WorkflowStep {
  id: string
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  status: "completed" | "current" | "upcoming"
}

interface VisitWorkflowStepperProps {
  visitId?: string
  showActions?: boolean
}

export function VisitWorkflowStepper({ visitId, showActions = false }: VisitWorkflowStepperProps) {
  const { workflowState, goToStep, isStepCompleted, canAccessStep } = useVisitWorkflow()

  const steps: WorkflowStep[] = [
    {
      id: "registration",
      title: "Visit Registration",
      description: "Basic visit information recorded",
      icon: FileText,
      status: isStepCompleted("registration")
        ? "completed"
        : workflowState.currentStep === "registration"
          ? "current"
          : "upcoming",
    },
    {
      id: "vitals",
      title: "Vital Signs",
      description: "Record patient's vital signs",
      icon: Clock,
      status: isStepCompleted("vitals") ? "completed" : workflowState.currentStep === "vitals" ? "current" : "upcoming",
    },
    {
      id: "consultation",
      title: "Doctor Consultation",
      description: "Clinical examination and diagnosis",
      icon: Stethoscope,
      status: isStepCompleted("consultation")
        ? "completed"
        : workflowState.currentStep === "consultation"
          ? "current"
          : "upcoming",
    },
    {
      id: "tests",
      title: "Tests & Procedures",
      description: "Lab tests, radiology, treatments",
      icon: Flask,
      status: isStepCompleted("tests") ? "completed" : workflowState.currentStep === "tests" ? "current" : "upcoming",
    },
    {
      id: "billing",
      title: "Billing & Checkout",
      description: "Payment and visit completion",
      icon: CreditCard,
      status: isStepCompleted("billing")
        ? "completed"
        : workflowState.currentStep === "billing"
          ? "current"
          : "upcoming",
    },
  ]

  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const Icon = step.icon
          const isLast = index === steps.length - 1
          const canAccess = canAccessStep(step.id)

          return (
            <div key={step.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-full border-2 p-0",
                    step.status === "completed" && "bg-emerald-500 border-emerald-500 text-white hover:bg-emerald-600",
                    step.status === "current" && "bg-blue-700 border-blue-700 text-white hover:bg-blue-800",
                    step.status === "upcoming" && "bg-slate-100 border-slate-300 text-slate-400",
                    canAccess && step.status !== "current" && "hover:bg-slate-200 cursor-pointer",
                    !canAccess && "cursor-not-allowed",
                  )}
                  onClick={() => canAccess && goToStep(step.id)}
                  disabled={!canAccess}
                >
                  {step.status === "completed" ? <Check className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                </Button>
                <div className="mt-2 text-center">
                  <p
                    className={cn(
                      "text-sm font-medium",
                      step.status === "current" && "text-blue-700",
                      step.status === "completed" && "text-emerald-600",
                      step.status === "upcoming" && "text-slate-400",
                    )}
                  >
                    {step.title}
                  </p>
                  <p className="text-xs text-slate-500 max-w-24">{step.description}</p>
                </div>
              </div>
              {!isLast && (
                <div
                  className={cn("flex-1 h-0.5 mx-4", step.status === "completed" ? "bg-emerald-500" : "bg-slate-200")}
                />
              )}
            </div>
          )
        })}
      </div>

      {showActions && (
        <div className="mt-6 flex justify-center">
          <div className="text-sm text-slate-600 bg-slate-50 px-4 py-2 rounded-lg">
            <span className="font-medium">Current Step:</span>{" "}
            {steps.find((s) => s.id === workflowState.currentStep)?.title}
          </div>
        </div>
      )}
    </div>
  )
}
