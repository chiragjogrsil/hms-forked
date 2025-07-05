export interface RadiologyService {
  id: string
  name: string
  description: string
  category: string
  price: number
  duration: string
  preparationInstructions?: string
}

export interface RadiologyPackage {
  id: string
  name: string
  description: string
  services: string[]
  price: number
  originalPrice: number
  savings: number
  savingsPercentage: number
  popular?: boolean
}

export interface RadiologyHistoryRecord {
  id: string
  date: string
  serviceId: string
  serviceName: string
  doctor: string
  findings: string
  status: "Completed" | "Scheduled"
  reportAvailable: boolean
}

export const radiologyServices: RadiologyService[] = [
  {
    id: "xray-chest",
    name: "Chest X-Ray",
    description: "Standard chest X-ray to examine lungs, heart, and chest wall",
    category: "X-Ray",
    price: 500,
    duration: "10 minutes",
  },
  {
    id: "xray-spine",
    name: "Spine X-Ray",
    description: "X-ray examination of the spine to check for alignment and bone issues",
    category: "X-Ray",
    price: 700,
    duration: "15 minutes",
  },
  {
    id: "xray-extremity",
    name: "Extremity X-Ray",
    description: "X-ray of arms, legs, hands, or feet to check for fractures or abnormalities",
    category: "X-Ray",
    price: 600,
    duration: "10 minutes",
  },
  {
    id: "us-abdomen",
    name: "Abdominal Ultrasound",
    description: "Ultrasound examination of the abdomen to check liver, gallbladder, pancreas, and other organs",
    category: "Ultrasound",
    price: 1200,
    duration: "30 minutes",
    preparationInstructions: "Fast for 8 hours before the procedure. No food or drink except water.",
  },
  {
    id: "us-pelvic",
    name: "Pelvic Ultrasound",
    description: "Ultrasound examination of the pelvic region",
    category: "Ultrasound",
    price: 1200,
    duration: "30 minutes",
    preparationInstructions: "Full bladder required. Drink 4-6 glasses of water 1 hour before and avoid urinating.",
  },
  {
    id: "us-thyroid",
    name: "Thyroid Ultrasound",
    description: "Ultrasound examination of the thyroid gland",
    category: "Ultrasound",
    price: 1000,
    duration: "20 minutes",
  },
  {
    id: "ct-brain",
    name: "CT Brain",
    description: "Computed tomography scan of the brain to check for abnormalities",
    category: "CT Scan",
    price: 3500,
    duration: "15 minutes",
    preparationInstructions: "Remove all metal objects. Inform if you have any implants or are pregnant.",
  },
  {
    id: "ct-chest",
    name: "CT Chest",
    description: "Computed tomography scan of the chest for detailed examination",
    category: "CT Scan",
    price: 4000,
    duration: "15 minutes",
    preparationInstructions: "Remove all metal objects. Inform if you have any implants or are pregnant.",
  },
  {
    id: "ct-abdomen",
    name: "CT Abdomen & Pelvis",
    description: "Computed tomography scan of the abdomen and pelvis",
    category: "CT Scan",
    price: 5000,
    duration: "20 minutes",
    preparationInstructions: "Fast for 4 hours before the procedure. May require contrast dye.",
  },
  {
    id: "mri-brain",
    name: "MRI Brain",
    description: "Magnetic resonance imaging of the brain for detailed examination",
    category: "MRI",
    price: 6000,
    duration: "45 minutes",
    preparationInstructions:
      "Remove all metal objects. Inform if you have any implants, pacemaker, or are claustrophobic.",
  },
  {
    id: "mri-spine",
    name: "MRI Spine",
    description: "Magnetic resonance imaging of the spine",
    category: "MRI",
    price: 7000,
    duration: "45 minutes",
    preparationInstructions:
      "Remove all metal objects. Inform if you have any implants, pacemaker, or are claustrophobic.",
  },
  {
    id: "mri-knee",
    name: "MRI Knee",
    description: "Magnetic resonance imaging of the knee joint",
    category: "MRI",
    price: 5500,
    duration: "30 minutes",
    preparationInstructions:
      "Remove all metal objects. Inform if you have any implants, pacemaker, or are claustrophobic.",
  },
]

export const radiologyPackages: RadiologyPackage[] = [
  {
    id: "pkg-spine-eval",
    name: "Spine Evaluation Package",
    description: "Complete spine evaluation with X-ray and MRI",
    services: ["xray-spine", "mri-spine"],
    price: 6800,
    originalPrice: 7700,
    savings: 900,
    savingsPercentage: 12,
    popular: true,
  },
  {
    id: "pkg-brain-eval",
    name: "Brain Evaluation Package",
    description: "Complete brain evaluation with CT and MRI",
    services: ["ct-brain", "mri-brain"],
    price: 8500,
    originalPrice: 9500,
    savings: 1000,
    savingsPercentage: 11,
  },
  {
    id: "pkg-abdominal-eval",
    name: "Abdominal Evaluation Package",
    description: "Complete abdominal evaluation with Ultrasound and CT",
    services: ["us-abdomen", "ct-abdomen"],
    price: 5500,
    originalPrice: 6200,
    savings: 700,
    savingsPercentage: 11,
  },
  {
    id: "pkg-chest-eval",
    name: "Chest Evaluation Package",
    description: "Complete chest evaluation with X-ray and CT",
    services: ["xray-chest", "ct-chest"],
    price: 4000,
    originalPrice: 4500,
    savings: 500,
    savingsPercentage: 11,
  },
]

export const radiologyHistory: RadiologyHistoryRecord[] = [
  {
    id: "rad-001",
    date: "22 Mar 2024",
    serviceId: "xray-chest",
    serviceName: "Chest X-Ray",
    doctor: "Dr. Sharma",
    findings: "Normal chest findings, no abnormalities detected",
    status: "Completed",
    reportAvailable: true,
  },
  {
    id: "rad-002",
    date: "15 Feb 2024",
    serviceId: "us-abdomen",
    serviceName: "Abdominal Ultrasound",
    doctor: "Dr. Gupta",
    findings: "Mild fatty liver, otherwise normal",
    status: "Completed",
    reportAvailable: true,
  },
  {
    id: "rad-003",
    date: "30 Mar 2024",
    serviceId: "mri-knee",
    serviceName: "MRI Knee",
    doctor: "Dr. Patel",
    findings: "Pending",
    status: "Scheduled",
    reportAvailable: false,
  },
]

export function getServiceById(id: string): RadiologyService | undefined {
  return radiologyServices.find((service) => service.id === id)
}
