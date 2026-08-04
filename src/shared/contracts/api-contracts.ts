export type UUID = string;
export type DateTimeString = string;

export type JsonSchema = {
  type?: "object" | "string" | "integer" | "number" | "boolean" | "array" | "null";
  format?: string;
  $ref?: string;
  nullable?: boolean;
  additionalProperties?: boolean;
  description?: string;
  properties?: Record<string, JsonSchema>;
  required?: string[];
  items?: JsonSchema;
  enum?: readonly (string | number)[];
  anyOf?: readonly JsonSchema[];
  oneOf?: readonly JsonSchema[];
};

export const TrainingSystem = {
  ShortTerm: 1,
  Formal: 2,
  Driving: 3,
  TechnicalSkills: 4,
} as const;

export type TrainingSystem = (typeof TrainingSystem)[keyof typeof TrainingSystem];

export const Source = {
  Website: 1,
  Facebook: 2,
  Banner: 3,
  TayDo: 4,
  Reference: 5,
  Zalo: 6,
  ZaloMini: 7,
  ImportFile: 8,
  DataEntry: 9,
  Military: 10,
  Hotline: 11,
  PersonalCustomer: 12,
  Affiliate: 13,
  LearnerDriver: 14,
  GoogleAds: 15,
  TikTok: 16,
} as const;

export type Source = (typeof Source)[keyof typeof Source];

export const EducationLevel = {
  UnderSecondarySchool: 1,
  SecondarySchool: 2,
  HighSchool: 3,
  Intermediate: 4,
  College: 5,
  Undergraduate: 6,
  Graduate: 7,
  DrivingTraining: 8,
} as const;

export type EducationLevel = (typeof EducationLevel)[keyof typeof EducationLevel];

export const ContactEvidenceType = {
  CallRecording: 1,
  StatusChange: 2,
  Note: 3,
  Meeting: 4,
  ZaloMessage: 5,
  FacebookMessage: 6,
} as const;

export type ContactEvidenceType = (typeof ContactEvidenceType)[keyof typeof ContactEvidenceType];

export const AssignmentReason = {
  NewLead: 1,
  ManualAssign: 2,
  SlaViolation: 3,
  Rebalance: 4,
} as const;

export type AssignmentReason = (typeof AssignmentReason)[keyof typeof AssignmentReason];

// Note: Role is intentionally omitted here as requested by user to keep existing UI logic intact.

export type CreateCustomerCommand = {
  name?: string;
  email?: string;
  mobile?: string;
  studentId?: string | null;
  source?: Source | null;
  birthDate?: DateTimeString | null;
  gender?: string | null;
  address?: string | null;
  trainingSystem: TrainingSystem;
  educationLevel?: EducationLevel | null;
  placeOfBirth?: string | null;
  latestSchool?: string | null;
  onlineMessageMobile?: string | null;
  ethnic?: string | null;
  schoolAddress?: string | null;
  userIdByOa?: string | null;
  parentMobile?: string | null;
  cccd?: string | null;
  cccdIssueDate?: DateTimeString | null;
  fatherName?: string | null;
  motherName?: string | null;
  graduationYear?: number | null;
  createdBy: UUID;
};

export type AssignCustomerCommand = {
  customerId: UUID;
  assigneeId: UUID;
  assignedById: UUID;
  note?: string | null;
};

export type CreateContactEvidenceCommand = {
  customerId: UUID;
  consultantId: UUID;
  type: ContactEvidenceType;
  fileUrl?: string | null;
  description?: string | null;
  durationSeconds?: number | null;
  oldStatusValue?: string | null;
  newStatusValue?: string | null;
};

export type QueueStatusItem = {
  id: UUID;
  consultantName: string;
  consultantId: UUID;
  orderIndex: number;
  currentLoad: number;
  maxLoad: number;
  isActive: boolean;
  lastAssignedAt: DateTimeString | null;
};

export type ActiveSlaItem = {
  id: UUID;
  customerName: string;
  customerId: UUID;
  assigneeName: string;
  assigneeId: UUID;
  assignedAt: DateTimeString;
  deadline: DateTimeString;
  remainingMinutes: number;
  isViolated: boolean;
};

export type AssignmentHistoryItem = {
  id: UUID;
  assigneeName: string;
  assignedByName: string;
  assignmentDate: DateTimeString;
  reason: AssignmentReason;
  note?: string | null;
};

export type ContactEvidenceItem = {
  id: UUID;
  consultantName: string;
  type: ContactEvidenceType;
  fileUrl?: string | null;
  description?: string | null;
  durationSeconds?: number | null;
  oldStatusValue?: string | null;
  newStatusValue?: string | null;
  createdAt: DateTimeString;
};

export type CustomerCreatedEvent = {
  customerId: UUID;
  customerName: string;
  mobile: string;
  trainingSystem: TrainingSystem;
  createdBy: UUID;
  createdAt: DateTimeString;
};

export type LeadAssignedEvent = {
  customerId: UUID;
  customerName: string;
  assigneeId: UUID;
  assigneeName: string;
  assignedById: UUID;
  reason: AssignmentReason;
  assignedAt: DateTimeString;
  slaDeadline: DateTimeString;
};

export type ContactEvidenceSubmittedEvent = {
  contactEvidenceId: UUID;
  customerId: UUID;
  consultantId: UUID;
  evidenceType: string;
  submittedAt: DateTimeString;
};

export type SlaViolationEvent = {
  customerId: UUID;
  customerName: string;
  violatedAssigneeId: UUID;
  violatedAssigneeName: string;
  slaTrackingId: UUID;
  assignedAt: DateTimeString;
  deadline: DateTimeString;
  violatedAt: DateTimeString;
};

export const schemas = {
  TrainingSystem: { type: "integer", enum: [1, 2, 3, 4] },
  Source: { type: "integer", enum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16] },
  EducationLevel: { type: "integer", enum: [1, 2, 3, 4, 5, 6, 7, 8] },
  ContactEvidenceType: { type: "integer", enum: [1, 2, 3, 4, 5, 6] },
  AssignmentReason: { type: "integer", enum: [1, 2, 3, 4] },

  CreateCustomerCommand: {
    type: "object",
    additionalProperties: false,
    required: ["trainingSystem", "createdBy"],
    properties: {
      name: { type: "string", nullable: true },
      email: { type: "string", nullable: true },
      mobile: { type: "string", nullable: true },
      studentId: { type: "string", nullable: true },
      source: { anyOf: [{ $ref: "#/components/schemas/Source" } as JsonSchema, { type: "null" }] },
      birthDate: { type: "string", format: "date-time", nullable: true },
      gender: { type: "string", nullable: true },
      address: { type: "string", nullable: true },
      trainingSystem: { $ref: "#/components/schemas/TrainingSystem" },
      educationLevel: { anyOf: [{ $ref: "#/components/schemas/EducationLevel" } as JsonSchema, { type: "null" }] },
      placeOfBirth: { type: "string", nullable: true },
      latestSchool: { type: "string", nullable: true },
      onlineMessageMobile: { type: "string", nullable: true },
      ethnic: { type: "string", nullable: true },
      schoolAddress: { type: "string", nullable: true },
      userIdByOa: { type: "string", nullable: true },
      parentMobile: { type: "string", nullable: true },
      cccd: { type: "string", nullable: true },
      cccdIssueDate: { type: "string", format: "date-time", nullable: true },
      fatherName: { type: "string", nullable: true },
      motherName: { type: "string", nullable: true },
      graduationYear: { type: "integer", format: "int32", nullable: true },
      createdBy: { type: "string", format: "uuid" },
    },
  },

  AssignCustomerCommand: {
    type: "object",
    additionalProperties: false,
    required: ["customerId", "assigneeId", "assignedById"],
    properties: {
      customerId: { type: "string", format: "uuid" },
      assigneeId: { type: "string", format: "uuid" },
      assignedById: { type: "string", format: "uuid" },
      note: { type: "string", nullable: true },
    },
  },

  CreateContactEvidenceCommand: {
    type: "object",
    additionalProperties: false,
    required: ["customerId", "consultantId", "type"],
    properties: {
      customerId: { type: "string", format: "uuid" },
      consultantId: { type: "string", format: "uuid" },
      type: { $ref: "#/components/schemas/ContactEvidenceType" },
      fileUrl: { type: "string", nullable: true },
      description: { type: "string", nullable: true },
      durationSeconds: { type: "integer", format: "int32", nullable: true },
      oldStatusValue: { type: "string", nullable: true },
      newStatusValue: { type: "string", nullable: true },
    },
  },

  QueueStatusItem: {
    type: "object",
    additionalProperties: false,
    required: ["id", "consultantName", "consultantId", "orderIndex", "currentLoad", "maxLoad", "isActive"],
    properties: {
      id: { type: "string", format: "uuid" },
      consultantName: { type: "string" },
      consultantId: { type: "string", format: "uuid" },
      orderIndex: { type: "integer", format: "int32" },
      currentLoad: { type: "integer", format: "int32" },
      maxLoad: { type: "integer", format: "int32" },
      isActive: { type: "boolean" },
      lastAssignedAt: { type: "string", format: "date-time", nullable: true },
    },
  },

  ActiveSlaItem: {
    type: "object",
    additionalProperties: false,
    required: ["id", "customerName", "customerId", "assigneeName", "assigneeId", "assignedAt", "deadline", "remainingMinutes", "isViolated"],
    properties: {
      id: { type: "string", format: "uuid" },
      customerName: { type: "string" },
      customerId: { type: "string", format: "uuid" },
      assigneeName: { type: "string" },
      assigneeId: { type: "string", format: "uuid" },
      assignedAt: { type: "string", format: "date-time" },
      deadline: { type: "string", format: "date-time" },
      remainingMinutes: { type: "integer", format: "int32" },
      isViolated: { type: "boolean" },
    },
  },

  AssignmentHistoryItem: {
    type: "object",
    additionalProperties: false,
    required: ["id", "assigneeName", "assignedByName", "assignmentDate", "reason"],
    properties: {
      id: { type: "string", format: "uuid" },
      assigneeName: { type: "string" },
      assignedByName: { type: "string" },
      assignmentDate: { type: "string", format: "date-time" },
      reason: { $ref: "#/components/schemas/AssignmentReason" },
      note: { type: "string", nullable: true },
    },
  },

  ContactEvidenceItem: {
    type: "object",
    additionalProperties: false,
    required: ["id", "consultantName", "type", "createdAt"],
    properties: {
      id: { type: "string", format: "uuid" },
      consultantName: { type: "string" },
      type: { $ref: "#/components/schemas/ContactEvidenceType" },
      fileUrl: { type: "string", nullable: true },
      description: { type: "string", nullable: true },
      durationSeconds: { type: "integer", format: "int32", nullable: true },
      oldStatusValue: { type: "string", nullable: true },
      newStatusValue: { type: "string", nullable: true },
      createdAt: { type: "string", format: "date-time" },
    },
  },
} as const satisfies Record<string, JsonSchema>;

export const formalApiPaths = {
  createCustomer: "/api/formal/Customers",
} as const;

export const shortTermApiPaths = {
  createCustomer: "/api/shortterm/Customers",
} as const;

export const drivingApiPaths = {
  createCustomer: "/api/driving/customer",
  assignCustomer: "/api/driving/customer/assign",
  queue: "/api/driving/assignment/queue",
  activeSla: "/api/driving/assignment/sla/active",
  assignmentHistory: (customerId: UUID) => `/api/driving/assignment/history/${customerId}`,
  contactEvidenceHistory: (customerId: UUID) => `/api/driving/assignment/evidence/${customerId}`,
  createContactEvidence: "/api/driving/contactevidence",
} as const;

export const assignmentApiPaths = {
  checkIn: "/api/Assignment/check-in",
  checkOut: "/api/Assignment/check-out",
  manualAssign: "/api/Assignment/manual-assign",
  updateSlaConfig: "/api/Assignment/config/sla",
  report: "/api/Assignment/report",
  history: (customerId: UUID) => `/api/Assignment/history/${customerId}`,
  queue: "/api/Assignment/queue",
  activeSla: "/api/Assignment/sla/active",
  evidence: "/api/Assignment/evidence",
  evidenceHistory: (customerId: UUID) => `/api/Assignment/evidence/${customerId}`,
} as const;

export const authApiPaths = {
  register: "/api/Auth/register",
  login: "/api/Auth/login",
  assignUser: "/api/Auth/assign-user",
  profile: "/api/Auth/profile",
  users: "/api/Auth/users",
  userById: (id: string) => `/api/Auth/users/${id}`,
} as const;
