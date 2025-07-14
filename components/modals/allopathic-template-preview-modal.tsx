"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Download, Pill, Calendar, User } from "lucide-react"

interface AllopathicTemplatePreviewModalProps {
  template: any
  isOpen: boolean
  onClose: () => void
  onLoad: (template: any) => void
}

export function AllopathicTemplatePreviewModal({
  template,
  isOpen,
  onClose,
  onLoad,
}: AllopathicTemplatePreviewModalProps) {
  if (!template) return null

  const handleLoad = () => {
    onLoad(template)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Pill className="h-5 w-5 text-blue-600" />
            Allopathic Template Preview: {template.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Template Info */}
          <Card className="border-blue-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Pill className="h-5 w-5 text-blue-600" />
                Template Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Template Name</p>
                  <p className="font-medium">{template.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Department</p>
                  <Badge variant="outline" className="capitalize">
                    {template.department}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Created By</p>
                  <div className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    <span className="text-sm">{template.createdBy}</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Created Date</p>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span className="text-sm">{new Date(template.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              {template.description && (
                <div className="mt-4">
                  <p className="text-sm text-muted-foreground">Description</p>
                  <p className="text-sm">{template.description}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Prescriptions */}
          {template.prescriptions && template.prescriptions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Pill className="h-5 w-5 text-blue-600" />
                  Allopathic Prescriptions ({template.prescriptions.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">#</TableHead>
                      <TableHead>Medicine</TableHead>
                      <TableHead>Dosage</TableHead>
                      <TableHead>Timing</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Instructions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {template.prescriptions.map((prescription: any, index: number) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{index + 1}</TableCell>
                        <TableCell className="font-medium">{prescription.medicine}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{prescription.dosage}</Badge>
                        </TableCell>
                        <TableCell className="capitalize">{prescription.timing?.replace("-", " ")}</TableCell>
                        <TableCell>{prescription.duration} days</TableCell>
                        <TableCell>{prescription.quantity}</TableCell>
                        <TableCell className="max-w-xs">
                          <div className="text-sm">{prescription.instructions}</div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {/* Dietary Constraints */}
          {template.dietaryConstraints && template.dietaryConstraints.length > 0 && (
            <Card className="border-orange-200">
              <CardHeader>
                <CardTitle className="text-lg text-orange-700">Dietary Guidelines</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {template.dietaryConstraints.map((item: string, index: number) => (
                    <Badge key={index} className="bg-orange-100 text-orange-800">
                      {item}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Close Preview
            </Button>
            <Button onClick={handleLoad} className="bg-blue-600 hover:bg-blue-700">
              <Download className="h-4 w-4 mr-2" />
              Load This Template
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
