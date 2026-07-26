// ============================================================
// Customer / Lead types
// ============================================================

import type { Branch, LeadStatus } from "./common";

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  branch: Branch;
  status: LeadStatus;
  source?: string;
  notes?: string;
  assignedTo?: string;
  assignedToName?: string;
  createdAt: string;
  updatedAt: string;
}

// Base fields shared across all branch lead forms
interface BaseCreateCustomerRequest {
  name: string;
  phone?: string;
  mobile?: string;
  email?: string;
  address?: string;
  source?: string | number;
  notes?: string;
  birthDate?: string;
  gender?: string;
  studentId?: string;
  educationLevel?: number;
  placeOfBirth?: string;
  ethnic?: string;
  schoolAddress?: string;
  createdBy?: string;
  trainingSystem?: number;
}

// Formal branch has additional education-related fields
export interface CreateFormalCustomerRequest extends BaseCreateCustomerRequest {
  highSchool?: string;
  latestSchool?: string;
  graduationYear?: number;
  desiredMajor?: string;
  gpa?: number;
  parentName?: string;
  parentPhone?: string;
  parentMobile?: string;
  fatherName?: string;
  motherName?: string;
}

// Driving branch has license-related fields
export interface CreateDrivingCustomerRequest extends BaseCreateCustomerRequest {
  licenseType?: string;
  currentLicense?: string;
  dateOfBirth?: string;
  identityNumber?: string;
  cccd?: string;
  cccdIssueDate?: string;
}

// ShortTerm branch has course-related fields
export interface CreateShortTermCustomerRequest
  extends BaseCreateCustomerRequest {
  desiredCourse?: string;
  preferredSchedule?: string;
  currentOccupation?: string;
}

// Union type for all create requests
export type CreateCustomerRequest =
  | CreateFormalCustomerRequest
  | CreateDrivingCustomerRequest
  | CreateShortTermCustomerRequest;
