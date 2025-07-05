export type ServiceStatus = "Pending" | "In-progress" | "Completed"
export type ServiceUrgency = "Routine" | "Urgent"
export type ServiceType = "Pathology" | "Radiology" | "Procedure" | "Panchkarma"

export interface ServiceRequest {
  id: string
  serviceName: string
  serviceType: ServiceType
  urgency: ServiceUrgency
  patient: {
    name: string
    age: number
    gender: "Male" | "Female" | "Other"
  }
  prescribedDate: string
  prescribingDoctor: string
  sampleType?: string
  status: ServiceStatus
}

export const serviceRequests: ServiceRequest[] = [
  // Pathology
  {
    id: "SR001",
    serviceName: "Complete Blood Count (CBC)",
    serviceType: "Pathology",
    urgency: "Routine",
    patient: { name: "Alice Johnson", age: 34, gender: "Female" },
    prescribedDate: "2023-10-26",
    prescribingDoctor: "Dr. Emily White",
    sampleType: "Blood",
    status: "Pending",
  },
  {
    id: "SR002",
    serviceName: "Lipid Profile",
    serviceType: "Pathology",
    urgency: "Urgent",
    patient: { name: "Bob Williams", age: 56, gender: "Male" },
    prescribedDate: "2023-10-25",
    prescribingDoctor: "Dr. Michael Brown",
    sampleType: "Blood",
    status: "In-progress",
  },
  {
    id: "SR003",
    serviceName: "Urinalysis",
    serviceType: "Pathology",
    urgency: "Routine",
    patient: { name: "Charlie Davis", age: 45, gender: "Male" },
    prescribedDate: "2023-10-24",
    prescribingDoctor: "Dr. Emily White",
    sampleType: "Urine",
    status: "Completed",
  },
  // Radiology
  {
    id: "SR004",
    serviceName: "Chest X-Ray",
    serviceType: "Radiology",
    urgency: "Urgent",
    patient: { name: "Diana Miller", age: 62, gender: "Female" },
    prescribedDate: "2023-10-26",
    prescribingDoctor: "Dr. Robert Green",
    sampleType: "Imaging",
    status: "Pending",
  },
  {
    id: "SR005",
    serviceName: "MRI of the Knee",
    serviceType: "Radiology",
    urgency: "Routine",
    patient: { name: "Ethan Wilson", age: 28, gender: "Male" },
    prescribedDate: "2023-10-23",
    prescribingDoctor: "Dr. Sarah Jones",
    sampleType: "Imaging",
    status: "Completed",
  },
  // Procedures
  {
    id: "SR006",
    serviceName: "Colonoscopy",
    serviceType: "Procedure",
    urgency: "Routine",
    patient: { name: "Fiona Taylor", age: 51, gender: "Female" },
    prescribedDate: "2023-10-20",
    prescribingDoctor: "Dr. David Clark",
    status: "Completed",
  },
  {
    id: "SR007",
    serviceName: "Echocardiogram",
    serviceType: "Procedure",
    urgency: "Urgent",
    patient: { name: "George Harris", age: 68, gender: "Male" },
    prescribedDate: "2023-10-26",
    prescribingDoctor: "Dr. Michael Brown",
    status: "Pending",
  },
  // Panchkarma
  {
    id: "SR008",
    serviceName: "Abhyanga Massage",
    serviceType: "Panchkarma",
    urgency: "Routine",
    patient: { name: "Hannah Lewis", age: 39, gender: "Female" },
    prescribedDate: "2023-10-22",
    prescribingDoctor: "Dr. Priya Sharma",
    status: "In-progress",
  },
  {
    id: "SR009",
    serviceName: "Shirodhara Therapy",
    serviceType: "Panchkarma",
    urgency: "Routine",
    patient: { name: "Ian Walker", age: 48, gender: "Male" },
    prescribedDate: "2023-10-21",
    prescribingDoctor: "Dr. Priya Sharma",
    status: "Completed",
  },
  {
    id: "SR010",
    serviceName: "Thyroid Function Test",
    serviceType: "Pathology",
    urgency: "Routine",
    patient: { name: "Jane Smith", age: 42, gender: "Female" },
    prescribedDate: "2023-10-26",
    prescribingDoctor: "Dr. Emily White",
    sampleType: "Blood",
    status: "Pending",
  },
]
