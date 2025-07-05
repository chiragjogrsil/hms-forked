"use client"

import type React from "react"
import { createContext, useContext, useState, useCallback } from "react"

interface VisitWorkflowState {
  currentStep: "registration" | "vitals" | "consultation" | "tests" | "billing"
  visitId?: string
  patientId?: string
  completedSteps: string[]
  visitData?: any
}

interface VisitWorkflowContextType {
  workflowState: VisitWorkflowState
  startNewVisit: (patientId: string, visitData: any) => void
  completeStep: (step: string, data?: any) => void
  goToStep: (step: string) => void
  resetWorkflow: () => void
  isStepCompleted: (step: string) => boolean
  canAccessStep: (step: string) => boolean
}

const VisitWorkflowContext = createContext<VisitWorkflowContextType | undefined>(undefined)

const stepOrder = ["registration", "vitals", "consultation", "tests", "billing"]

export function VisitWorkflowProvider({ children }: { children: React.ReactNode }) {
  const [workflowState, setWorkflowState] = useState<VisitWorkflowState>({
    currentStep: "registration",
    completedSteps: [],
  })

  const startNewVisit = useCallback((patientId: string, visitData: any) => {
    const visitId = `visit-${Date.now()}`
    setWorkflowState({
      currentStep: "vitals", // Move to vitals after registration
      visitId,
      patientId,
      completedSteps: ["registration"],
      visitData,
    })
  }, [])

  const completeStep = useCallback((step: string, data?: any) => {
    setWorkflowState((prev) => {
      const newCompletedSteps = [...prev.completedSteps]
      if (!newCompletedSteps.includes(step)) {
        newCompletedSteps.push(step)
      }

      // Auto-advance to next step
      const currentIndex = stepOrder.indexOf(step)
      const nextStep = stepOrder[currentIndex + 1]

      return {
        ...prev,
        completedSteps: newCompletedSteps,
        currentStep: nextStep || step,
        visitData: { ...prev.visitData, [step]: data },
      }
    })
  }, [])

  const goToStep = useCallback((step: string) => {
    setWorkflowState((prev) => ({
      ...prev,
      currentStep: step as any,
    }))
  }, [])

  const resetWorkflow = useCallback(() => {
    setWorkflowState({
      currentStep: "registration",
      completedSteps: [],
    })
  }, [])

  const isStepCompleted = useCallback(
    (step: string) => {
      return workflowState.completedSteps.includes(step)
    },
    [workflowState.completedSteps],
  )

  const canAccessStep = useCallback(
    (step: string) => {
      const stepIndex = stepOrder.indexOf(step)
      const currentIndex = stepOrder.indexOf(workflowState.currentStep)
      return stepIndex <= currentIndex || workflowState.completedSteps.includes(step)
    },
    [workflowState.currentStep, workflowState.completedSteps],
  )

  return (
    <VisitWorkflowContext.Provider
      value={{
        workflowState,
        startNewVisit,
        completeStep,
        goToStep,
        resetWorkflow,
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
