"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Plus,
  Eye,
  Edit,
  Trash2,
  Search,
  TestTube,
  Microscope,
  Users,
  Stethoscope,
  Construction,
  Leaf,
  Pill,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { SettingsSubNavigation } from "@/components/settings-sub-navigation"
import { usePrescriptionTemplates } from "@/contexts/prescription-template-context"
import { AyurvedicTemplatePreviewModal } from "@/components/modals/ayurvedic-template-preview-modal"

// Master Categories Configuration - Including Prescription Masters
const masterCategories = [
  {
    id: "laboratory",
    name: "Laboratory",
    icon: TestTube,
    description: "Lab tests, units, and packages",
    color: "text-blue-600",
    subCategories: [
      {
        id: "lab-tests",
        name: "Lab Tests",
        description: "Laboratory test definitions",
        fields: [
          { key: "name", label: "Test Name", type: "text", required: true },
          { key: "category", label: "Category", type: "text", required: true },
          { key: "cost", label: "Cost", type: "number", required: true },
          { key: "normalRange", label: "Normal Range", type: "text" },
          { key: "barCode", label: "Bar Code", type: "text" },
          { key: "preferredLab", label: "Preferred Lab", type: "text" },
          { key: "units", label: "Units", type: "text" },
        ],
      },
      {
        id: "lab-units",
        name: "Lab Units",
        description: "Measurement units for lab tests",
        fields: [
          { key: "name", label: "Unit Name", type: "text", required: true },
          { key: "description", label: "Description", type: "textarea" },
        ],
      },
      {
        id: "lab-packages",
        name: "Lab Packages",
        description: "Lab test packages",
        fields: [
          { key: "name", label: "Package Name", type: "text", required: true },
          { key: "tests", label: "Tests", type: "multiselect" },
        ],
      },
    ],
  },
  {
    id: "radiology",
    name: "Radiology",
    icon: Microscope,
    description: "Imaging tests and packages",
    color: "text-green-600",
    subCategories: [
      {
        id: "imaging-tests",
        name: "Imaging Tests",
        description: "Radiology and imaging test definitions",
        fields: [
          { key: "name", label: "Test Name", type: "text", required: true },
          { key: "category", label: "Category", type: "text", required: true },
          { key: "cost", label: "Cost", type: "number", required: true },
          { key: "barCode", label: "Bar Code", type: "text" },
          { key: "preferredLab", label: "Preferred Lab", type: "text" },
        ],
      },
      {
        id: "radiology-packages",
        name: "Radiology Packages",
        description: "Radiology test packages",
        fields: [
          { key: "name", label: "Package Name", type: "text", required: true },
          { key: "tests", label: "Tests", type: "multiselect" },
        ],
      },
    ],
  },
  {
    id: "medicines",
    name: "Medicines",
    icon: Pill,
    description: "Medicine inventory and formulations",
    color: "text-blue-600",
    subCategories: [
      {
        id: "allopathic-medicines",
        name: "Allopathic Medicines",
        description: "Modern pharmaceutical medicines",
        fields: [
          { key: "name", label: "Medicine Name", type: "text", required: true },
          { key: "genericName", label: "Generic Name", type: "text" },
          { key: "strength", label: "Strength", type: "text", required: true },
          {
            key: "dosageForm",
            label: "Dosage Form",
            type: "select",
            options: ["Tablet", "Capsule", "Syrup", "Injection", "Drops", "Cream", "Ointment", "Powder"],
          },
          { key: "manufacturer", label: "Manufacturer", type: "text" },
          { key: "category", label: "Category", type: "text" },
          { key: "price", label: "Price per Unit", type: "number" },
          { key: "stockQuantity", label: "Stock Quantity", type: "number" },
          { key: "expiryDate", label: "Expiry Date", type: "date" },
          { key: "batchNumber", label: "Batch Number", type: "text" },
          { key: "minStockLevel", label: "Minimum Stock Level", type: "number" },
        ],
      },
      {
        id: "ayurvedic-medicines",
        name: "Ayurvedic Medicines",
        description: "Traditional Ayurvedic formulations",
        fields: [
          { key: "name", label: "Medicine Name", type: "text", required: true },
          { key: "sanskritName", label: "Sanskrit Name", type: "text" },
          {
            key: "form",
            label: "Form",
            type: "select",
            options: ["Kadha", "Tablet", "Churna", "Vati", "Ghrita", "Taila", "Asava", "Arishta", "Kwath", "Bhasma"],
          },
          { key: "constituents", label: "Main Constituents", type: "multiselect" },
          { key: "manufacturer", label: "Manufacturer", type: "text" },
          { key: "category", label: "Category", type: "text" },
          { key: "price", label: "Price per Unit", type: "number" },
          { key: "stockQuantity", label: "Stock Quantity", type: "number" },
          { key: "expiryDate", label: "Expiry Date", type: "date" },
          { key: "batchNumber", label: "Batch Number", type: "text" },
          { key: "minStockLevel", label: "Minimum Stock Level", type: "number" },
        ],
      },
      {
        id: "medicine-categories",
        name: "Medicine Categories",
        description: "Therapeutic categories for medicines",
        fields: [
          { key: "name", label: "Category Name", type: "text", required: true },
          { key: "description", label: "Description", type: "textarea" },
          { key: "type", label: "Type", type: "select", options: ["Allopathic", "Ayurvedic", "Both"] },
          { key: "parentCategory", label: "Parent Category", type: "text" },
        ],
      },
      {
        id: "manufacturers",
        name: "Manufacturers",
        description: "Medicine manufacturers and suppliers",
        fields: [
          { key: "name", label: "Manufacturer Name", type: "text", required: true },
          { key: "contactPerson", label: "Contact Person", type: "text" },
          { key: "phone", label: "Phone", type: "text" },
          { key: "email", label: "Email", type: "email" },
          { key: "address", label: "Address", type: "textarea" },
          { key: "licenseNumber", label: "License Number", type: "text" },
          { key: "type", label: "Type", type: "select", options: ["Allopathic", "Ayurvedic", "Both"] },
          { key: "gstNumber", label: "GST Number", type: "text" },
          { key: "status", label: "Status", type: "select", options: ["Active", "Inactive"] },
        ],
      },
    ],
  },
  {
    id: "dosage-instructions",
    name: "Dosage & Instructions",
    icon: Stethoscope,
    description: "Dosage patterns and prescription instructions",
    color: "text-purple-600",
    subCategories: [
      {
        id: "dosage-patterns",
        name: "Dosage Patterns",
        description: "Standard dosage timing patterns",
        fields: [
          { key: "pattern", label: "Pattern", type: "text", required: true },
          { key: "description", label: "Description", type: "text", required: true },
          { key: "frequency", label: "Daily Frequency", type: "number" },
          { key: "type", label: "Medicine Type", type: "select", options: ["Allopathic", "Ayurvedic", "Both"] },
          { key: "instructions", label: "Instructions", type: "textarea" },
        ],
      },
      {
        id: "timing-instructions",
        name: "Timing Instructions",
        description: "When to take medicines (before/after food)",
        fields: [
          { key: "instruction", label: "Instruction", type: "text", required: true },
          { key: "description", label: "Description", type: "text" },
          { key: "type", label: "Medicine Type", type: "select", options: ["Allopathic", "Ayurvedic", "Both"] },
          { key: "timeOffset", label: "Time Offset (minutes)", type: "number" },
        ],
      },
      {
        id: "duration-options",
        name: "Duration Options",
        description: "Standard treatment duration options",
        fields: [
          { key: "duration", label: "Duration", type: "text", required: true },
          { key: "days", label: "Days", type: "number" },
          {
            key: "category",
            label: "Category",
            type: "select",
            options: ["Short Term", "Medium Term", "Long Term", "Chronic", "Variable"],
          },
          { key: "description", label: "Description", type: "textarea" },
        ],
      },
      {
        id: "dietary-instructions",
        name: "Dietary Instructions",
        description: "Dietary guidelines and restrictions",
        fields: [
          { key: "instruction", label: "Instruction", type: "text", required: true },
          {
            key: "type",
            label: "Type",
            type: "select",
            options: ["Restriction", "Recommendation", "Pathya", "Apathya"],
          },
          { key: "category", label: "Category", type: "text" },
          { key: "description", label: "Description", type: "textarea" },
          { key: "condition", label: "Applicable Condition", type: "text" },
        ],
      },
    ],
  },
  {
    id: "ayurvedic-constituents",
    name: "Ayurvedic Constituents",
    icon: Leaf,
    description: "Ayurvedic herbs and formulation components",
    color: "text-green-600",
    subCategories: [
      {
        id: "herbs",
        name: "Herbs & Ingredients",
        description: "Individual Ayurvedic herbs and ingredients",
        fields: [
          { key: "name", label: "Common Name", type: "text", required: true },
          { key: "sanskritName", label: "Sanskrit Name", type: "text" },
          { key: "botanicalName", label: "Botanical Name", type: "text" },
          { key: "properties", label: "Properties", type: "text" },
          {
            key: "rasa",
            label: "Rasa (Taste)",
            type: "select",
            options: ["Madhura", "Amla", "Lavana", "Katu", "Tikta", "Kashaya"],
          },
          { key: "virya", label: "Virya (Potency)", type: "select", options: ["Ushna", "Sheeta"] },
          { key: "vipaka", label: "Vipaka", type: "select", options: ["Madhura", "Amla", "Katu"] },
          { key: "doshaEffect", label: "Dosha Effect", type: "text" },
          { key: "therapeuticUse", label: "Therapeutic Use", type: "textarea" },
          { key: "partUsed", label: "Part Used", type: "text" },
        ],
      },
      {
        id: "classical-formulations",
        name: "Classical Formulations",
        description: "Traditional Ayurvedic formulations",
        fields: [
          { key: "name", label: "Formulation Name", type: "text", required: true },
          { key: "sanskritName", label: "Sanskrit Name", type: "text" },
          { key: "reference", label: "Classical Reference", type: "text" },
          { key: "ingredients", label: "Main Ingredients", type: "multiselect" },
          { key: "indication", label: "Main Indication", type: "text" },
          { key: "dosage", label: "Standard Dosage", type: "text" },
          { key: "anupana", label: "Anupana (Vehicle)", type: "text" },
          { key: "contraindications", label: "Contraindications", type: "textarea" },
        ],
      },
      {
        id: "pathya-apathya",
        name: "Pathya-Apathya",
        description: "Do's and Don'ts in Ayurvedic treatment",
        fields: [
          { key: "item", label: "Item", type: "text", required: true },
          { key: "type", label: "Type", type: "select", options: ["Pathya", "Apathya"], required: true },
          {
            key: "category",
            label: "Category",
            type: "select",
            options: ["Food", "Lifestyle", "Activity", "Behavior", "Season"],
          },
          { key: "condition", label: "Applicable Condition", type: "text" },
          { key: "description", label: "Description", type: "textarea" },
          { key: "season", label: "Season", type: "select", options: ["All", "Summer", "Winter", "Monsoon"] },
        ],
      },
    ],
  },
  {
    id: "clinical",
    name: "Clinical Notes",
    icon: Users,
    description: "Patient clinical note templates",
    color: "text-purple-600",
    subCategories: [
      {
        id: "chief-complaints",
        name: "Chief Complaints",
        description: "Common patient complaints",
        fields: [
          { key: "name", label: "Complaint", type: "text", required: true },
          { key: "category", label: "Category", type: "text" },
          { key: "description", label: "Description", type: "textarea" },
        ],
      },
      {
        id: "medical-history",
        name: "Medical History",
        description: "Medical history items",
        fields: [
          { key: "name", label: "History Item", type: "text", required: true },
          { key: "category", label: "Category", type: "text" },
          { key: "description", label: "Description", type: "textarea" },
        ],
      },
      {
        id: "investigation",
        name: "Investigation",
        description: "Investigation procedures",
        fields: [
          { key: "name", label: "Investigation", type: "text", required: true },
          { key: "category", label: "Category", type: "text" },
          { key: "description", label: "Description", type: "textarea" },
        ],
      },
      {
        id: "observation",
        name: "Observation",
        description: "Clinical observations",
        fields: [
          { key: "name", label: "Observation", type: "text", required: true },
          { key: "category", label: "Category", type: "text" },
          { key: "description", label: "Description", type: "textarea" },
        ],
      },
    ],
  },
  {
    id: "diagnosis",
    name: "Diagnosis",
    icon: Stethoscope,
    description: "Medical diagnoses and ICD codes",
    color: "text-red-600",
    subCategories: [
      {
        id: "diagnoses",
        name: "Diagnoses",
        description: "Medical diagnoses with ICD codes",
        fields: [
          { key: "name", label: "Diagnosis Name", type: "text", required: true },
          { key: "icdCode", label: "ICD Code", type: "text", required: true },
          { key: "category", label: "Category", type: "text" },
          { key: "description", label: "Description", type: "textarea" },
        ],
      },
    ],
  },
  {
    id: "prescription-templates",
    name: "Prescription Templates",
    icon: Pill,
    description: "Ayurvedic and Allopathic prescription templates",
    color: "text-indigo-600",
    subCategories: [
      {
        id: "ayurvedic-templates",
        name: "Ayurvedic Templates",
        description: "Ayurvedic prescription templates",
        fields: [],
      },
      {
        id: "allopathic-templates",
        name: "Allopathic Templates",
        description: "Allopathic prescription templates",
        fields: [],
      },
    ],
  },
]

// Sample data for each master
const sampleData = {
  "lab-tests": [
    {
      id: 1,
      name: "Complete Blood Count",
      category: "Hematology",
      cost: 250,
      normalRange: "4.5-11.0 x10³/μL",
      barCode: "CBC001",
      preferredLab: "Central Lab",
      units: "x10³/μL",
    },
    {
      id: 2,
      name: "Blood Sugar Fasting",
      category: "Biochemistry",
      cost: 80,
      normalRange: "70-100 mg/dL",
      barCode: "BSF001",
      preferredLab: "Central Lab",
      units: "mg/dL",
    },
    {
      id: 3,
      name: "Lipid Profile",
      category: "Biochemistry",
      cost: 400,
      normalRange: "Total: <200 mg/dL",
      barCode: "LP001",
      preferredLab: "Central Lab",
      units: "mg/dL",
    },
    {
      id: 4,
      name: "Thyroid Function Test",
      category: "Endocrinology",
      cost: 600,
      normalRange: "TSH: 0.4-4.0 mIU/L",
      barCode: "TFT001",
      preferredLab: "Specialty Lab",
      units: "mIU/L",
    },
    {
      id: 5,
      name: "Liver Function Test",
      category: "Biochemistry",
      cost: 350,
      normalRange: "ALT: 7-56 U/L",
      barCode: "LFT001",
      preferredLab: "Central Lab",
      units: "U/L",
    },
  ],
  "lab-units": [
    { id: 1, name: "mg/dL", description: "Milligrams per deciliter" },
    { id: 2, name: "x10³/μL", description: "Thousands per microliter" },
    { id: 3, name: "mIU/L", description: "Milli-international units per liter" },
    { id: 4, name: "g/dL", description: "Grams per deciliter" },
    { id: 5, name: "IU/L", description: "International units per liter" },
    { id: 6, name: "U/L", description: "Units per liter" },
  ],
  "lab-packages": [
    { id: 1, name: "Basic Health Checkup", tests: ["Complete Blood Count", "Blood Sugar Fasting", "Lipid Profile"] },
    { id: 2, name: "Diabetes Panel", tests: ["Blood Sugar Fasting", "HbA1c", "Urine Sugar"] },
    { id: 3, name: "Cardiac Profile", tests: ["Lipid Profile", "Troponin", "ECG"] },
    { id: 4, name: "Thyroid Package", tests: ["Thyroid Function Test", "T3", "T4"] },
    { id: 5, name: "Liver Package", tests: ["Liver Function Test", "Bilirubin", "Protein"] },
  ],
  "imaging-tests": [
    { id: 1, name: "Chest X-Ray", category: "X-Ray", cost: 300, barCode: "CXR001", preferredLab: "Radiology Dept" },
    {
      id: 2,
      name: "CT Scan Head",
      category: "CT Scan",
      cost: 2500,
      barCode: "CTH001",
      preferredLab: "Advanced Imaging",
    },
    { id: 3, name: "MRI Brain", category: "MRI", cost: 8000, barCode: "MRB001", preferredLab: "Advanced Imaging" },
    {
      id: 4,
      name: "Ultrasound Abdomen",
      category: "Ultrasound",
      cost: 800,
      barCode: "USA001",
      preferredLab: "Radiology Dept",
    },
    {
      id: 5,
      name: "Mammography",
      category: "X-Ray",
      cost: 1200,
      barCode: "MAM001",
      preferredLab: "Women's Imaging",
    },
  ],
  "radiology-packages": [
    { id: 1, name: "Basic Imaging", tests: ["Chest X-Ray", "Ultrasound Abdomen"] },
    { id: 2, name: "Neurological Imaging", tests: ["CT Scan Head", "MRI Brain"] },
    { id: 3, name: "Cardiac Imaging", tests: ["Chest X-Ray", "ECG", "Echo"] },
    { id: 4, name: "Women's Health Imaging", tests: ["Mammography", "Pelvic Ultrasound"] },
  ],
  "allopathic-medicines": [
    {
      id: 1,
      name: "Paracetamol 500mg",
      genericName: "Paracetamol",
      strength: "500mg",
      dosageForm: "Tablet",
      manufacturer: "ABC Pharma",
      category: "Analgesic",
      price: 2.5,
      stockQuantity: 1000,
      expiryDate: "2025-12-31",
      batchNumber: "PCM001",
      minStockLevel: 100,
    },
    {
      id: 2,
      name: "Amoxicillin 500mg",
      genericName: "Amoxicillin",
      strength: "500mg",
      dosageForm: "Capsule",
      manufacturer: "XYZ Pharma",
      category: "Antibiotic",
      price: 8.0,
      stockQuantity: 500,
      expiryDate: "2025-06-30",
      batchNumber: "AMX001",
      minStockLevel: 50,
    },
    {
      id: 3,
      name: "Omeprazole 20mg",
      genericName: "Omeprazole",
      strength: "20mg",
      dosageForm: "Capsule",
      manufacturer: "DEF Pharma",
      category: "Proton Pump Inhibitor",
      price: 5.0,
      stockQuantity: 750,
      expiryDate: "2025-09-15",
      batchNumber: "OME001",
      minStockLevel: 75,
    },
    {
      id: 4,
      name: "Metformin 500mg",
      genericName: "Metformin",
      strength: "500mg",
      dosageForm: "Tablet",
      manufacturer: "GHI Pharma",
      category: "Antidiabetic",
      price: 3.0,
      stockQuantity: 800,
      expiryDate: "2025-11-20",
      batchNumber: "MET001",
      minStockLevel: 80,
    },
    {
      id: 5,
      name: "Amlodipine 5mg",
      genericName: "Amlodipine",
      strength: "5mg",
      dosageForm: "Tablet",
      manufacturer: "JKL Pharma",
      category: "Antihypertensive",
      price: 4.5,
      stockQuantity: 600,
      expiryDate: "2025-08-10",
      batchNumber: "AML001",
      minStockLevel: 60,
    },
  ],
  "ayurvedic-medicines": [
    {
      id: 1,
      name: "Triphala Churna",
      sanskritName: "त्रिफला चूर्ण",
      form: "Churna",
      constituents: ["Amalaki", "Bibhitaki", "Haritaki"],
      manufacturer: "Ayur Pharma",
      category: "Digestive",
      price: 150.0,
      stockQuantity: 200,
      expiryDate: "2025-12-31",
      batchNumber: "TRI001",
      minStockLevel: 20,
    },
    {
      id: 2,
      name: "Ashwagandha Tablet",
      sanskritName: "अश्वगंधा",
      form: "Tablet",
      constituents: ["Ashwagandha Root Extract"],
      manufacturer: "Herbal Life",
      category: "Rasayana",
      price: 300.0,
      stockQuantity: 150,
      expiryDate: "2025-10-15",
      batchNumber: "ASH001",
      minStockLevel: 15,
    },
    {
      id: 3,
      name: "Brahmi Ghrita",
      sanskritName: "ब्राह्मी घृत",
      form: "Ghrita",
      constituents: ["Brahmi", "Go Ghrita", "Shankhpushpi"],
      manufacturer: "Classical Ayurveda",
      category: "Medhya Rasayana",
      price: 450.0,
      stockQuantity: 80,
      expiryDate: "2025-07-20",
      batchNumber: "BRA001",
      minStockLevel: 8,
    },
    {
      id: 4,
      name: "Dashmool Kadha",
      sanskritName: "दशमूल काढ़ा",
      form: "Kadha",
      constituents: ["Bilva", "Agnimantha", "Shyonaka", "Patala", "Gambhari"],
      manufacturer: "Vaidya Pharma",
      category: "Vata Shamak",
      price: 200.0,
      stockQuantity: 120,
      expiryDate: "2025-09-30",
      batchNumber: "DAS001",
      minStockLevel: 12,
    },
    {
      id: 5,
      name: "Saraswatarishta",
      sanskritName: "सरस्वतारिष्ट",
      form: "Arishta",
      constituents: ["Brahmi", "Shankhpushpi", "Vacha", "Jatamansi"],
      manufacturer: "Traditional Remedies",
      category: "Medhya Rasayana",
      price: 180.0,
      stockQuantity: 100,
      expiryDate: "2025-11-10",
      batchNumber: "SAR001",
      minStockLevel: 10,
    },
  ],
  "medicine-categories": [
    {
      id: 1,
      name: "Analgesic",
      description: "Pain relieving medications",
      type: "Allopathic",
      parentCategory: "Pain Management",
    },
    {
      id: 2,
      name: "Antibiotic",
      description: "Antimicrobial medications",
      type: "Allopathic",
      parentCategory: "Anti-infective",
    },
    {
      id: 3,
      name: "Antihypertensive",
      description: "Blood pressure lowering medications",
      type: "Allopathic",
      parentCategory: "Cardiovascular",
    },
    {
      id: 4,
      name: "Rasayana",
      description: "Rejuvenative and tonic formulations",
      type: "Ayurvedic",
      parentCategory: "Tonics",
    },
    {
      id: 5,
      name: "Digestive",
      description: "Digestive and carminative medicines",
      type: "Both",
      parentCategory: "Gastrointestinal",
    },
    {
      id: 6,
      name: "Respiratory",
      description: "Respiratory system medicines",
      type: "Both",
      parentCategory: "Respiratory System",
    },
    {
      id: 7,
      name: "Medhya Rasayana",
      description: "Brain tonics and nootropics",
      type: "Ayurvedic",
      parentCategory: "Neurological",
    },
    {
      id: 8,
      name: "Vata Shamak",
      description: "Vata dosha pacifying medicines",
      type: "Ayurvedic",
      parentCategory: "Dosha Balance",
    },
  ],
  manufacturers: [
    {
      id: 1,
      name: "ABC Pharma Ltd",
      contactPerson: "Dr. Rajesh Kumar",
      phone: "+91-9876543210",
      email: "contact@abcpharma.com",
      address: "123 Industrial Area, Mumbai, Maharashtra",
      licenseNumber: "MH-ABC-2023-001",
      type: "Allopathic",
      gstNumber: "27ABCDE1234F1Z5",
      status: "Active",
    },
    {
      id: 2,
      name: "Ayur Pharma",
      contactPerson: "Vaidya Suresh Sharma",
      phone: "+91-9876543211",
      email: "info@ayurpharma.com",
      address: "456 Herbal Complex, Haridwar, Uttarakhand",
      licenseNumber: "UK-AYU-2023-002",
      type: "Ayurvedic",
      gstNumber: "05FGHIJ5678K2L6",
      status: "Active",
    },
    {
      id: 3,
      name: "XYZ Pharmaceuticals",
      contactPerson: "Mr. Amit Patel",
      phone: "+91-9876543212",
      email: "sales@xyzpharma.com",
      address: "789 Pharma Park, Ahmedabad, Gujarat",
      licenseNumber: "GJ-XYZ-2023-003",
      type: "Allopathic",
      gstNumber: "24MNOPQ9012R3S7",
      status: "Active",
    },
    {
      id: 4,
      name: "Classical Ayurveda",
      contactPerson: "Dr. Priya Joshi",
      phone: "+91-9876543213",
      email: "orders@classicalayurveda.com",
      address: "321 Traditional Medicine Center, Pune, Maharashtra",
      licenseNumber: "MH-CLA-2023-004",
      type: "Ayurvedic",
      gstNumber: "27TUVWX3456Y4Z8",
      status: "Active",
    },
    {
      id: 5,
      name: "Universal Remedies",
      contactPerson: "Dr. Vikram Singh",
      phone: "+91-9876543214",
      email: "support@universalremedies.com",
      address: "654 Medical Complex, Delhi",
      licenseNumber: "DL-UNI-2023-005",
      type: "Both",
      gstNumber: "07ABCDE7890F5G9",
      status: "Active",
    },
  ],
  "dosage-patterns": [
    {
      id: 1,
      pattern: "1-0-0",
      description: "Once daily - Morning",
      frequency: 1,
      type: "Both",
      instructions: "Take in the morning",
    },
    {
      id: 2,
      pattern: "0-1-0",
      description: "Once daily - Afternoon",
      frequency: 1,
      type: "Both",
      instructions: "Take in the afternoon",
    },
    {
      id: 3,
      pattern: "0-0-1",
      description: "Once daily - Evening",
      frequency: 1,
      type: "Both",
      instructions: "Take in the evening",
    },
    {
      id: 4,
      pattern: "1-1-0",
      description: "Twice daily - Morning & Afternoon",
      frequency: 2,
      type: "Both",
      instructions: "Take morning and afternoon",
    },
    {
      id: 5,
      pattern: "1-0-1",
      description: "Twice daily - Morning & Evening",
      frequency: 2,
      type: "Both",
      instructions: "Take morning and evening",
    },
    {
      id: 6,
      pattern: "0-1-1",
      description: "Twice daily - Afternoon & Evening",
      frequency: 2,
      type: "Both",
      instructions: "Take afternoon and evening",
    },
    {
      id: 7,
      pattern: "1-1-1",
      description: "Three times daily",
      frequency: 3,
      type: "Both",
      instructions: "Take three times a day",
    },
    {
      id: 8,
      pattern: "2-2-2",
      description: "Two tablets/doses three times daily",
      frequency: 3,
      type: "Both",
      instructions: "Take 2 tablets three times daily",
    },
    {
      id: 9,
      pattern: "SOS",
      description: "As needed when symptoms occur",
      frequency: 0,
      type: "Both",
      instructions: "Take as needed",
    },
    {
      id: 10,
      pattern: "STAT",
      description: "Immediately/Single dose",
      frequency: 1,
      type: "Allopathic",
      instructions: "Take immediately",
    },
  ],
  "timing-instructions": [
    {
      id: 1,
      instruction: "Before Food",
      description: "Take 30-60 minutes before meals",
      type: "Both",
      timeOffset: -30,
    },
    { id: 2, instruction: "After Food", description: "Take 30-60 minutes after meals", type: "Both", timeOffset: 30 },
    { id: 3, instruction: "With Food", description: "Take along with meals", type: "Allopathic", timeOffset: 0 },
    { id: 4, instruction: "Empty Stomach", description: "Take on empty stomach", type: "Both", timeOffset: -60 },
    { id: 5, instruction: "At Bedtime", description: "Take before going to sleep", type: "Both", timeOffset: 0 },
    { id: 6, instruction: "With Milk", description: "Take with warm milk", type: "Ayurvedic", timeOffset: 0 },
    { id: 7, instruction: "With Honey", description: "Take with honey", type: "Ayurvedic", timeOffset: 0 },
    {
      id: 8,
      instruction: "With Warm Water",
      description: "Take with lukewarm water",
      type: "Ayurvedic",
      timeOffset: 0,
    },
  ],
  "duration-options": [
    { id: 1, duration: "3 days", days: 3, category: "Short Term", description: "Short course treatment" },
    { id: 2, duration: "5 days", days: 5, category: "Short Term", description: "Standard antibiotic course" },
    { id: 3, duration: "7 days", days: 7, category: "Short Term", description: "One week treatment" },
    { id: 4, duration: "10 days", days: 10, category: "Short Term", description: "Extended short course" },
    { id: 5, duration: "15 days", days: 15, category: "Medium Term", description: "Two weeks treatment" },
    { id: 6, duration: "1 month", days: 30, category: "Medium Term", description: "One month course" },
    { id: 7, duration: "2 months", days: 60, category: "Long Term", description: "Two months treatment" },
    { id: 8, duration: "3 months", days: 90, category: "Long Term", description: "Three months course" },
    { id: 9, duration: "6 months", days: 180, category: "Chronic", description: "Long term maintenance" },
    {
      id: 10,
      duration: "Until symptoms resolve",
      days: 0,
      category: "Variable",
      description: "Continue until improvement",
    },
  ],
  "dietary-instructions": [
    {
      id: 1,
      instruction: "Avoid alcohol",
      type: "Restriction",
      category: "Lifestyle",
      description: "Complete avoidance of alcoholic beverages",
      condition: "General",
    },
    {
      id: 2,
      instruction: "Avoid spicy food",
      type: "Restriction",
      category: "Food",
      description: "Avoid hot and spicy foods",
      condition: "Gastric disorders",
    },
    {
      id: 3,
      instruction: "Light food",
      type: "Pathya",
      category: "Food",
      description: "Consume easily digestible foods",
      condition: "Digestive disorders",
    },
    {
      id: 4,
      instruction: "Warm water",
      type: "Pathya",
      category: "Food",
      description: "Drink warm water throughout the day",
      condition: "General",
    },
    {
      id: 5,
      instruction: "Cold food",
      type: "Apathya",
      category: "Food",
      condition: "Respiratory",
      description: "Cold foods worsen respiratory conditions",
    },
    {
      id: 6,
      instruction: "Heavy meals",
      type: "Apathya",
      category: "Food",
      condition: "Digestive",
      description: "Difficult to digest foods",
    },
    {
      id: 7,
      instruction: "Regular exercise",
      type: "Recommendation",
      category: "Lifestyle",
      description: "Maintain regular physical activity",
      condition: "General",
    },
    {
      id: 8,
      instruction: "Adequate sleep",
      type: "Recommendation",
      category: "Lifestyle",
      description: "Get 7-8 hours of quality sleep",
      condition: "General",
    },
    {
      id: 9,
      instruction: "Avoid smoking",
      type: "Restriction",
      category: "Lifestyle",
      description: "Complete cessation of smoking",
      condition: "Respiratory disorders",
    },
    {
      id: 10,
      instruction: "Drink plenty of water",
      type: "Recommendation",
      category: "Food",
      description: "Maintain adequate hydration",
      condition: "General",
    },
  ],
  herbs: [
    {
      id: 1,
      name: "Ashwagandha",
      sanskritName: "अश्वगंधा",
      botanicalName: "Withania somnifera",
      properties: "Rasayana, Balya, Vajikara",
      rasa: "Tikta",
      virya: "Ushna",
      vipaka: "Madhura",
      doshaEffect: "Vata-Kapha shamak",
      therapeuticUse: "Stress, weakness, immunity, reproductive health",
      partUsed: "Root",
    },
    {
      id: 2,
      name: "Brahmi",
      sanskritName: "ब्राह्मी",
      botanicalName: "Bacopa monnieri",
      properties: "Medhya, Rasayana",
      rasa: "Tikta",
      virya: "Sheeta",
      vipaka: "Madhura",
      doshaEffect: "Tridosha shamak",
      therapeuticUse: "Memory, concentration, mental clarity, anxiety",
      partUsed: "Whole plant",
    },
    {
      id: 3,
      name: "Triphala",
      sanskritName: "त्रिफला",
      botanicalName: "Combination of three fruits",
      properties: "Rasayana, Anulomana",
      rasa: "Pancha rasa (except Lavana)",
      virya: "Sheeta",
      vipaka: "Madhura",
      doshaEffect: "Tridosha shamak",
      therapeuticUse: "Digestion, detoxification, eye health, immunity",
      partUsed: "Fruit",
    },
    {
      id: 4,
      name: "Tulsi",
      sanskritName: "तुलसी",
      botanicalName: "Ocimum sanctum",
      properties: "Kasa-swasa hara, Jvara hara",
      rasa: "Katu",
      virya: "Ushna",
      vipaka: "Katu",
      doshaEffect: "Kapha-Vata shamak",
      therapeuticUse: "Respiratory disorders, fever, immunity, stress",
      partUsed: "Leaves",
    },
    {
      id: 5,
      name: "Neem",
      sanskritName: "निम्ब",
      botanicalName: "Azadirachta indica",
      properties: "Kushta ghna, Krimi ghna",
      rasa: "Tikta",
      virya: "Sheeta",
      vipaka: "Katu",
      doshaEffect: "Pitta-Kapha shamak",
      therapeuticUse: "Skin disorders, infections, diabetes, immunity",
      partUsed: "Leaves, bark",
    },
  ],
  "classical-formulations": [
    {
      id: 1,
      name: "Chyawanprash",
      sanskritName: "च्यवनप्राश",
      reference: "Charaka Samhita",
      ingredients: ["Amalaki", "Bilva", "Agnimantha", "Shyonaka", "Patala"],
      indication: "Immunity, respiratory health, general weakness",
      dosage: "1-2 teaspoons twice daily",
      anupana: "Warm milk or water",
      contraindications: "Diabetes (sugar-free version available)",
    },
    {
      id: 2,
      name: "Saraswatarishta",
      sanskritName: "सरस्वतारिष्ट",
      reference: "Bhaishajya Ratnavali",
      ingredients: ["Brahmi", "Shankhpushpi", "Vacha", "Jatamansi"],
      indication: "Memory enhancement, mental clarity",
      dosage: "15-30ml twice daily",
      anupana: "Equal quantity of water",
      contraindications: "Avoid in acute fever",
    },
    {
      id: 3,
      name: "Dashmool Kadha",
      sanskritName: "दशमूल काढ़ा",
      reference: "Sushruta Samhita",
      ingredients: ["Bilva", "Agnimantha", "Shyonaka", "Patala", "Gambhari"],
      indication: "Vata disorders, joint pain, inflammation",
      dosage: "40-80ml twice daily",
      anupana: "After food",
      contraindications: "High blood pressure",
    },
    {
      id: 4,
      name: "Triphala Churna",
      sanskritName: "त्रिफला चूर्ण",
      reference: "Sushruta Samhita",
      ingredients: ["Amalaki", "Bibhitaki", "Haritaki"],
      indication: "Digestive health, detoxification",
      dosage: "3-6g at bedtime",
      anupana: "Warm water",
      contraindications: "Pregnancy, diarrhea",
    },
    {
      id: 5,
      name: "Hingwashtak Churna",
      sanskritName: "हिंग्वष्टक चूर्ण",
      reference: "Sharangdhara Samhita",
      ingredients: ["Hing", "Jeera", "Dhania", "Ajwain", "Pippali"],
      indication: "Digestive disorders, gas, bloating",
      dosage: "1-3g before meals",
      anupana: "Warm water",
      contraindications: "Hyperacidity",
    },
  ],
  "pathya-apathya": [
    {
      id: 1,
      item: "Light food",
      type: "Pathya",
      category: "Food",
      condition: "General",
      description: "Easily digestible foods",
      season: "All",
    },
    {
      id: 2,
      item: "Warm water",
      type: "Pathya",
      category: "Food",
      condition: "General",
      description: "Lukewarm water for drinking",
      season: "All",
    },
    {
      id: 3,
      item: "Cold food",
      type: "Apathya",
      category: "Food",
      condition: "Respiratory",
      description: "Cold foods worsen respiratory conditions",
      season: "Winter",
    },
    {
      id: 4,
      item: "Heavy meals",
      type: "Apathya",
      category: "Food",
      condition: "Digestive",
      description: "Difficult to digest foods",
      season: "All",
    },
    {
      id: 5,
      item: "Regular exercise",
      type: "Pathya",
      category: "Activity",
      condition: "General",
      description: "Moderate physical activity",
      season: "All",
    },
    {
      id: 6,
      item: "Day sleep",
      type: "Apathya",
      category: "Lifestyle",
      condition: "Kapha disorders",
      description: "Sleeping during day increases Kapha",
      season: "All",
    },
    {
      id: 7,
      item: "Early to bed",
      type: "Pathya",
      category: "Lifestyle",
      condition: "General",
      description: "Sleep before 10 PM",
      season: "All",
    },
    {
      id: 8,
      item: "Stress",
      type: "Apathya",
      category: "Behavior",
      condition: "Mental health",
      description: "Mental stress affects all doshas",
      season: "All",
    },
  ],
  "chief-complaints": [
    { id: 1, name: "Fever", category: "General", description: "Elevated body temperature" },
    { id: 2, name: "Headache", category: "Neurological", description: "Pain in head or neck region" },
    { id: 3, name: "Chest Pain", category: "Cardiac", description: "Pain or discomfort in chest area" },
    { id: 4, name: "Shortness of Breath", category: "Respiratory", description: "Difficulty in breathing" },
    { id: 5, name: "Abdominal Pain", category: "Gastrointestinal", description: "Pain in abdominal region" },
    { id: 6, name: "Back Pain", category: "Musculoskeletal", description: "Pain in back region" },
    { id: 7, name: "Dizziness", category: "Neurological", description: "Feeling of unsteadiness" },
    { id: 8, name: "Nausea", category: "Gastrointestinal", description: "Feeling of sickness" },
  ],
  "medical-history": [
    { id: 1, name: "Hypertension", category: "Cardiovascular", description: "High blood pressure" },
    { id: 2, name: "Diabetes Mellitus", category: "Endocrine", description: "High blood sugar levels" },
    { id: 3, name: "Asthma", category: "Respiratory", description: "Chronic respiratory condition" },
    { id: 4, name: "Heart Disease", category: "Cardiovascular", description: "Various heart conditions" },
    { id: 5, name: "Previous Surgery", category: "Surgical", description: "History of surgical procedures" },
    { id: 6, name: "Allergies", category: "Immunological", description: "Allergic reactions to substances" },
    { id: 7, name: "Kidney Disease", category: "Renal", description: "Kidney function disorders" },
    { id: 8, name: "Liver Disease", category: "Hepatic", description: "Liver function disorders" },
  ],
  investigation: [
    { id: 1, name: "Blood Investigation", category: "Laboratory", description: "Blood tests and analysis" },
    { id: 2, name: "ECG", category: "Cardiac", description: "Electrocardiogram" },
    { id: 3, name: "Chest Examination", category: "Physical", description: "Physical examination of chest" },
    { id: 4, name: "Neurological Examination", category: "Physical", description: "Neurological assessment" },
    { id: 5, name: "Urine Analysis", category: "Laboratory", description: "Urine tests and analysis" },
    { id: 6, name: "X-Ray", category: "Imaging", description: "Radiographic imaging" },
    { id: 7, name: "Ultrasound", category: "Imaging", description: "Ultrasound imaging" },
    { id: 8, name: "Endoscopy", category: "Procedure", description: "Internal examination procedure" },
  ],
  observation: [
    { id: 1, name: "Patient appears well", category: "General", description: "Patient looks healthy" },
    { id: 2, name: "Vital signs stable", category: "Vitals", description: "Normal vital parameters" },
    { id: 3, name: "Patient in distress", category: "General", description: "Patient appears uncomfortable" },
    { id: 4, name: "Respiratory distress", category: "Respiratory", description: "Difficulty breathing" },
    { id: 5, name: "Cardiac murmur present", category: "Cardiac", description: "Abnormal heart sounds" },
    { id: 6, name: "Abdomen soft and non-tender", category: "Abdominal", description: "Normal abdominal examination" },
    { id: 7, name: "Neurologically intact", category: "Neurological", description: "Normal neurological function" },
    { id: 8, name: "Skin warm and dry", category: "Dermatological", description: "Normal skin condition" },
  ],
  diagnoses: [
    {
      id: 1,
      name: "Essential Hypertension",
      icdCode: "I10",
      category: "Cardiovascular",
      description: "Primary high blood pressure",
    },
    {
      id: 2,
      name: "Type 2 Diabetes Mellitus",
      icdCode: "E11",
      category: "Endocrine",
      description: "Non-insulin dependent diabetes",
    },
    {
      id: 3,
      name: "Acute Upper Respiratory Infection",
      icdCode: "J06.9",
      category: "Respiratory",
      description: "Common cold or flu",
    },
    {
      id: 4,
      name: "Gastroesophageal Reflux Disease",
      icdCode: "K21.9",
      category: "Gastrointestinal",
      description: "Acid reflux condition",
    },
    { id: 5, name: "Migraine", icdCode: "G43", category: "Neurological", description: "Severe headache disorder" },
    { id: 6, name: "Osteoarthritis", icdCode: "M19", category: "Musculoskeletal", description: "Joint degeneration" },
    {
      id: 7,
      name: "Anxiety Disorder",
      icdCode: "F41",
      category: "Mental Health",
      description: "Anxiety and panic disorders",
    },
    {
      id: 8,
      name: "Chronic Kidney Disease",
      icdCode: "N18",
      category: "Renal",
      description: "Progressive kidney dysfunction",
    },
  ],
}

// Coming Soon Component for non-implemented sections
function ComingSoonCard({ title, description }: { title: string; description: string }) {
  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-12">
        <Construction className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground text-center mb-4">{description}</p>
        <Badge variant="secondary">Coming Soon</Badge>
      </CardContent>
    </Card>
  )
}

export default function SettingsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("laboratory")
  const [selectedSubCategory, setSelectedSubCategory] = useState("lab-tests")
  const [currentCategory, setCurrentCategory] = useState("")
  const [currentSubCategory, setCurrentSubCategory] = useState("")
  const [previewTemplate, setPreviewTemplate] = useState(null)
  const [previewTemplateType, setPreviewTemplateType] = useState<"ayurvedic" | "allopathic">("ayurvedic")
  const { toast } = useToast()

  const { getAllAyurvedicTemplates, getAllAllopathicTemplates, deleteAyurvedicTemplate, deleteAllopathicTemplate } =
    usePrescriptionTemplates()

  const handleCategoryChange = (categoryId: string, subCategoryId: string) => {
    setSelectedCategory(categoryId)
    setSelectedSubCategory(subCategoryId)
  }

  const handleCreate = (categoryId: string, subCategoryId: string) => {
    setCurrentCategory(categoryId)
    setCurrentSubCategory(subCategoryId)
    setIsCreateDialogOpen(true)
  }

  const handleEdit = (id: number, masterType: string) => {
    toast({
      title: "Edit Item",
      description: `Editing ${masterType} with ID: ${id}`,
    })
  }

  const handleDelete = (id: number, masterType: string) => {
    toast({
      title: "Delete Item",
      description: `Deleted ${masterType} with ID: ${id}`,
      variant: "destructive",
    })
  }

  const handleView = (id: number, masterType: string) => {
    toast({
      title: "View Item",
      description: `Viewing details for ${masterType} with ID: ${id}`,
    })
  }

  const handlePreviewTemplate = (template: any, type: "ayurvedic" | "allopathic") => {
    setPreviewTemplate(template)
    setPreviewTemplateType(type)
  }

  const handleDeleteTemplate = (id: string, type: "ayurvedic" | "allopathic") => {
    if (type === "ayurvedic") {
      deleteAyurvedicTemplate(id)
    } else {
      deleteAllopathicTemplate(id)
    }
    toast({
      title: "Template Deleted",
      description: `${type === "ayurvedic" ? "Ayurvedic" : "Allopathic"} template deleted successfully`,
      variant: "destructive",
    })
  }

  const ActionButtons = ({ id, masterType }: { id: number; masterType: string }) => (
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="sm" onClick={() => handleView(id, masterType)}>
        <Eye className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="sm" onClick={() => handleEdit(id, masterType)}>
        <Edit className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="sm" onClick={() => handleDelete(id, masterType)}>
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  )

  const TemplateActionButtons = ({ template, type }: { template: any; type: "ayurvedic" | "allopathic" }) => (
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="sm" onClick={() => handlePreviewTemplate(template, type)}>
        <Eye className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="sm" onClick={() => handleDeleteTemplate(template.id, type)}>
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  )

  const renderFieldValue = (value: any, field: any) => {
    if ((field.key === "cost" || field.key === "price") && typeof value === "number") {
      return `₹${value}`
    }
    if (field.key === "category" || field.key === "type" || field.key === "status") {
      return <Badge variant="secondary">{value}</Badge>
    }
    if (field.key === "icdCode") {
      return <Badge variant="outline">{value}</Badge>
    }
    if (field.key === "stockQuantity" && typeof value === "number") {
      const item = sampleData[selectedSubCategory as keyof typeof sampleData]?.find(
        (item: any) => field.key === "stockQuantity" && item.stockQuantity === value,
      ) as any
      const isLowStock = item?.minStockLevel && value <= item.minStockLevel
      return (
        <div className="flex items-center gap-2">
          <span>{value}</span>
          {isLowStock && (
            <Badge variant="destructive" className="text-xs">
              Low Stock
            </Badge>
          )}
        </div>
      )
    }
    if (Array.isArray(value)) {
      return (
        <div className="flex flex-wrap gap-1">
          {value.map((item, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {item}
            </Badge>
          ))}
        </div>
      )
    }
    return value
  }

  const renderFormField = (field: any) => {
    const fieldId = `field-${field.key}`

    switch (field.type) {
      case "textarea":
        return <Textarea id={fieldId} className="col-span-3" />
      case "number":
        return <Input id={fieldId} type="number" className="col-span-3" />
      case "email":
        return <Input id={fieldId} type="email" className="col-span-3" />
      case "date":
        return <Input id={fieldId} type="date" className="col-span-3" />
      case "select":
        return (
          <Select>
            <SelectTrigger className="col-span-3">
              <SelectValue placeholder={`Select ${field.label}`} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option: string) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )
      default:
        return <Input id={fieldId} type="text" className="col-span-3" />
    }
  }

  const getCurrentSubCategory = () => {
    const category = masterCategories.find((cat) => cat.id === currentCategory)
    return category?.subCategories.find((sub) => sub.id === currentSubCategory)
  }

  const currentCategoryData = masterCategories.find((cat) => cat.id === selectedCategory)
  const currentSubCategoryData = currentCategoryData?.subCategories.find((sub) => sub.id === selectedSubCategory)
  const currentData = sampleData[selectedSubCategory as keyof typeof sampleData] || []

  // Check if current selection is implemented
  const isImplementedCategory = [
    "laboratory",
    "radiology",
    "medicines",
    "dosage-instructions",
    "ayurvedic-constituents",
    "clinical",
    "diagnosis",
    "prescription-templates",
  ].includes(selectedCategory)

  // Get template data for prescription templates
  const ayurvedicTemplates = getAllAyurvedicTemplates()
  const allopathicTemplates = getAllAllopathicTemplates()

  const renderPrescriptionTemplates = () => {
    if (selectedSubCategory === "ayurvedic-templates") {
      return (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Leaf className="h-5 w-5 text-green-600" />
                  Ayurvedic Prescription Templates
                </CardTitle>
                <CardDescription>
                  {ayurvedicTemplates.length} template{ayurvedicTemplates.length !== 1 ? "s" : ""} available
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4" />
              <Input
                placeholder="Search ayurvedic templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Template Name</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Medicines</TableHead>
                  <TableHead>Pathya</TableHead>
                  <TableHead>Apathya</TableHead>
                  <TableHead>Created By</TableHead>
                  <TableHead>Created Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ayurvedicTemplates
                  .filter(
                    (template) =>
                      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      template.department.toLowerCase().includes(searchTerm.toLowerCase()),
                  )
                  .map((template) => (
                    <TableRow key={template.id}>
                      <TableCell className="font-medium">{template.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {template.department}
                        </Badge>
                      </TableCell>
                      <TableCell>{template.prescriptions?.length || 0}</TableCell>
                      <TableCell>{template.pathya?.length || 0}</TableCell>
                      <TableCell>{template.apathya?.length || 0}</TableCell>
                      <TableCell>{template.createdBy}</TableCell>
                      <TableCell>{new Date(template.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <TemplateActionButtons template={template} type="ayurvedic" />
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )
    }

    if (selectedSubCategory === "allopathic-templates") {
      return (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Pill className="h-5 w-5 text-blue-600" />
                  Allopathic Prescription Templates
                </CardTitle>
                <CardDescription>
                  {allopathicTemplates.length} template{allopathicTemplates.length !== 1 ? "s" : ""} available
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4" />
              <Input
                placeholder="Search allopathic templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Template Name</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Medicines</TableHead>
                  <TableHead>Dietary Guidelines</TableHead>
                  <TableHead>Created By</TableHead>
                  <TableHead>Created Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allopathicTemplates
                  .filter(
                    (template) =>
                      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      template.department.toLowerCase().includes(searchTerm.toLowerCase()),
                  )
                  .map((template) => (
                    <TableRow key={template.id}>
                      <TableCell className="font-medium">{template.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {template.department}
                        </Badge>
                      </TableCell>
                      <TableCell>{template.prescriptions?.length || 0}</TableCell>
                      <TableCell>{template.dietaryConstraints?.length || 0}</TableCell>
                      <TableCell>{template.createdBy}</TableCell>
                      <TableCell>{new Date(template.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <TemplateActionButtons template={template} type="allopathic" />
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )
    }

    return null
  }

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Tree Navigation Sidebar */}
      <SettingsSubNavigation
        selectedCategory={selectedCategory}
        selectedSubCategory={selectedSubCategory}
        onCategoryChange={handleCategoryChange}
      />

      {/* Main Content Area */}
      <div className="flex-1 p-6 overflow-auto">
        {isImplementedCategory ? (
          <>
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                {currentCategoryData && <currentCategoryData.icon className={`h-6 w-6 ${currentCategoryData.color}`} />}
                <h1 className="text-3xl font-bold">{currentSubCategoryData?.name}</h1>
              </div>
              <p className="text-muted-foreground">{currentSubCategoryData?.description}</p>
            </div>

            {/* Prescription Templates */}
            {selectedCategory === "prescription-templates"
              ? renderPrescriptionTemplates()
              : /* Master Data Table */
                currentSubCategoryData && (
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            Manage {currentSubCategoryData.name}
                          </CardTitle>
                          <CardDescription>
                            {currentData.length} item{currentData.length !== 1 ? "s" : ""} in this category
                          </CardDescription>
                        </div>
                        <Button onClick={() => handleCreate(selectedCategory, selectedSubCategory)}>
                          <Plus className="h-4 w-4 mr-2" />
                          Add {currentSubCategoryData.name.slice(0, -1)}
                        </Button>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Search className="h-4 w-4" />
                        <Input
                          placeholder={`Search ${currentSubCategoryData.name.toLowerCase()}...`}
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="max-w-sm"
                        />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            {currentSubCategoryData.fields.map((field) => (
                              <TableHead key={field.key}>{field.label}</TableHead>
                            ))}
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {currentData
                            .filter((item) =>
                              Object.values(item).some((value) => {
                                if (typeof value === "string") {
                                  return value.toLowerCase().includes(searchTerm.toLowerCase())
                                }
                                if (typeof value === "number") {
                                  return value.toString().toLowerCase().includes(searchTerm.toLowerCase())
                                }
                                if (Array.isArray(value)) {
                                  return value.some((val) =>
                                    typeof val === "string"
                                      ? val.toLowerCase().includes(searchTerm.toLowerCase())
                                      : false,
                                  )
                                }
                                return false
                              }),
                            )
                            .map((item) => (
                              <TableRow key={item.id}>
                                {currentSubCategoryData.fields.map((field) => (
                                  <TableCell key={field.key}>{renderFieldValue(item[field.key], field)}</TableCell>
                                ))}
                                <TableCell className="text-right">
                                  <ActionButtons id={item.id} masterType={currentSubCategoryData.name} />
                                </TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                )}
          </>
        ) : (
          <ComingSoonCard
            title="This section is coming soon!"
            description="We're working hard to bring you this feature. Stay tuned!"
          />
        )}
      </div>

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New {getCurrentSubCategory()?.name.slice(0, -1)}</DialogTitle>
            <DialogDescription>Add a new item to the {getCurrentSubCategory()?.name} master list.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {getCurrentSubCategory()?.fields.map((field) => (
              <div key={field.key} className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor={`field-${field.key}`} className="text-right">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </Label>
                {renderFormField(field)}
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button type="submit">Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Template Modal */}
      <AyurvedicTemplatePreviewModal
        template={previewTemplate}
        isOpen={!!previewTemplate}
        onClose={() => setPreviewTemplate(null)}
        onLoad={() => {}}
      />
    </div>
  )
}
