"use client"
import { Button } from "./ui/button"
import type { LucideIcon } from "lucide-react"

interface EmptyStateProps {
  title: string
  description: string
  buttonText: string
  onButtonClick: () => void
  Icon: LucideIcon
}

export function EmptyState({ title, description, buttonText, onButtonClick, Icon }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center space-y-6 rounded-lg border-2 border-dashed p-12 text-center">
      <div className="rounded-full border border-dashed p-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <Icon className="h-8 w-8 text-muted-foreground" />
        </div>
      </div>
      <div className="space-y-1">
        <h3 className="text-2xl font-semibold tracking-tight">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <Button onClick={onButtonClick}>{buttonText}</Button>
    </div>
  )
}
