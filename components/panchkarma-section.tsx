"use client"

import { useState, useMemo } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { PlusCircle, MinusCircle, CheckCircle2, Tag, Heart } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import {
  panchkarmaTreatments,
  panchkarmaPackages,
  type PanchkarmaTreatment,
  type PanchkarmaPackage,
} from "@/data/panchkarma-treatments"

export function PanchkarmaSection() {
  const [isBookingMode, setIsBookingMode] = useState(false)
  const [selectedTreatments, setSelectedTreatments] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState<"treatments" | "packages">("packages")

  const toggleTreatment = (treatmentId: string) => {
    setSelectedTreatments((prev) =>
      prev.includes(treatmentId) ? prev.filter((id) => id !== treatmentId) : [...prev, treatmentId],
    )
  }

  const selectPackage = (packageItem: PanchkarmaPackage) => {
    const newSelection = [...selectedTreatments]
    packageItem.treatments.forEach((treatmentId) => {
      if (!newSelection.includes(treatmentId)) {
        newSelection.push(treatmentId)
      }
    })
    setSelectedTreatments(newSelection)
    setActiveTab("treatments")
  }

  const totalAmount = useMemo(() => {
    return selectedTreatments.reduce((total, treatmentId) => {
      const treatment = panchkarmaTreatments.find((t) => t.id === treatmentId)
      return total + (treatment?.price || 0)
    }, 0)
  }, [selectedTreatments])

  // Group treatments by category
  const treatmentsByCategory = useMemo(() => {
    const grouped: Record<string, PanchkarmaTreatment[]> = {}
    panchkarmaTreatments.forEach((treatment) => {
      if (!grouped[treatment.category]) {
        grouped[treatment.category] = []
      }
      grouped[treatment.category].push(treatment)
    })
    return grouped
  }, [])

  // Check if a package is fully selected
  const isPackageSelected = (packageItem: PanchkarmaPackage) => {
    return packageItem.treatments.every((id) => selectedTreatments.includes(id))
  }

  // Calculate potential savings from packages
  const potentialSavings = useMemo(() => {
    const selectedPackages = panchkarmaPackages.filter((pkg) => isPackageSelected(pkg))
    return selectedPackages.reduce((total, pkg) => total + pkg.savings, 0)
  }, [selectedTreatments])

  // Get package recommendations
  const getPackageRecommendations = () => {
    const recommendations = []
    panchkarmaPackages.forEach((pkg) => {
      const packageTreatmentIds = pkg.treatments
      const matchingTreatments = selectedTreatments.filter((treatmentId) => packageTreatmentIds.includes(treatmentId))
      const matchingCount = matchingTreatments.length

      if (matchingCount >= 2) {
        const individualCostOfMatching = matchingTreatments.reduce((sum, treatmentId) => {
          const treatment = panchkarmaTreatments.find((t) => t.id === treatmentId)
          return sum + (treatment?.price || 0)
        }, 0)

        const savings = individualCostOfMatching - pkg.price
        const completionPercentage = (matchingCount / packageTreatmentIds.length) * 100

        const missingTreatments = packageTreatmentIds
          .filter((treatmentId) => !selectedTreatments.includes(treatmentId))
          .map((treatmentId) => panchkarmaTreatments.find((t) => t.id === treatmentId))
          .filter(Boolean)

        recommendations.push({
          package: pkg,
          matchingCount,
          totalTreatments: packageTreatmentIds.length,
          savings,
          completionPercentage,
          missingTreatments,
          individualCostOfMatching,
          additionalCostForComplete: missingTreatments.reduce((sum, treatment) => sum + treatment.price, 0),
        })
      }
    })

    recommendations.sort((a, b) => b.savings - a.savings)
    return recommendations
  }

  const getSelectedTreatmentsDetails = () => {
    return panchkarmaTreatments.filter((treatment) => selectedTreatments.includes(treatment.id))
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Content - 2/3 width */}
      <div className="lg:col-span-2 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold">Panchkarma Treatments</h3>
            <p className="text-sm text-muted-foreground">Select Ayurvedic treatments and packages</p>
          </div>
          {!isBookingMode ? (
            <Button onClick={() => setIsBookingMode(true)} className="bg-secondary hover:bg-secondary/90">
              <PlusCircle className="mr-2 h-4 w-4" />
              Book Panchkarma
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsBookingMode(false)
                  setSelectedTreatments([])
                }}
              >
                <MinusCircle className="mr-2 h-4 w-4" />
                Cancel
              </Button>
              <Button className="bg-secondary hover:bg-secondary/90" disabled={selectedTreatments.length === 0}>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Confirm Booking
              </Button>
            </div>
          )}
        </div>

        {/* Content */}
        {isBookingMode ? (
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "treatments" | "packages")}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="packages">Packages</TabsTrigger>
              <TabsTrigger value="treatments">Individual Treatments</TabsTrigger>
            </TabsList>

            <TabsContent value="packages" className="space-y-4">
              <div className="grid gap-4">
                {panchkarmaPackages.map((pkg) => {
                  const isSelected = isPackageSelected(pkg)
                  return (
                    <Card
                      key={pkg.id}
                      className={`${isSelected ? "border-secondary bg-secondary/5" : "border-gray-200"}`}
                    >
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="flex items-center gap-2">
                              {pkg.name}
                              {pkg.popular && <Badge className="bg-orange-500">Popular</Badge>}
                            </CardTitle>
                            <CardDescription className="mt-1">{pkg.description}</CardDescription>
                          </div>
                          <div className="text-right">
                            <div className="text-xs text-gray-500 line-through">
                              {formatCurrency(pkg.originalPrice)}
                            </div>
                            <div className="text-lg font-bold">{formatCurrency(pkg.price)}</div>
                            <div className="text-xs text-orange-500">Save {formatCurrency(pkg.savings)}</div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div>
                            <h5 className="text-sm font-medium mb-2">Includes:</h5>
                            <div className="grid grid-cols-2 gap-1">
                              {pkg.treatments.map((treatmentId) => {
                                const treatment = panchkarmaTreatments.find((t) => t.id === treatmentId)
                                return (
                                  <div key={treatmentId} className="flex items-center text-xs">
                                    <CheckCircle2 className="h-3 w-3 mr-1 text-secondary" />
                                    {treatment?.name}
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                          <Button
                            className="w-full bg-secondary hover:bg-secondary/90"
                            onClick={() => selectPackage(pkg)}
                            disabled={isSelected}
                          >
                            {isSelected ? "Already Selected" : "Select Package"}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </TabsContent>

            <TabsContent value="treatments" className="space-y-4">
              {Object.entries(treatmentsByCategory).map(([category, treatments]) => (
                <div key={category} className="space-y-3">
                  <h4 className="font-medium">{category}</h4>
                  <div className="grid gap-3">
                    {treatments.map((treatment) => (
                      <div
                        key={treatment.id}
                        className={`border rounded-lg p-3 flex items-start gap-3 ${
                          selectedTreatments.includes(treatment.id)
                            ? "border-secondary bg-secondary/5"
                            : "border-gray-200"
                        }`}
                      >
                        <Checkbox
                          id={`treatment-${treatment.id}`}
                          checked={selectedTreatments.includes(treatment.id)}
                          onCheckedChange={() => toggleTreatment(treatment.id)}
                        />
                        <div className="flex-1">
                          <label htmlFor={`treatment-${treatment.id}`} className="text-sm font-medium cursor-pointer">
                            {treatment.name}
                          </label>
                          <p className="text-xs text-gray-500 mt-1">{treatment.description}</p>
                          <div className="flex justify-between items-center mt-2">
                            <span className="text-xs text-gray-500">Duration: {treatment.duration}</span>
                            <span className="text-sm font-medium">{formatCurrency(treatment.price)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </TabsContent>
          </Tabs>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Heart className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Click "Book Panchkarma" to start selecting treatments and packages</p>
          </div>
        )}
      </div>

      {/* Billing Sidebar - 1/3 width */}
      <div className="lg:col-span-1">
        <Card className="sticky top-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Tag className="h-5 w-5 text-secondary" />
              Booking Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedTreatments.length > 0 ? (
              <>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Selected Treatments:</span>
                    <span className="font-medium">{selectedTreatments.length}</span>
                  </div>
                  <div className="max-h-32 overflow-y-auto space-y-1">
                    {getSelectedTreatmentsDetails().map((treatment) => (
                      <div key={treatment.id} className="flex justify-between text-xs p-2 bg-gray-50 rounded">
                        <span className="truncate">{treatment.name}</span>
                        <span>{formatCurrency(treatment.price)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Package Recommendations */}
                {getPackageRecommendations().length > 0 && (
                  <>
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm text-secondary">💡 Smart Recommendations</h4>
                      {getPackageRecommendations()
                        .slice(0, 1)
                        .map((recommendation) => (
                          <div
                            key={recommendation.package.id}
                            className="p-3 bg-secondary/5 rounded-lg border border-secondary/20"
                          >
                            <div className="text-sm font-medium text-secondary">{recommendation.package.name}</div>
                            <div className="text-xs text-secondary mt-1">
                              Save ₹{Math.round(recommendation.savings)} with this package
                            </div>
                            <Button
                              size="sm"
                              className="w-full mt-2 bg-secondary hover:bg-secondary/90"
                              onClick={() => selectPackage(recommendation.package)}
                            >
                              Select Package
                            </Button>
                          </div>
                        ))}
                    </div>
                    <Separator />
                  </>
                )}

                {/* Total */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Subtotal:</span>
                    <span className="text-sm">{formatCurrency(totalAmount)}</span>
                  </div>
                  {potentialSavings > 0 && (
                    <div className="flex justify-between text-secondary">
                      <span className="text-sm">Package Savings:</span>
                      <span className="text-sm">-{formatCurrency(potentialSavings)}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between font-bold">
                    <span>Total:</span>
                    <span className="text-lg">{formatCurrency(totalAmount - potentialSavings)}</span>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                <div className="text-sm">No treatments selected</div>
                <div className="text-xs mt-1">Select treatments to see pricing</div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
