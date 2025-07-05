export type PhysiotherapyTreatment = {
  id: string
  name: string
  description: string
  duration: string
  price: number
  category: string
}

export type PhysiotherapyPackage = {
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

// Sample Physiotherapy treatments
export const physiotherapyTreatments: PhysiotherapyTreatment[] = [
  {
    id: "pt1",
    name: "Manual Therapy",
    description: "Hands-on techniques to reduce pain and improve mobility",
    duration: "45 min",
    price: 1800,
    category: "Manual",
  },
  {
    id: "pt2",
    name: "Therapeutic Exercise",
    description: "Customized exercise program to improve strength and function",
    duration: "60 min",
    price: 2000,
    category: "Exercise",
  },
  {
    id: "pt3",
    name: "Electrotherapy",
    description: "Use of electrical stimulation for pain management",
    duration: "30 min",
    price: 1500,
    category: "Modality",
  },
  {
    id: "pt4",
    name: "Ultrasound Therapy",
    description: "Deep heat treatment to reduce inflammation and pain",
    duration: "20 min",
    price: 1200,
    category: "Modality",
  },
  {
    id: "pt5",
    name: "Traction Therapy",
    description: "Spinal decompression for back and neck pain",
    duration: "30 min",
    price: 1600,
    category: "Modality",
  },
  {
    id: "pt6",
    name: "Gait Training",
    description: "Improving walking pattern and balance",
    duration: "45 min",
    price: 1800,
    category: "Exercise",
  },
  {
    id: "pt7",
    name: "Sports Rehabilitation",
    description: "Specialized therapy for sports-related injuries",
    duration: "60 min",
    price: 2500,
    category: "Specialized",
  },
  {
    id: "pt8",
    name: "Postural Assessment",
    description: "Comprehensive evaluation of body posture and alignment",
    duration: "40 min",
    price: 1700,
    category: "Assessment",
  },
]

// Sample Physiotherapy packages
export const physiotherapyPackages: PhysiotherapyPackage[] = [
  {
    id: "ptp1",
    name: "Back Pain Relief",
    description: "Comprehensive treatment plan for chronic back pain",
    treatments: ["pt1", "pt3", "pt5"],
    price: 4500,
    originalPrice: 4900,
    savings: 400,
    savingsPercentage: 8,
    popular: true,
  },
  {
    id: "ptp2",
    name: "Sports Recovery",
    description: "Specialized package for athletes and sports enthusiasts",
    treatments: ["pt2", "pt4", "pt7"],
    price: 5000,
    originalPrice: 5700,
    savings: 700,
    savingsPercentage: 12,
  },
  {
    id: "ptp3",
    name: "Posture Correction",
    description: "Treatment plan to improve posture and reduce related pain",
    treatments: ["pt1", "pt2", "pt8"],
    price: 5000,
    originalPrice: 5500,
    savings: 500,
    savingsPercentage: 9,
  },
  {
    id: "ptp4",
    name: "Complete Rehabilitation",
    description: "Comprehensive rehabilitation program for post-surgery recovery",
    treatments: ["pt1", "pt2", "pt3", "pt6"],
    price: 6500,
    originalPrice: 7100,
    savings: 600,
    savingsPercentage: 8,
    popular: true,
  },
]
