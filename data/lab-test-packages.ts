// Lab test packages and individual tests

export interface LabTest {
  id: string
  name: string
  description?: string
  price: number
  category: string
  preparationRequired?: boolean
  preparationInstructions?: string
  turnaroundTime: string // e.g., "24 hours", "3 days"
}

export interface LabTestPackage {
  id: string
  name: string
  description: string
  tests: string[] // Array of test IDs
  price: number
  discountedPrice: number
  popular?: boolean
}

// Individual lab tests
export const labTests: LabTest[] = [
  {
    id: "cbc",
    name: "Complete Blood Count (CBC)",
    description: "Measures red and white blood cells, hemoglobin, hematocrit, and platelets",
    price: 500,
    category: "Hematology",
    turnaroundTime: "24 hours",
  },
  {
    id: "bmp",
    name: "Basic Metabolic Panel",
    description: "Measures glucose, calcium, and electrolytes",
    price: 600,
    category: "Chemistry",
    turnaroundTime: "24 hours",
  },
  {
    id: "lipid",
    name: "Lipid Profile",
    description: "Measures cholesterol levels including HDL, LDL, and triglycerides",
    price: 700,
    category: "Chemistry",
    preparationRequired: true,
    preparationInstructions: "Fasting for 9-12 hours before the test",
    turnaroundTime: "24 hours",
  },
  {
    id: "thyroid",
    name: "Thyroid Function Tests",
    description: "Measures TSH, T3, and T4 levels",
    price: 800,
    category: "Endocrinology",
    turnaroundTime: "24-48 hours",
  },
  {
    id: "hba1c",
    name: "Hemoglobin A1C",
    description: "Measures average blood glucose levels over the past 2-3 months",
    price: 600,
    category: "Diabetes",
    turnaroundTime: "24 hours",
  },
  {
    id: "urinalysis",
    name: "Urinalysis",
    description: "Analyzes urine for abnormalities",
    price: 300,
    category: "Urology",
    turnaroundTime: "24 hours",
  },
  {
    id: "liver",
    name: "Liver Function Tests",
    description: "Measures enzymes and proteins that indicate liver function",
    price: 700,
    category: "Gastroenterology",
    turnaroundTime: "24 hours",
  },
  {
    id: "kidney",
    name: "Kidney Function Tests",
    description: "Measures BUN and creatinine levels",
    price: 600,
    category: "Nephrology",
    turnaroundTime: "24 hours",
  },
  {
    id: "electrolytes",
    name: "Electrolytes Panel",
    description: "Measures sodium, potassium, chloride, and bicarbonate levels",
    price: 500,
    category: "Chemistry",
    turnaroundTime: "24 hours",
  },
  {
    id: "crp",
    name: "C-Reactive Protein",
    description: "Measures inflammation in the body",
    price: 600,
    category: "Immunology",
    turnaroundTime: "24 hours",
  },
  {
    id: "esr",
    name: "Erythrocyte Sedimentation Rate",
    description: "Measures how quickly red blood cells settle",
    price: 400,
    category: "Hematology",
    turnaroundTime: "24 hours",
  },
  {
    id: "glucose",
    name: "Glucose Test",
    description: "Measures blood sugar levels",
    price: 300,
    category: "Diabetes",
    preparationRequired: true,
    preparationInstructions: "Fasting for 8 hours before the test",
    turnaroundTime: "24 hours",
  },
  {
    id: "vitamin-d",
    name: "Vitamin D",
    description: "Measures vitamin D levels in the blood",
    price: 900,
    category: "Nutrition",
    turnaroundTime: "2-3 days",
  },
  {
    id: "vitamin-b12",
    name: "Vitamin B12",
    description: "Measures vitamin B12 levels in the blood",
    price: 800,
    category: "Nutrition",
    turnaroundTime: "2-3 days",
  },
  {
    id: "iron",
    name: "Iron Studies",
    description: "Measures iron, ferritin, and transferrin levels",
    price: 800,
    category: "Hematology",
    turnaroundTime: "24-48 hours",
  },
]

// Lab test packages
export const labTestPackages: LabTestPackage[] = [
  {
    id: "basic-health",
    name: "Basic Health Checkup",
    description: "Essential tests for routine health monitoring",
    tests: ["cbc", "bmp", "urinalysis"],
    price: 1400, // Sum of individual prices
    discountedPrice: 1200, // Discounted package price
    popular: true,
  },
  {
    id: "comprehensive",
    name: "Comprehensive Health Package",
    description: "Complete assessment of overall health status",
    tests: ["cbc", "bmp", "lipid", "liver", "kidney", "thyroid", "urinalysis"],
    price: 4200,
    discountedPrice: 3500,
    popular: true,
  },
  {
    id: "cardiac",
    name: "Cardiac Health Package",
    description: "Focused assessment of heart health",
    tests: ["lipid", "crp", "electrolytes"],
    price: 1800,
    discountedPrice: 1600,
  },
  {
    id: "diabetes",
    name: "Diabetes Screening",
    description: "Tests for diabetes diagnosis and monitoring",
    tests: ["glucose", "hba1c", "kidney"],
    price: 1500,
    discountedPrice: 1300,
  },
  {
    id: "anemia",
    name: "Anemia Screening",
    description: "Tests for anemia diagnosis",
    tests: ["cbc", "iron", "vitamin-b12"],
    price: 2100,
    discountedPrice: 1900,
  },
]

// Helper function to get test by ID
export function getTestById(id: string): LabTest | undefined {
  return labTests.find((test) => test.id === id)
}

// Helper function to get package by ID
export function getPackageById(id: string): LabTestPackage | undefined {
  return labTestPackages.find((pkg) => pkg.id === id)
}

// Helper function to get tests for a package
export function getTestsForPackage(packageId: string): LabTest[] {
  const pkg = getPackageById(packageId)
  if (!pkg) return []

  return pkg.tests.map((testId) => {
    const test = getTestById(testId)
    if (!test) throw new Error(`Test with ID ${testId} not found`)
    return test
  })
}
