"use client"

interface ConsultationPrintPreviewProps {
  patientData: any
  consultationData: any
  department: string
}

export function ConsultationPrintPreview({ patientData, consultationData, department }: ConsultationPrintPreviewProps) {
  const currentDate = new Date().toLocaleDateString()
  const printDate = consultationData?.visitDate
    ? new Date(consultationData.visitDate).toLocaleDateString()
    : currentDate

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
    <div className="max-w-4xl mx-auto p-8 bg-white text-black print:p-6">
      {/* Header */}
      <div className="text-center mb-8 border-b-2 border-gray-300 pb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Hospital Management System</h1>
        <h2 className="text-xl font-semibold text-gray-600 mb-1">Medical Consultation Report</h2>
        <p className="text-sm text-gray-500">Complete Patient Consultation Details</p>
      </div>

      {/* Patient Information */}
      <div className="mb-8">
        <h3 className="text-lg font-bold text-gray-800 mb-4 border-b border-gray-200 pb-2">Patient Information</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <p className="text-sm font-medium text-gray-600">Patient Name</p>
            <p className="font-semibold text-gray-800">
              {patientData?.name || `${patientData?.firstName || ""} ${patientData?.lastName || ""}`.trim() || "N/A"}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Patient ID (UHID)</p>
            <p className="font-semibold text-gray-800">{patientData?.uhid || patientData?.id || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Age / Gender</p>
            <p className="font-semibold text-gray-800">
              {patientData?.age || "N/A"} years / {patientData?.gender || "N/A"}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Blood Group</p>
            <p className="font-semibold text-gray-800">{patientData?.bloodGroup || "N/A"}</p>
          </div>
        </div>

        {patientData?.phone && (
          <div className="mt-4 grid grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-medium text-gray-600">Contact Number</p>
              <p className="font-semibold text-gray-800">{patientData.phone}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Email</p>
              <p className="font-semibold text-gray-800">{patientData?.email || "N/A"}</p>
            </div>
          </div>
        )}
      </div>

      {/* Consultation Information */}
      <div className="mb-8">
        <h3 className="text-lg font-bold text-gray-800 mb-4 border-b border-gray-200 pb-2">Consultation Details</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <p className="text-sm font-medium text-gray-600">Consultation Date</p>
            <p className="font-semibold text-gray-800">{printDate}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Time</p>
            <p className="font-semibold text-gray-800">{consultationData?.visitTime || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Doctor</p>
            <p className="font-semibold text-gray-800">{consultationData?.doctorName || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Department</p>
            <p className="font-semibold text-gray-800 capitalize">
              {consultationData?.department || department || "N/A"}
            </p>
          </div>
        </div>

        {consultationData?.consultationType && (
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-600">Consultation Type</p>
            <p className="font-semibold text-gray-800 capitalize">{consultationData.consultationType}</p>
          </div>
        )}
      </div>

      {/* Chief Complaint */}
      {consultationData?.chiefComplaint && (
        <div className="mb-8">
          <h3 className="text-lg font-bold text-gray-800 mb-4 border-b border-gray-200 pb-2">Chief Complaint</h3>
          <p className="text-gray-800 leading-relaxed">{consultationData.chiefComplaint}</p>
        </div>
      )}

      {/* Clinical Notes */}
      {consultationData?.clinicalNotes && (
        <div className="mb-8">
          <h3 className="text-lg font-bold text-gray-800 mb-4 border-b border-gray-200 pb-2">Clinical Notes</h3>
          <p className="text-gray-800 leading-relaxed">{consultationData.clinicalNotes}</p>
        </div>
      )}

      {/* Vital Signs */}
      {consultationData?.vitals && Object.keys(consultationData.vitals).length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-bold text-gray-800 mb-4 border-b border-gray-200 pb-2">Vital Signs</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {consultationData.vitals.bloodPressure && (
              <div>
                <p className="text-sm font-medium text-gray-600">Blood Pressure</p>
                <p className="font-semibold text-gray-800">{consultationData.vitals.bloodPressure}</p>
              </div>
            )}
            {consultationData.vitals.pulse && (
              <div>
                <p className="text-sm font-medium text-gray-600">Pulse Rate</p>
                <p className="font-semibold text-gray-800">{consultationData.vitals.pulse}</p>
              </div>
            )}
            {consultationData.vitals.temperature && (
              <div>
                <p className="text-sm font-medium text-gray-600">Temperature</p>
                <p className="font-semibold text-gray-800">{consultationData.vitals.temperature}</p>
              </div>
            )}
            {consultationData.vitals.weight && (
              <div>
                <p className="text-sm font-medium text-gray-600">Weight</p>
                <p className="font-semibold text-gray-800">{consultationData.vitals.weight}</p>
              </div>
            )}
            {consultationData.vitals.height && (
              <div>
                <p className="text-sm font-medium text-gray-600">Height</p>
                <p className="font-semibold text-gray-800">{consultationData.vitals.height}</p>
              </div>
            )}
            {consultationData.vitals.respiratoryRate && (
              <div>
                <p className="text-sm font-medium text-gray-600">Respiratory Rate</p>
                <p className="font-semibold text-gray-800">{consultationData.vitals.respiratoryRate}</p>
              </div>
            )}
            {consultationData.vitals.spo2 && (
              <div>
                <p className="text-sm font-medium text-gray-600">SpO2</p>
                <p className="font-semibold text-gray-800">{consultationData.vitals.spo2}</p>
              </div>
            )}
            {consultationData.vitals.bmi && (
              <div>
                <p className="text-sm font-medium text-gray-600">BMI</p>
                <p className="font-semibold text-gray-800">{consultationData.vitals.bmi}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Diagnosis */}
      {((consultationData?.provisionalDiagnosis && consultationData.provisionalDiagnosis.length > 0) ||
        (consultationData?.diagnosis && consultationData.diagnosis.length > 0)) && (
        <div className="mb-8">
          <h3 className="text-lg font-bold text-gray-800 mb-4 border-b border-gray-200 pb-2">Diagnosis</h3>
          <div className="space-y-2">
            {(consultationData.provisionalDiagnosis || consultationData.diagnosis || []).map(
              (diagnosis: string, index: number) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-gray-600 rounded-full"></span>
                  <span className="text-gray-800">{diagnosis}</span>
                </div>
              ),
            )}
          </div>
        </div>
      )}

      {/* Allopathic Prescriptions */}
      {allopathicPrescriptions && allopathicPrescriptions.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-bold text-gray-800 mb-4 border-b border-gray-200 pb-2">
            Allopathic Prescriptions
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2 text-left font-semibold">#</th>
                  <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Medicine</th>
                  <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Dosage</th>
                  <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Frequency</th>
                  <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Duration</th>
                  <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Instructions</th>
                </tr>
              </thead>
              <tbody>
                {allopathicPrescriptions.map((prescription: any, index: number) => (
                  <tr key={index}>
                    <td className="border border-gray-300 px-4 py-2 font-medium">{index + 1}</td>
                    <td className="border border-gray-300 px-4 py-2 font-medium">
                      {prescription?.medicine || prescription?.name || prescription?.medicineName || "Not specified"}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {prescription?.dosage || prescription?.dose || prescription?.quantity || "Not specified"}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {prescription?.frequency || prescription?.timing || "Not specified"}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {prescription?.duration || prescription?.period || "Not specified"}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      <div className="space-y-1 text-sm">
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
                        {!prescription?.beforeAfterFood && !prescription?.instructions && (
                          <span className="text-gray-500">No specific instructions</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Ayurvedic Prescriptions */}
      {ayurvedicPrescriptions && ayurvedicPrescriptions.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-bold text-gray-800 mb-4 border-b border-gray-200 pb-2">
            Ayurvedic Prescriptions
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2 text-left font-semibold">#</th>
                  <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Medicine</th>
                  <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Form</th>
                  <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Constituents</th>
                  <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Dosage</th>
                  <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Duration</th>
                  <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Instructions</th>
                </tr>
              </thead>
              <tbody>
                {ayurvedicPrescriptions.map((prescription: any, index: number) => (
                  <tr key={index}>
                    <td className="border border-gray-300 px-4 py-2 font-medium">{index + 1}</td>
                    <td className="border border-gray-300 px-4 py-2 font-medium">
                      {prescription?.medicine ||
                        prescription?.formOfMedicine ||
                        prescription?.name ||
                        prescription?.medicineName ||
                        "Not specified"}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {prescription?.formOfMedicine ||
                        prescription?.form ||
                        prescription?.medicineForm ||
                        "Not specified"}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
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
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {prescription?.dosage || prescription?.dose || prescription?.quantity || "Not specified"}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {prescription?.duration || prescription?.period || "Not specified"}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
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
                          !prescription?.timing && <span className="text-gray-500">No specific instructions</span>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Advice and Follow-up */}
      {(consultationData?.advice || consultationData?.followUpInstructions) && (
        <div className="mb-8">
          <h3 className="text-lg font-bold text-gray-800 mb-4 border-b border-gray-200 pb-2">
            Medical Advice & Follow-up
          </h3>
          {consultationData.advice && (
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-600 mb-2">General Advice:</p>
              <p className="text-gray-800 leading-relaxed">{consultationData.advice}</p>
            </div>
          )}
          {consultationData.followUpInstructions && (
            <div>
              <p className="text-sm font-medium text-gray-600 mb-2">Follow-up Instructions:</p>
              <p className="text-gray-800 leading-relaxed">{consultationData.followUpInstructions}</p>
            </div>
          )}
        </div>
      )}

      {/* Next Steps */}
      {consultationData?.nextSteps && (
        <div className="mb-8">
          <h3 className="text-lg font-bold text-gray-800 mb-4 border-b border-gray-200 pb-2">Next Steps</h3>

          {consultationData.nextSteps.labTests && consultationData.nextSteps.labTests.length > 0 && (
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-600 mb-2">Recommended Lab Tests:</p>
              <ul className="space-y-1">
                {consultationData.nextSteps.labTests.map((test: string, index: number) => (
                  <li key={index} className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                    <span className="text-gray-800">{test}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {consultationData.nextSteps.radiology && consultationData.nextSteps.radiology.length > 0 && (
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-600 mb-2">Recommended Radiology:</p>
              <ul className="space-y-1">
                {consultationData.nextSteps.radiology.map((test: string, index: number) => (
                  <li key={index} className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-purple-600 rounded-full"></span>
                    <span className="text-gray-800">{test}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {consultationData.nextSteps.followUp && (
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-600 mb-2">Follow-up Appointment:</p>
              <p className="text-gray-800">
                {new Date(consultationData.nextSteps.followUp.date).toLocaleDateString()} at{" "}
                {consultationData.nextSteps.followUp.time}
              </p>
              {consultationData.nextSteps.followUp.notes && (
                <p className="text-gray-600 text-sm mt-1">{consultationData.nextSteps.followUp.notes}</p>
              )}
            </div>
          )}

          {consultationData.nextSteps.nextStepsNotes && (
            <div>
              <p className="text-sm font-medium text-gray-600 mb-2">Additional Notes:</p>
              <p className="text-gray-800 leading-relaxed">{consultationData.nextSteps.nextStepsNotes}</p>
            </div>
          )}
        </div>
      )}

      {/* Patient Allergies (Important for prescriptions) */}
      {patientData?.allergies && patientData.allergies.length > 0 && (
        <div className="mb-8 bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-lg font-bold text-red-800 mb-3">⚠️ Patient Allergies</h3>
          <div className="flex flex-wrap gap-2">
            {patientData.allergies.map((allergy: string, index: number) => (
              <span key={index} className="bg-red-200 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                {allergy}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="mt-12 pt-6 border-t-2 border-gray-300">
        <div className="flex justify-between items-end">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-2">Doctor's Signature</p>
            <div className="mt-8 border-b-2 border-gray-400 w-64"></div>
            <p className="text-sm text-gray-600 mt-2">{consultationData?.doctorName || "Doctor Name"}</p>
            <p className="text-xs text-gray-500">
              {consultationData?.department ? `Department of ${consultationData.department}` : ""}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-gray-600">Date: {printDate}</p>
            <p className="text-xs text-gray-500 mt-2">
              Printed on: {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
            </p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            This is a computer-generated consultation report. Please verify all prescriptions and follow medical advice
            as directed.
          </p>
        </div>
      </div>
    </div>
  )
}
