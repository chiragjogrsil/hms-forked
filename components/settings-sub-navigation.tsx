"use client"

import { useState } from "react"
import {
  ChevronDown,
  ChevronRight,
  TestTube,
  Microscope,
  Users,
  Stethoscope,
  Shield,
  UserCog,
  Settings,
  Key,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
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

interface CategorySection {
  id: string
  title: string
  description: string
  categories: MasterCategory[]
}

const categorySections: CategorySection[] = [
  {
    id: "master-data",
    title: "Master Data",
    description: "Clinical and operational data management",
    categories: [
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
    ],
  },
  {
    id: "system-administration",
    title: "System Administration",
    description: "User and system management",
    categories: [
      {
        id: "user-management",
        name: "User Management",
        icon: UserCog,
        color: "text-indigo-600",
        subCategories: [
          { id: "users", name: "Users", description: "Manage system users" },
          { id: "roles", name: "Roles", description: "Define user roles and permissions" },
          { id: "departments", name: "Departments", description: "Manage hospital departments" },
          { id: "staff-profiles", name: "Staff Profiles", description: "Doctor and staff information" },
        ],
      },
      {
        id: "access-control",
        name: "Access Control",
        icon: Shield,
        color: "text-amber-600",
        subCategories: [
          { id: "permissions", name: "Permissions", description: "System permissions and access rights" },
          { id: "role-permissions", name: "Role Permissions", description: "Assign permissions to roles" },
          { id: "user-sessions", name: "User Sessions", description: "Active user sessions" },
          { id: "audit-logs", name: "Audit Logs", description: "System access and activity logs" },
        ],
      },
    ],
  },
  {
    id: "system-configuration",
    title: "System Configuration",
    description: "Application and system settings",
    categories: [
      {
        id: "general-settings",
        name: "General Settings",
        icon: Settings,
        color: "text-gray-600",
        subCategories: [
          {
            id: "hospital-info",
            name: "Hospital Information",
            description: "Basic hospital details and configuration",
          },
          { id: "system-preferences", name: "System Preferences", description: "Application preferences and defaults" },
          {
            id: "notification-settings",
            name: "Notification Settings",
            description: "Email and SMS notification configuration",
          },
        ],
      },
      {
        id: "security-settings",
        name: "Security Settings",
        icon: Key,
        color: "text-rose-600",
        subCategories: [
          { id: "password-policy", name: "Password Policy", description: "Password requirements and policies" },
          {
            id: "session-management",
            name: "Session Management",
            description: "Session timeout and security settings",
          },
          { id: "backup-settings", name: "Backup Settings", description: "Data backup and recovery configuration" },
        ],
      },
    ],
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
    <div className="w-80 border-r bg-background/50 p-4 space-y-4 overflow-y-auto">
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Settings</h2>
        <p className="text-sm text-muted-foreground">System configuration and management</p>
      </div>

      {categorySections.map((section, sectionIndex) => (
        <div key={section.id} className="space-y-2">
          {/* Section Header */}
          <div className="mb-3">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">{section.title}</h3>
            <p className="text-xs text-muted-foreground mt-1">{section.description}</p>
          </div>

          {/* Categories in Section */}
          <div className="space-y-1">
            {section.categories.map((category) => {
              const IconComponent = category.icon
              const isExpanded = expandedCategories.includes(category.id)
              const isSelected = selectedCategory === category.id
              const isImplemented = section.id === "master-data" // Only master data is implemented

              return (
                <div key={category.id} className="space-y-1">
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start h-auto p-2 font-normal",
                      isSelected && "bg-accent text-accent-foreground",
                      !isImplemented && "opacity-60 cursor-not-allowed",
                    )}
                    onClick={() => isImplemented && toggleCategory(category.id)}
                    disabled={!isImplemented}
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
                      <div className="text-left flex-1">
                        <div className="text-sm font-medium flex items-center gap-2">
                          {category.name}
                          {!isImplemented && (
                            <span className="text-xs bg-muted text-muted-foreground px-1.5 py-0.5 rounded">
                              Coming Soon
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {category.subCategories.length} item{category.subCategories.length !== 1 ? "s" : ""}
                        </div>
                      </div>
                    </div>
                  </Button>

                  {isExpanded && category.subCategories.length > 1 && isImplemented && (
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

                  {category.subCategories.length === 1 && isImplemented && (
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

          {/* Add separator between sections except for the last one */}
          {sectionIndex < categorySections.length - 1 && <Separator className="my-4" />}
        </div>
      ))}
    </div>
  )
}
