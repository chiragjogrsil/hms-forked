// Define the procedure types and data structure

export interface Procedure {
  id: string
  name: string
  department: string
  description: string
  duration: number // in minutes
  fee: number
  isMultiDay: boolean
  sessions?: ProcedureSession[]
  preparationInstructions?: string
  followUpInstructions?: string
}

export interface ProcedureSession {
  day: number // day 1, day 2, etc.
  duration: number // in minutes
  description: string
  preparationRequired?: boolean
  preparationInstructions?: string
}

// Sample procedures data
export const procedures: Procedure[] = [
  // Orthopedics Procedures
  {
    id: "ortho-joint-injection",
    name: "Joint Injection",
    department: "Orthopedics",
    description: "Injection of medication into a joint to reduce pain and inflammation",
    duration: 30,
    fee: 1500,
    isMultiDay: false,
    preparationInstructions: "No special preparation required. Wear loose clothing for easy access to the joint.",
  },
  {
    id: "ortho-fracture-cast",
    name: "Fracture Casting",
    department: "Orthopedics",
    description: "Application of a cast to immobilize a fractured bone",
    duration: 45,
    fee: 2000,
    isMultiDay: false,
    followUpInstructions: "Keep the cast dry. Return in 2 weeks for follow-up X-ray.",
  },
  {
    id: "ortho-physio-rehab",
    name: "Physiotherapy Rehabilitation",
    department: "Orthopedics",
    description: "Comprehensive rehabilitation program for post-surgery or injury recovery",
    duration: 60,
    fee: 5000,
    isMultiDay: true,
    sessions: [
      {
        day: 1,
        duration: 60,
        description: "Initial assessment and treatment plan development",
      },
      {
        day: 3,
        duration: 45,
        description: "Guided exercises and mobility training",
      },
      {
        day: 5,
        duration: 45,
        description: "Progress evaluation and advanced exercises",
      },
      {
        day: 8,
        duration: 30,
        description: "Final assessment and home exercise program",
      },
    ],
    preparationInstructions:
      "Wear comfortable clothing and athletic shoes. Bring previous medical records if available.",
  },

  // Cardiology Procedures
  {
    id: "cardio-ecg",
    name: "Electrocardiogram (ECG)",
    department: "Cardiology",
    description: "Recording of the electrical activity of the heart",
    duration: 15,
    fee: 800,
    isMultiDay: false,
    preparationInstructions: "No caffeine or tobacco for 2-3 hours before the test.",
  },
  {
    id: "cardio-echo",
    name: "Echocardiogram",
    department: "Cardiology",
    description: "Ultrasound imaging of the heart to evaluate structure and function",
    duration: 45,
    fee: 2500,
    isMultiDay: false,
    preparationInstructions: "No special preparation required.",
  },
  {
    id: "cardio-stress-test",
    name: "Cardiac Stress Test",
    department: "Cardiology",
    description: "Evaluation of heart function during physical activity",
    duration: 60,
    fee: 3500,
    isMultiDay: false,
    preparationInstructions:
      "Wear comfortable clothing and athletic shoes. Avoid eating, smoking, or drinking caffeine for 3 hours before the test.",
  },
  {
    id: "cardio-holter",
    name: "Holter Monitoring",
    department: "Cardiology",
    description: "Continuous recording of heart activity for 24-48 hours",
    duration: 30,
    fee: 2000,
    isMultiDay: true,
    sessions: [
      {
        day: 1,
        duration: 30,
        description: "Device setup and attachment",
      },
      {
        day: 2,
        duration: 30,
        description: "Device removal and initial data review",
      },
      {
        day: 7,
        duration: 30,
        description: "Results consultation and treatment plan",
      },
    ],
    preparationInstructions:
      "Wear a loose-fitting shirt that buttons in the front. No showering or bathing while wearing the monitor.",
  },

  // Dermatology Procedures
  {
    id: "derm-biopsy",
    name: "Skin Biopsy",
    department: "Dermatology",
    description: "Removal of a small sample of skin for diagnostic testing",
    duration: 30,
    fee: 1800,
    isMultiDay: false,
    preparationInstructions: "No special preparation required. Inform doctor of any medications you are taking.",
    followUpInstructions: "Keep the area clean and dry. Return in 7-10 days for suture removal if applicable.",
  },
  {
    id: "derm-cryotherapy",
    name: "Cryotherapy",
    department: "Dermatology",
    description: "Treatment using extreme cold to destroy abnormal tissue",
    duration: 20,
    fee: 1200,
    isMultiDay: false,
  },
  {
    id: "derm-phototherapy",
    name: "Phototherapy",
    department: "Dermatology",
    description: "Treatment using ultraviolet light for conditions like psoriasis and eczema",
    duration: 30,
    fee: 4500,
    isMultiDay: true,
    sessions: [
      {
        day: 1,
        duration: 30,
        description: "Initial assessment and test exposure",
      },
      {
        day: 3,
        duration: 20,
        description: "First treatment session",
      },
      {
        day: 5,
        duration: 20,
        description: "Second treatment session",
      },
      {
        day: 8,
        duration: 20,
        description: "Third treatment session",
      },
      {
        day: 10,
        duration: 30,
        description: "Progress evaluation and adjustment",
      },
    ],
    preparationInstructions:
      "Avoid sun exposure and tanning beds before treatment. Do not apply lotions, perfumes, or deodorants before the session.",
  },

  // Neurology Procedures
  {
    id: "neuro-eeg",
    name: "Electroencephalogram (EEG)",
    department: "Neurology",
    description: "Recording of electrical activity in the brain",
    duration: 60,
    fee: 2500,
    isMultiDay: false,
    preparationInstructions: "Wash hair the night before. Avoid caffeine and sleep medications. Get adequate sleep.",
  },
  {
    id: "neuro-emg",
    name: "Electromyography (EMG)",
    department: "Neurology",
    description: "Evaluation of electrical activity of muscles and nerves",
    duration: 45,
    fee: 3000,
    isMultiDay: false,
    preparationInstructions: "Avoid using lotions or oils on the day of the test. Wear loose-fitting clothing.",
  },
  {
    id: "neuro-cognitive",
    name: "Cognitive Assessment",
    department: "Neurology",
    description: "Comprehensive evaluation of cognitive functions",
    duration: 90,
    fee: 3500,
    isMultiDay: true,
    sessions: [
      {
        day: 1,
        duration: 90,
        description: "Initial assessment and testing",
      },
      {
        day: 7,
        duration: 60,
        description: "Additional testing and evaluation",
      },
      {
        day: 14,
        duration: 60,
        description: "Results discussion and recommendations",
      },
    ],
    preparationInstructions: "Get adequate sleep the night before. Bring glasses or hearing aids if you use them.",
  },

  // General Medicine Procedures
  {
    id: "gen-vaccination",
    name: "Vaccination",
    department: "General Medicine",
    description: "Administration of vaccines for preventive care",
    duration: 15,
    fee: 500,
    isMultiDay: false,
  },
  {
    id: "gen-iv-therapy",
    name: "IV Therapy",
    department: "General Medicine",
    description: "Intravenous administration of fluids, medications, or nutrients",
    duration: 60,
    fee: 1500,
    isMultiDay: false,
    preparationInstructions: "Stay hydrated before the appointment. Eat a light meal.",
  },
  {
    id: "gen-allergy-testing",
    name: "Allergy Testing",
    department: "General Medicine",
    description: "Identification of specific allergens through skin or blood tests",
    duration: 45,
    fee: 2000,
    isMultiDay: true,
    sessions: [
      {
        day: 1,
        duration: 45,
        description: "Initial consultation and skin testing",
      },
      {
        day: 7,
        duration: 30,
        description: "Blood test if required",
      },
      {
        day: 14,
        duration: 30,
        description: "Results discussion and treatment plan",
      },
    ],
    preparationInstructions:
      "Stop taking antihistamines 5-7 days before the test. Avoid caffeine on the day of testing.",
  },
]

// Helper function to get procedures by department
export function getProceduresByDepartment(department: string): Procedure[] {
  return procedures.filter((procedure) => procedure.department === department)
}

// Helper function to get a procedure by ID
export function getProcedureById(id: string): Procedure | undefined {
  return procedures.find((procedure) => procedure.id === id)
}
