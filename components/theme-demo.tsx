"use client"

import { useTheme } from "next-themes"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function ThemeDemo() {
  const { theme, systemTheme } = useTheme()
  const currentTheme = theme === "system" ? systemTheme : theme

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Theme Demo
          <Badge variant={currentTheme === "dark" ? "secondary" : "default"}>
            {currentTheme}
          </Badge>
        </CardTitle>
        <CardDescription>
          This card demonstrates how components adapt to the current theme.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm font-medium">Current Theme: {currentTheme}</p>
          <p className="text-sm text-muted-foreground">
            The theme affects colors, backgrounds, and text throughout the application.
          </p>
        </div>
        <div className="flex gap-2">
          <Badge variant="default">Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="destructive">Destructive</Badge>
        </div>
        <div className="rounded-lg border p-3">
          <p className="text-sm">
            This is a bordered container that adapts to the theme. In light mode, it has a light background and dark text. 
            In dark mode, it has a dark background and light text.
          </p>
        </div>
      </CardContent>
    </Card>
  )
} 