"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface PrescriptionPreviewProps {
  patientData: any
  consultationData: any
  department: string
}

export function PrescriptionPreview({ patientData, consultationData, department }: PrescriptionPreviewProps) {
  const currentDate = new Date().toLocaleDateString()

  // Get ayurvedic prescriptions with multiple fallback paths
  const getAyurvedicPrescriptions = () => {
    return consultationData?.prescriptions?.ayurvedic || consultationData?.ayurvedicPrescriptions || []
  }

  // Get allopathic prescriptions with multiple fallback paths
  const getAllopathicPrescriptions = () => {
    return consultationData?.prescriptions?.allopathic || consultationData?.allopathicPrescriptions || []
  }

  const ayurvedicPrescriptions = getAyurvedicPrescriptions()
  const allopathicPrescriptions = getAllopathicPrescriptions()

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold">Hospital Management System</h1>
        <p className="text-muted-foreground">Medical Prescription</p>
      </div>

      {/* Patient Information */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Patient Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Name</p>
              <p className="font-medium">
                {patientData?.name || `${patientData?.firstName || ""} ${patientData?.lastName || ""}`.trim() || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">UHID</p>
              <p className="font-medium">{patientData?.uhid || patientData?.id || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Age/Gender</p>
              <p className="font-medium">
                {patientData?.age || "N/A"} years / {patientData?.gender || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Date</p>
              <p className="font-medium">{currentDate}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Consultation Information */}
      {(consultationData?.department || consultationData?.consultationType) && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Consultation Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {consultationData.department && (
                <div>
                  <p className="text-sm text-muted-foreground">Department</p>
                  <p className="font-medium capitalize">{consultationData.department}</p>
                </div>
              )}
              {consultationData.consultationType && (
                <div>
                  <p className="text-sm text-muted-foreground">Consultation Type</p>
                  <p className="font-medium capitalize">{consultationData.consultationType}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-muted-foreground">Date</p>
                <p className="font-medium">{currentDate}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Vital Signs */}
      {consultationData?.vitals && Object.keys(consultationData.vitals).length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Vital Signs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {consultationData.vitals.bloodPressure && (
                <div>
                  <p className="text-sm text-muted-foreground">BP</p>
                  <p>{consultationData.vitals.bloodPressure}</p>
                </div>
              )}
              {consultationData.vitals.pulse && (
                <div>
                  <p className="text-sm text-muted-foreground">Pulse</p>
                  <p>{consultationData.vitals.pulse}</p>
                </div>
              )}
              {consultationData.vitals.temperature && (
                <div>
                  <p className="text-sm text-muted-foreground">Temperature</p>
                  <p>{consultationData.vitals.temperature}</p>
                </div>
              )}
              {consultationData.vitals.weight && (
                <div>
                  <p className="text-sm text-muted-foreground">Weight</p>
                  <p>{consultationData.vitals.weight}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Clinical Notes */}
      {consultationData?.clinicalNotes && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Clinical Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{consultationData.clinicalNotes}</p>
          </CardContent>
        </Card>
      )}

      {/* Diagnosis */}
      {consultationData?.diagnosis && consultationData.diagnosis.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Diagnosis</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside">
              {consultationData.diagnosis.map((diagnosis: string, index: number) => (
                <li key={index}>{diagnosis}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Ayurvedic Prescriptions */}
      {ayurvedicPrescriptions && ayurvedicPrescriptions.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Ayurvedic Prescriptions</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">#</TableHead>
                  <TableHead>Medicine</TableHead>
                  <TableHead>Form</TableHead>
                  <TableHead>Constituents</TableHead>
                  <TableHead>Dosage</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Instructions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ayurvedicPrescriptions.map((prescription: any, index: number) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell className="font-medium">
                      {prescription?.medicine ||
                        prescription?.formOfMedicine ||
                        prescription?.name ||
                        prescription?.medicineName ||
                        "Not specified"}
                    </TableCell>
                    <TableCell>
                      {prescription?.formOfMedicine ||
                        prescription?.form ||
                        prescription?.medicineForm ||
                        "Not specified"}
                    </TableCell>
                    <TableCell>
                      {prescription?.constituents &&
                      Array.isArray(prescription.constituents) &&
                      prescription.constituents.length > 0 ? (
                        <div className="space-y-1">
                          {prescription.constituents.map((constituent: string, idx: number) => (
                            <div key={idx} className="text-sm">
                              • {constituent}
                            </div>
                          ))}
                        </div>
                      ) : prescription?.constituents && typeof prescription.constituents === "string" ? (
                        <div className="text-sm">• {prescription.constituents}</div>
                      ) : (
                        "Not specified"
                      )}
                    </TableCell>
                    <TableCell>
                      {prescription?.dosage || prescription?.dose || prescription?.quantity || "Not specified"}
                    </TableCell>
                    <TableCell>{prescription?.duration || prescription?.period || "Not specified"}</TableCell>
                    <TableCell>
                      <div className="space-y-1 text-sm">
                        {prescription?.toBeHadWith && (
                          <div>
                            <strong>With:</strong> {prescription.toBeHadWith}
                          </div>
                        )}
                        {prescription?.beforeAfterFood && (
                          <div>
                            <strong>Timing:</strong> {prescription.beforeAfterFood}
                          </div>
                        )}
                        {prescription?.instructions && (
                          <div>
                            <strong>Notes:</strong> {prescription.instructions}
                          </div>
                        )}
                        {prescription?.timing && (
                          <div>
                            <strong>When:</strong> {prescription.timing}
                          </div>
                        )}
                        {!prescription?.toBeHadWith &&
                          !prescription?.beforeAfterFood &&
                          !prescription?.instructions &&
                          !prescription?.timing && (
                            <div className="text-muted-foreground">No specific instructions</div>
                          )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Allopathic Prescriptions */}
      {allopathicPrescriptions && allopathicPrescriptions.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Allopathic Prescriptions</CardTitle>
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
                  <TableHead>Instructions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allopathicPrescriptions.map((prescription: any, index: number) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell className="font-medium">
                      {prescription?.medicine || prescription?.name || prescription?.medicineName || "Not specified"}
                    </TableCell>
                    <TableCell>
                      {prescription?.dosage || prescription?.dose || prescription?.quantity || "Not specified"}
                    </TableCell>
                    <TableCell>
                      {prescription?.beforeAfterFood || prescription?.timing || prescription?.when || "Not specified"}
                    </TableCell>
                    <TableCell>{prescription?.duration || prescription?.period || "Not specified"}</TableCell>
                    <TableCell>
                      {prescription?.instructions || prescription?.notes || "No specific instructions"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Footer */}
      <div className="mt-8 pt-4 border-t">
        <div className="flex justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Doctor's Signature</p>
            <div className="mt-8 border-b border-gray-300 w-48"></div>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Date: {currentDate}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
