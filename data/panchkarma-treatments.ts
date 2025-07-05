export type PanchkarmaTreatment = {
  id: string
  name: string
  description: string
  duration: string
  price: number
  category: string
}

export type PanchkarmaPackage = {
  id: string
  name: string
  description: string
  treatments: string[]
  price: number
  originalPrice: number
  savings: number
  savingsPercentage: number
  popular?: boolean
}

// Sample Panchkarma treatments
export const panchkarmaTreatments: PanchkarmaTreatment[] = [
  {
    id: "pk1",
    name: "Abhyanga",
    description: "Full body oil massage to improve circulation and relaxation",
    duration: "60 min",
    price: 2500,
    category: "Massage",
  },
  {
    id: "pk2",
    name: "Shirodhara",
    description: "Continuous flow of warm oil on forehead for mental relaxation",
    duration: "45 min",
    price: 3000,
    category: "Therapy",
  },
  {
    id: "pk3",
    name: "Swedana",
    description: "Herbal steam therapy to remove toxins through sweat",
    duration: "30 min",
    price: 1800,
    category: "Detox",
  },
  {
    id: "pk4",
    name: "Nasya",
    description: "Nasal administration of herbal oils to clear sinuses",
    duration: "20 min",
    price: 1500,
    category: "Cleansing",
  },
  {
    id: "pk5",
    name: "Basti",
    description: "Therapeutic enema for colon cleansing and rejuvenation",
    duration: "40 min",
    price: 2800,
    category: "Cleansing",
  },
  {
    id: "pk6",
    name: "Udvartana",
    description: "Herbal powder massage for exfoliation and weight management",
    duration: "50 min",
    price: 2200,
    category: "Massage",
  },
  {
    id: "pk7",
    name: "Pizhichil",
    description: "Continuous stream of warm medicated oil over the body",
    duration: "60 min",
    price: 3500,
    category: "Therapy",
  },
  {
    id: "pk8",
    name: "Kati Basti",
    description: "Localized treatment for lower back pain",
    duration: "30 min",
    price: 2000,
    category: "Therapy",
  },
]

// Sample Panchkarma packages
export const panchkarmaPackages: PanchkarmaPackage[] = [
  {
    id: "pkp1",
    name: "Stress Relief Package",
    description: "Combination of treatments to reduce stress and promote relaxation",
    treatments: ["pk1", "pk2", "pk3"],
    price: 6500,
    originalPrice: 7300,
    savings: 800,
    savingsPercentage: 11,
    popular: true,
  },
  {
    id: "pkp2",
    name: "Detox Package",
    description: "Complete detoxification program for body purification",
    treatments: ["pk3", "pk5", "pk6"],
    price: 6000,
    originalPrice: 6800,
    savings: 800,
    savingsPercentage: 12,
  },
  {
    id: "pkp3",
    name: "Pain Management",
    description: "Specialized treatments for chronic pain conditions",
    treatments: ["pk1", "pk7", "pk8"],
    price: 7000,
    originalPrice: 8000,
    savings: 1000,
    savingsPercentage: 13,
  },
  {
    id: "pkp4",
    name: "Complete Rejuvenation",
    description: "Comprehensive package for total body and mind rejuvenation",
    treatments: ["pk1", "pk2", "pk4", "pk7"],
    price: 9500,
    originalPrice: 10500,
    savings: 1000,
    savingsPercentage: 10,
    popular: true,
  },
]
