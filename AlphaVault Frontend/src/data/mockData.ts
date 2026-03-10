export interface Asset {
  id: string;
  name: string;
  category: "Computer" | "Monitor" | "Accessories" | "Mobile" | "Other";
  status: "Active" | "Maintenance" | "Retired";
  purchaseDate: string;
  cost: number;
  value: number; // Added for display purposes
  vendorId: string;
  location: string;
  assignedTo: string; // Added for assignment tracking
  description: string;
  lastUpdated: string;
  // Additional fields for better IT asset management
  serialNumber?: string;
  model?: string;
  specifications?: {
    // For Laptops
    processor?: string;
    ram?: string;
    storage?: string;
    screenSize?: string;
    // For Monitors
    resolution?: string;
    panelType?: string;
    refreshRate?: string;
    // For Mice/Keyboards
    connectionType?: "Wired" | "Wireless" | "Bluetooth";
    batteryLife?: string;
  };
  warranty?: {
    startDate: string;
    endDate: string;
    provider: string;
  };
}

export interface Vendor {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  rating: number;
  status: "Active" | "Inactive";
}

export interface Quotation {
  id: string;
  vendorId: string;
  assetName: string;
  amount: number;
  submissionDate: string;
  status: "Pending" | "Approved" | "Rejected";
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "Manager" | "Staff";
  avatar: string;
}

export interface ProcurementRequest {
  id: string;
  title: string; // Added for display
  type: "Purchase" | "Maintenance" | "Disposal";
  assetId?: string;
  assetName: string;
  requester: string; // Changed from requestedBy
  requestDate: string;
  dateSubmitted: string; // Added for consistency with display
  status: "Pending" | "Approved" | "Rejected";
  approver?: string;
  amount?: number;
  vendorId?: string;
  priority: "Low" | "Medium" | "High"; // Changed from urgency
  description: string; // Added for detailed information
  stage: "Request" | "Approval" | "Quotation" | "Purchase" | "Receive";
  quotationId?: string;
  quotationAmount?: number;
  quotationVendor?: string;
  purchaseOrderNumber?: string;
  purchaseDate?: string;
  receiveDate?: string;
  receivedBy?: string;
}

export interface Activity {
  id: string;
  action: string;
  userId: string;
  targetType: "Asset" | "Vendor" | "Procurement";
  targetId: string;
  timestamp: string;
}

// Reference data for assets
export const assets: Asset[] = [
  {
    id: "asset-001",
    name: "MacBook Pro 16\" M2",
    category: "Computer",
    status: "Active",
    purchaseDate: "2023-04-15",
    cost: 2799,
    value: 2799,
    assignedTo: "Hemanth",
    vendorId: "vendor-001",
    location: "HQ - Tech Department",
    description: "High-performance laptop for development work",
    lastUpdated: "2023-11-22",
    serialNumber: "MBP2023-001",
    model: "MacBook Pro 16-inch (2023)",
    specifications: {
      processor: "Apple M2 Pro",
      ram: "32GB",
      storage: "1TB SSD",
      screenSize: "16-inch Liquid Retina XDR"
    },
    warranty: {
      startDate: "2023-04-15",
      endDate: "2026-04-15",
      provider: "Apple Inc."
    }
  },
  {
    id: "asset-002",
    name: "Dell UltraSharp 27\" Monitor",
    category: "Monitor",
    status: "Active",
    purchaseDate: "2023-06-10",
    cost: 549,
    value: 549,
    assignedTo: "Sadiq",
    vendorId: "vendor-002",
    location: "HQ - Design Department",
    description: "High-resolution monitor for design work",
    lastUpdated: "2023-11-20",
    serialNumber: "DELL2023-002",
    model: "Dell UltraSharp U2723QE",
    specifications: {
      resolution: "4K UHD (3840 x 2160)",
      panelType: "IPS",
      refreshRate: "60Hz",
      screenSize: "27-inch"
    },
    warranty: {
      startDate: "2023-06-10",
      endDate: "2026-06-10",
      provider: "Dell Technologies"
    }
  },
  {
    id: "asset-003",
    name: "Logitech MX Master 3S",
    category: "Accessories",
    status: "Active",
    purchaseDate: "2023-07-05",
    cost: 99,
    value: 99,
    assignedTo: "Akash",
    vendorId: "vendor-003",
    location: "HQ - Marketing Department",
    description: "Ergonomic wireless mouse",
    lastUpdated: "2023-11-18",
    serialNumber: "LOG2023-003",
    model: "MX Master 3S",
    specifications: {
      connectionType: "Wireless",
      batteryLife: "70 days"
    },
    warranty: {
      startDate: "2023-07-05",
      endDate: "2025-07-05",
      provider: "Logitech"
    }
  },
  {
    id: "asset-004",
    name: "iPhone 15 Pro",
    category: "Mobile",
    status: "Active",
    purchaseDate: "2023-09-22",
    cost: 999,
    value: 999,
    assignedTo: "Abishake",
    vendorId: "vendor-001",
    location: "HQ - Sales Department",
    description: "Company smartphone for sales team",
    lastUpdated: "2023-11-15",
    serialNumber: "IP2023-004",
    model: "iPhone 15 Pro 128GB",
    specifications: {
      storage: "128GB",
      screenSize: "6.1-inch"
    },
    warranty: {
      startDate: "2023-09-22",
      endDate: "2024-09-22",
      provider: "Apple Inc."
    }
  },
  {
    id: "asset-005",
    name: "Mechanical Keyboard Pro",
    category: "Accessories",
    status: "Maintenance",
    purchaseDate: "2023-05-15",
    cost: 149,
    value: 149,
    assignedTo: "Samjith",
    vendorId: "vendor-004",
    location: "HQ - Engineering Department",
    description: "Mechanical keyboard for programming",
    lastUpdated: "2023-11-10",
    serialNumber: "MKB2023-005",
    model: "Pro Mechanical RGB",
    specifications: {
      connectionType: "Wired"
    },
    warranty: {
      startDate: "2023-05-15",
      endDate: "2025-05-15",
      provider: "TechGear Ltd"
    }
  }
];

// Reference data for vendors
export const vendors: Vendor[] = [
  {
    id: "vendor-001",
    name: "Apple Inc.",
    contactPerson: "John Smith",
    email: "john.smith@apple.example.com",
    phone: "123-456-7890",
    address: "One Apple Park Way, Cupertino, CA",
    rating: 5,
    status: "Active"
  },
  {
    id: "vendor-002",
    name: "Dell Technologies",
    contactPerson: "Sarah Johnson",
    email: "sarah.johnson@dell.example.com",
    phone: "123-456-7891",
    address: "One Dell Way, Round Rock, TX",
    rating: 4,
    status: "Active"
  },
  {
    id: "vendor-003",
    name: "Logitech",
    contactPerson: "Mike Chen",
    email: "mike.chen@logitech.example.com",
    phone: "123-456-7892",
    address: "7700 Gateway Blvd, Newark, CA",
    rating: 4,
    status: "Active"
  },
  {
    id: "vendor-004",
    name: "TechGear Ltd",
    contactPerson: "Lisa Wang",
    email: "lisa.wang@techgear.example.com",
    phone: "123-456-7893",
    address: "123 Tech Street, San Francisco, CA",
    rating: 3,
    status: "Active"
  }
];

// Reference data for quotations
export const quotations: Quotation[] = [
  {
    id: "quote-001",
    vendorId: "vendor-001",
    assetName: "MacBook Pro 16\" (2024)",
    amount: 3299,
    submissionDate: "2024-05-05",
    status: "Pending"
  }
];

// Reference data for users
export const users: User[] = [
  {
    id: "user-001",
    name: "Hemanth",
    email: "hemanth@company.example.com",
    role: "Staff",
    avatar: "/placeholder.svg"
  },
  {
    id: "user-002",
    name: "Sadiq",
    email: "sadiq@company.example.com",
    role: "Staff",
    avatar: "/placeholder.svg"
  },
  {
    id: "user-003",
    name: "Akash",
    email: "akash@company.example.com",
    role: "Staff",
    avatar: "/placeholder.svg"
  },
  {
    id: "user-004",
    name: "Abishake",
    email: "abishake@company.example.com",
    role: "Staff",
    avatar: "/placeholder.svg"
  },
  {
    id: "user-005",
    name: "Samjith",
    email: "samjith@company.example.com",
    role: "Staff",
    avatar: "/placeholder.svg"
  },
  {
    id: "user-006",
    name: "Ravi",
    email: "ravi@company.example.com",
    role: "Staff",
    avatar: "/placeholder.svg"
  },
  {
    id: "manager-001",
    name: "Kiran",
    email: "kiran@company.example.com",
    role: "Manager",
    avatar: "/placeholder.svg"
  },
  {
    id: "hr-001",
    name: "Monisha",
    email: "monisha@company.example.com",
    role: "Admin",
    avatar: "/placeholder.svg"
  }
];

// Reference data for procurement requests
export const procurementRequests: ProcurementRequest[] = [
  {
    id: "approval-001",
    title: "New MacBook Pro Purchase Request",
    type: "Purchase",
    assetName: "MacBook Pro 16\" (2024)",
    requester: "Hemanth",
    requestDate: "2024-05-05",
    dateSubmitted: "2024-05-05",
    status: "Pending",
    approver: "Kiran (Manager) & Monisha (HR)",
    amount: 3299,
    vendorId: "vendor-001",
    priority: "High",
    description: "Request for new MacBook Pro for development team expansion. Requires manager and HR procurement.",
    stage: "Request",
    quotationId: "Q-001",
    quotationAmount: 3500,
    quotationVendor: "Vendor A",
    purchaseOrderNumber: "PO-001",
    purchaseDate: "2024-05-15",
    receiveDate: "2024-05-20",
    receivedBy: "Hemanth"
  },
  {
    id: "approval-002",
    title: "Dell Monitor Purchase Request",
    type: "Purchase",
    assetName: "Dell UltraSharp 32\" Monitor",
    requester: "Sadiq",
    requestDate: "2024-05-10",
    dateSubmitted: "2024-05-10",
    status: "Approved",
    approver: "Kiran (Manager) & Monisha (HR)",
    amount: 699,
    vendorId: "vendor-002",
    priority: "Medium",
    description: "Request for additional monitor for design work. Approved by both manager and HR.",
    stage: "Approval",
    quotationId: "Q-002",
    quotationAmount: 750,
    quotationVendor: "Vendor B",
    purchaseOrderNumber: "PO-002",
    purchaseDate: "2024-05-20",
    receiveDate: "2024-05-25",
    receivedBy: "Sadiq"
  },
  {
    id: "approval-003",
    title: "iPhone 15 Pro Purchase Request",
    type: "Purchase",
    assetName: "iPhone 15 Pro 256GB",
    requester: "Akash",
    requestDate: "2024-05-12",
    dateSubmitted: "2024-05-12",
    status: "Pending",
    approver: "Kiran (Manager) & Monisha (HR)",
    amount: 1199,
    vendorId: "vendor-001",
    priority: "Medium",
    description: "Request for company smartphone for sales activities. Awaiting manager and HR procurement.",
    stage: "Quotation",
    quotationId: "Q-003",
    quotationAmount: 1250,
    quotationVendor: "Vendor C",
    purchaseOrderNumber: "PO-003",
    purchaseDate: "2024-05-25",
    receiveDate: "2024-05-30",
    receivedBy: "Akash"
  }
];

// Reference data for activities
export const activities: Activity[] = [
  {
    id: "activity-001",
    action: "Created procurement request",
    userId: "user-001",
    targetType: "Procurement",
    targetId: "approval-001",
    timestamp: "2024-05-05T10:23:15"
  }
];

// Helper function to get user name by id
export const getUserNameById = (id: string): string => {
  const user = users.find(user => user.id === id);
  return user ? user.name : "Unknown User";
};

// Helper function to get vendor name by id
export const getVendorNameById = (id: string): string => {
  const vendor = vendors.find(vendor => vendor.id === id);
  return vendor ? vendor.name : "Unknown Vendor";
};
