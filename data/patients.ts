export type Patient = {
  id: string
  name: string
  email: string
  avatar: string
  age: number
  gender: "Male" | "Female"
  category: "VIP" | "General" | "Pediatric"
  lastVisit: string
  status: "Active" | "Inactive" | "Recent"
}

export const patients: Patient[] = [
  {
    id: "PAT001",
    name: "Liam Johnson",
    email: "liam.johnson@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
    age: 28,
    gender: "Male",
    category: "General",
    lastVisit: "2023-10-26",
    status: "Active",
  },
  {
    id: "PAT002",
    name: "Olivia Smith",
    email: "olivia.smith@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
    age: 45,
    gender: "Female",
    category: "VIP",
    lastVisit: "2023-10-22",
    status: "Active",
  },
  {
    id: "PAT003",
    name: "Noah Williams",
    email: "noah.williams@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
    age: 8,
    gender: "Male",
    category: "Pediatric",
    lastVisit: "2023-09-15",
    status: "Recent",
  },
  {
    id: "PAT004",
    name: "Emma Brown",
    email: "emma.brown@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
    age: 32,
    gender: "Female",
    category: "General",
    lastVisit: "2023-01-20",
    status: "Inactive",
  },
  {
    id: "PAT005",
    name: "James Jones",
    email: "james.jones@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
    age: 51,
    gender: "Male",
    category: "VIP",
    lastVisit: "2023-10-28",
    status: "Active",
  },
  {
    id: "PAT006",
    name: "Ava Garcia",
    email: "ava.garcia@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
    age: 12,
    gender: "Female",
    category: "Pediatric",
    lastVisit: "2023-10-01",
    status: "Recent",
  },
  {
    id: "PAT007",
    name: "William Miller",
    email: "william.miller@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
    age: 62,
    gender: "Male",
    category: "General",
    lastVisit: "2022-12-11",
    status: "Inactive",
  },
  {
    id: "PAT008",
    name: "Sophia Davis",
    email: "sophia.davis@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
    age: 25,
    gender: "Female",
    category: "General",
    lastVisit: "2023-10-25",
    status: "Active",
  },
]
