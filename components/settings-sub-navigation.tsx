"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  TestTube,
  Microscope,
  Users,
  Stethoscope,
  ChevronDown,
  ChevronRight,
  Search,
  Pill,
  Leaf,
  FileText,
  Settings,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"
import Link from "next/link"

// Master Categories Configuration
const masterCategories = [
  {
    id: "laboratory",
    name: "Laboratory",
    icon: TestTube,
    description: "Lab tests, units, and packages",
    color: "text-blue-600",
    subCategories: [
      {
        id: "lab-tests",
        name: "Lab Tests",
        description: "Laboratory test definitions",
      },
      {
        id: "lab-units",
        name: "Lab Units",
        description: "Measurement units for lab tests",
      },
      {
        id: "lab-packages",
        name: "Lab Packages",
        description: "Lab test packages",
      },
    ],
  },
  {
    id: "radiology",
    name: "Radiology",
    icon: Microscope,
    description: "Imaging tests and packages",
    color: "text-green-600",
    subCategories: [
      {
        id: "imaging-tests",
        name: "Imaging Tests",
        description: "Radiology and imaging test definitions",
      },
      {
        id: "radiology-packages",
        name: "Radiology Packages",
        description: "Radiology test packages",
      },
    ],
  },
  {
    id: "clinical",
    name: "Clinical Notes",
    icon: Users,
    description: "Patient clinical note templates",
    color: "text-purple-600",
    subCategories: [
      {
        id: "chief-complaints",
        name: "Chief Complaints",
        description: "Common patient complaints",
      },
      {
        id: "medical-history",
        name: "Medical History",
        description: "Medical history items",
      },
      {
        id: "investigation",
        name: "Investigation",
        description: "Investigation procedures",
      },
      {
        id: "observation",
        name: "Observation",
        description: "Clinical observations",
      },
    ],
  },
  {
    id: "diagnosis",
    name: "Diagnosis",
    icon: Stethoscope,
    description: "Medical diagnoses and ICD codes",
    color: "text-red-600",
    subCategories: [
      {
        id: "diagnoses",
        name: "Diagnoses",
        description: "Medical diagnoses with ICD codes",
      },
    ],
  },
  {
    id: "prescription-templates",
    name: "Prescription Templates",
    icon: Pill,
    description: "Ayurvedic and Allopathic prescription templates",
    color: "text-indigo-600",
    subCategories: [
      {
        id: "ayurvedic-templates",
        name: "Ayurvedic Templates",
        description: "Ayurvedic prescription templates",
      },
      {
        id: "allopathic-templates",
        name: "Allopathic Templates",
        description: "Allopathic prescription templates",
      },
    ],
  },
]

export function SettingsSubNavigation() {
  const pathname = usePathname()
  const [searchTerm, setSearchTerm] = useState("")
  const [expandedCategories, setExpandedCategories] = useState<string[]>([])

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId],
    )
  }

  const filteredCategories = masterCategories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.subCategories.some((sub) => sub.name.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const navItems = [
    {
      title: "Prescription Templates",
      href: "/settings",
      icon: FileText,
      description: "Manage prescription templates",
    },
    {
      title: "General Settings",
      href: "/settings/general",
      icon: Settings,
      description: "System configuration",
    },
    {
      title: "User Management",
      href: "/settings/users",
      icon: Users,
      description: "Manage users and permissions",
    },
  ]

  return (
    <div className="w-80 border-r bg-muted/10 flex flex-col">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold mb-3">Settings</h2>
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search settings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2">
          {navItems.map((item) => (
            <Button key={item.href} variant={pathname === item.href ? "default" : "outline"} size="sm" asChild>
              <Link href={item.href} className="flex items-center gap-2">
                <item.icon className="h-4 w-4" />
                {item.title}
              </Link>
            </Button>
          ))}
          {filteredCategories.map((category) => (
            <Collapsible
              key={category.id}
              open={expandedCategories.includes(category.id)}
              onOpenChange={() => toggleCategory(category.id)}
            >
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full justify-start p-2 h-auto mb-1">
                  <div className="flex items-center gap-2 flex-1">
                    {expandedCategories.includes(category.id) ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                    <category.icon className={cn("h-4 w-4", category.color)} />
                    <div className="text-left">
                      <div className="font-medium text-sm">{category.name}</div>
                      <div className="text-xs text-muted-foreground">{category.description}</div>
                    </div>
                  </div>
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="ml-6">
                {category.subCategories.map((subCategory) => (
                  <Button
                    key={subCategory.id}
                    variant="ghost"
                    className={cn(
                      "w-full justify-start p-2 h-auto mb-1 text-left",
                      pathname === `/settings/${category.id}/${subCategory.id}`
                        ? "bg-accent text-accent-foreground"
                        : "",
                    )}
                    onClick={() => (window.location.href = `/settings/${category.id}/${subCategory.id}`)}
                  >
                    <div className="flex items-center gap-2">
                      {category.id === "prescription-templates" && subCategory.id === "ayurvedic-templates" && (
                        <Leaf className="h-3 w-3 text-green-600" />
                      )}
                      {category.id === "prescription-templates" && subCategory.id === "allopathic-templates" && (
                        <Pill className="h-3 w-3 text-blue-600" />
                      )}
                      <div>
                        <div className="font-medium text-sm">{subCategory.name}</div>
                        <div className="text-xs text-muted-foreground">{subCategory.description}</div>
                      </div>
                    </div>
                  </Button>
                ))}
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
