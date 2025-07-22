"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

export type WorkflowStep = "registration" | "vital-signs" | "consultation" | "prescription" | "billing" | "completed"

interface Visit {
  id: string
  patientId: string
  patientName: string
  currentStep: WorkflowStep
  startTime: Date
  completedSteps: WorkflowStep[]
  notes?: string
}

interface VisitWorkflowContextType {
  currentVisit: Visit | null
  setCurrentVisit: (visit: Visit | null) => void
  updateVisitStep: (step: WorkflowStep) => void
  completeStep: (step: WorkflowStep) => void
  isStepCompleted: (step: WorkflowStep) => boolean
  canAccessStep: (step: WorkflowStep) => boolean
}

const VisitWorkflowContext = createContext<VisitWorkflowContextType | undefined>(undefined)

const stepOrder: WorkflowStep[] = [
  "registration",
  "vital-signs",
  "consultation",
  "prescription",
  "billing",
  "completed",
]

export function VisitWorkflowProvider({ children }: { children: ReactNode }) {
  const [currentVisit, setCurrentVisit] = useState<Visit | null>(null)

  const updateVisitStep = (step: WorkflowStep) => {
    if (currentVisit) {
      setCurrentVisit({
        ...currentVisit,
        currentStep: step,
      })
    }
  }

  const completeStep = (step: WorkflowStep) => {
    if (currentVisit) {
      const updatedCompletedSteps = [...currentVisit.completedSteps]
      if (!updatedCompletedSteps.includes(step)) {
        updatedCompletedSteps.push(step)
      }

      // Auto-advance to next step
      const currentIndex = stepOrder.indexOf(step)
      const nextStep = stepOrder[currentIndex + 1]

      setCurrentVisit({
        ...currentVisit,
        completedSteps: updatedCompletedSteps,
        currentStep: nextStep || step,
      })
    }
  }

  const isStepCompleted = (step: WorkflowStep): boolean => {
    return currentVisit?.completedSteps.includes(step) || false
  }

  const canAccessStep = (step: WorkflowStep): boolean => {
    if (!currentVisit) return false

    const stepIndex = stepOrder.indexOf(step)
    const currentStepIndex = stepOrder.indexOf(currentVisit.currentStep)

    // Can access current step or any completed step
    return stepIndex <= currentStepIndex || isStepCompleted(step)
  }

  return (
    <VisitWorkflowContext.Provider
      value={{
        currentVisit,
        setCurrentVisit,
        updateVisitStep,
        completeStep,
        isStepCompleted,
        canAccessStep,
      }}
    >
      {children}
    </VisitWorkflowContext.Provider>
  )
}

export function useVisitWorkflow() {
  const context = useContext(VisitWorkflowContext)
  if (context === undefined) {
    throw new Error("useVisitWorkflow must be used within a VisitWorkflowProvider")
  }
  return context
}
