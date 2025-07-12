"use client"

import { useState } from "react"
import { ChevronDown, ChevronRight, TestTube, Microscope, Users, Stethoscope } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface SubCategory {
  id: string
  name: string
  description: string
}

interface MasterCategory {
  id: string
  name: string
  icon: any
  color: string
  subCategories: SubCategory[]
}

const masterCategories: MasterCategory[] = [
  {
    id: "laboratory",
    name: "Laboratory",
    icon: TestTube,
    color: "text-blue-600",
    subCategories: [
      { id: "lab-tests", name: "Lab Tests", description: "Laboratory test definitions" },
      { id: "lab-units", name: "Lab Units", description: "Measurement units for lab tests" },
      { id: "lab-packages", name: "Lab Packages", description: "Lab test packages" },
    ],
  },
  {
    id: "radiology",
    name: "Radiology",
    icon: Microscope,
    color: "text-green-600",
    subCategories: [
      { id: "imaging-tests", name: "Imaging Tests", description: "Radiology and imaging test definitions" },
      { id: "radiology-packages", name: "Radiology Packages", description: "Radiology test packages" },
    ],
  },
  {
    id: "clinical",
    name: "Clinical Notes",
    icon: Users,
    color: "text-purple-600",
    subCategories: [
      { id: "chief-complaints", name: "Chief Complaints", description: "Common patient complaints" },
      { id: "medical-history", name: "Medical History", description: "Medical history items" },
      { id: "investigation", name: "Investigation", description: "Investigation procedures" },
      { id: "observation", name: "Observation", description: "Clinical observations" },
    ],
  },
  {
    id: "diagnosis",
    name: "Diagnosis",
    icon: Stethoscope,
    color: "text-red-600",
    subCategories: [{ id: "diagnoses", name: "Diagnoses", description: "Medical diagnoses with ICD codes" }],
  },
]

interface SettingsSubNavigationProps {
  selectedCategory: string
  selectedSubCategory: string
  onCategoryChange: (categoryId: string, subCategoryId: string) => void
}

export function SettingsSubNavigation({
  selectedCategory,
  selectedSubCategory,
  onCategoryChange,
}: SettingsSubNavigationProps) {
  const [expandedCategories, setExpandedCategories] = useState<string[]>([selectedCategory])

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId],
    )
  }

  const handleSubCategoryClick = (categoryId: string, subCategoryId: string) => {
    onCategoryChange(categoryId, subCategoryId)
    if (!expandedCategories.includes(categoryId)) {
      setExpandedCategories((prev) => [...prev, categoryId])
    }
  }

  return (
    <div className="w-80 border-r bg-background/50 p-4 space-y-2">
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Master Data</h2>
        <p className="text-sm text-muted-foreground">Manage system configuration</p>
      </div>

      <div className="space-y-1">
        {masterCategories.map((category) => {
          const IconComponent = category.icon
          const isExpanded = expandedCategories.includes(category.id)
          const isSelected = selectedCategory === category.id

          return (
            <div key={category.id} className="space-y-1">
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start h-auto p-2 font-normal",
                  isSelected && "bg-accent text-accent-foreground",
                )}
                onClick={() => toggleCategory(category.id)}
              >
                <div className="flex items-center gap-2 flex-1">
                  {category.subCategories.length > 1 ? (
                    isExpanded ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )
                  ) : (
                    <div className="w-4" />
                  )}
                  <IconComponent className={cn("h-4 w-4", category.color)} />
                  <div className="text-left">
                    <div className="text-sm font-medium">{category.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {category.subCategories.length} item{category.subCategories.length !== 1 ? "s" : ""}
                    </div>
                  </div>
                </div>
              </Button>

              {isExpanded && category.subCategories.length > 1 && (
                <div className="ml-6 space-y-1">
                  {category.subCategories.map((subCategory) => (
                    <Button
                      key={subCategory.id}
                      variant="ghost"
                      className={cn(
                        "w-full justify-start h-auto p-2 font-normal text-sm",
                        selectedSubCategory === subCategory.id && "bg-accent text-accent-foreground",
                      )}
                      onClick={() => handleSubCategoryClick(category.id, subCategory.id)}
                    >
                      <div className="text-left">
                        <div className="font-medium">{subCategory.name}</div>
                        <div className="text-xs text-muted-foreground">{subCategory.description}</div>
                      </div>
                    </Button>
                  ))}
                </div>
              )}

              {category.subCategories.length === 1 && (
                <div className="hidden">
                  {/* Auto-select single subcategory */}
                  {selectedCategory === category.id &&
                    selectedSubCategory !== category.subCategories[0].id &&
                    handleSubCategoryClick(category.id, category.subCategories[0].id)}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
