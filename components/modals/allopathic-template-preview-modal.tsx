"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface AllopathicTemplatePreviewModalProps {
  isOpen: boolean
  onClose: () => void
  template: any
  onLoadTemplate: (template: any) => void
}

export function AllopathicTemplatePreviewModal({
  isOpen,
  onClose,
  template,
  onLoadTemplate,
}: AllopathicTemplatePreviewModalProps) {
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
                    <TableHead>Medicine</TableHead>
                    <TableHead>Dosage</TableHead>
                    <TableHead>Timing</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Quantity</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {template.prescriptions.map((prescription: any, index: number) => (
                    <TableRow key={prescription.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell className="font-medium">{prescription.medicine}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{prescription.dosage}</Badge>
                      </TableCell>
                      <TableCell className="capitalize">{prescription.timing?.replace("-", " ")}</TableCell>
                      <TableCell>{prescription.duration} days</TableCell>
                      <TableCell>{prescription.quantity}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Dietary Constraints */}
          {template.dietaryConstraints && template.dietaryConstraints.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Dietary Constraints ({template.dietaryConstraints.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {template.dietaryConstraints.map((constraint: string, index: number) => (
                    <Badge key={index} variant="secondary">
                      {constraint}
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
