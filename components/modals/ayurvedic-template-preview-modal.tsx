"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface AyurvedicTemplatePreviewModalProps {
  isOpen: boolean
  onClose: () => void
  template: any
  onLoadTemplate: (template: any) => void
}

export function AyurvedicTemplatePreviewModal({
  isOpen,
  onClose,
  template,
  onLoadTemplate,
}: AyurvedicTemplatePreviewModalProps) {
  if (!template) return null

  const handleLoadTemplate = () => {
    onLoadTemplate(template)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Template Preview: {template.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Template Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {template.name}
                <Badge variant="outline" className="capitalize">
                  {template.department}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{template.description || "No description"}</p>
              <div className="mt-4 text-sm text-muted-foreground">
                <p>Created: {new Date(template.createdAt).toLocaleDateString()}</p>
                <p>Last updated: {new Date(template.updatedAt).toLocaleDateString()}</p>
              </div>
            </CardContent>
          </Card>

          {/* Prescriptions */}
          <Card>
            <CardHeader>
              <CardTitle>Prescriptions ({template.prescriptions.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>#</TableHead>
                    <TableHead>Form</TableHead>
                    <TableHead>Constituents</TableHead>
                    <TableHead>Dosage</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Instructions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {template.prescriptions.map((prescription: any, index: number) => (
                    <TableRow key={prescription.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell className="font-medium">{prescription.formOfMedicine}</TableCell>
                      <TableCell>
                        {prescription.constituents && prescription.constituents.length > 0 ? (
                          <div className="space-y-1">
                            {prescription.constituents.map((constituent: string, idx: number) => (
                              <Badge key={idx} variant="outline" className="text-xs mr-1">
                                {constituent}
                              </Badge>
                            ))}
                          </div>
                        ) : (
                          "Not specified"
                        )}
                      </TableCell>
                      <TableCell>{prescription.dosage}</TableCell>
                      <TableCell>{prescription.duration}</TableCell>
                      <TableCell>
                        <div className="text-sm space-y-1">
                          {prescription.toBeHadWith && (
                            <div>
                              <strong>With:</strong> {prescription.toBeHadWith}
                            </div>
                          )}
                          {prescription.beforeAfterFood && (
                            <div>
                              <strong>Timing:</strong> {prescription.beforeAfterFood}
                            </div>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Pathya */}
          {template.pathya && template.pathya.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Pathya (Things to have) ({template.pathya.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {template.pathya.map((item: string, index: number) => (
                    <Badge key={index} variant="default" className="bg-green-100 text-green-800">
                      {item}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Apathya */}
          {template.apathya && template.apathya.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Apathya (Things to avoid) ({template.apathya.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {template.apathya.map((item: string, index: number) => (
                    <Badge key={index} variant="destructive">
                      {item}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button onClick={handleLoadTemplate}>Load This Template</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
