"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

interface AllopathicTemplatePreviewModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  template: any
}

export function AllopathicTemplatePreviewModal({ open, onOpenChange, template }: AllopathicTemplatePreviewModalProps) {
  if (!template) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Allopathic Template Preview</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Template Info */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl">{template.name}</CardTitle>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      {template.department}
                    </Badge>
                    <Badge variant="secondary">{template.medicines.length} medicines</Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            {template.description && (
              <CardContent>
                <p className="text-gray-700">{template.description}</p>
              </CardContent>
            )}
          </Card>

          {/* Medicines */}
          <Card>
            <CardHeader>
              <CardTitle>Prescribed Medicines</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {template.medicines.map((medicine: any, index: number) => (
                <div key={medicine.id}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-lg">{medicine.medicine}</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2 text-sm">
                        <div>
                          <span className="text-gray-600">Dosage:</span>
                          <p className="font-medium">{medicine.dosage}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Frequency:</span>
                          <p className="font-medium">{medicine.frequency}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Duration:</span>
                          <p className="font-medium">{medicine.duration}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Timing:</span>
                          <p className="font-medium capitalize">{medicine.beforeAfterFood} food</p>
                        </div>
                      </div>
                      {medicine.instructions && (
                        <div className="mt-2">
                          <span className="text-gray-600 text-sm">Instructions:</span>
                          <p className="text-sm mt-1 text-gray-700">{medicine.instructions}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  {index < template.medicines.length - 1 && <Separator className="mt-4" />}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Template Metadata */}
          <Card>
            <CardHeader>
              <CardTitle>Template Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Created:</span>
                  <p className="font-medium">{new Date(template.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <span className="text-gray-600">Created by:</span>
                  <p className="font-medium">{template.createdBy}</p>
                </div>
                <div>
                  <span className="text-gray-600">Last updated:</span>
                  <p className="font-medium">{new Date(template.updatedAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <span className="text-gray-600">Department:</span>
                  <p className="font-medium capitalize">{template.department}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
