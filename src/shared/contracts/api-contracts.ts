// ============================================================
// Shared Contracts — Mirrors backend C# Enums & DTOs
// ============================================================

// --- Shared.Contracts.Enums ---

export enum TrainingSystem {
  ShortTerm = 1,  // Sơ cấp
  Formal = 2,     // Chính quy
  Driving = 3,    // Lái xe
}

export const TRAINING_SYSTEM_LABELS: Record<TrainingSystem, string> = {
  [TrainingSystem.ShortTerm]: "Sơ cấp",
  [TrainingSystem.Formal]: "Chính quy",
  [TrainingSystem.Driving]: "Lái xe",
};

// --- Customer.Domain.Enums ---

export enum Source {
  Website = 1,
  Facebook = 2,
  Banner = 3,
  TayDo = 4,
  Reference = 5,
  Zalo = 6,
  ZaloMini = 7,
  ImportFile = 8,
  DataEntry = 9,
  Military = 10,
  Hotline = 11,
  PersonalCustomer = 12,
  Affiliate = 13,
  LearnerDriver = 14,
  GoogleAds = 15,
  TikTok = 16,
}

export const SOURCE_LABELS: Record<Source, string> = {
  [Source.Website]: "Tìm kiếm trên Google/Website",
  [Source.Facebook]: "Facebook",
  [Source.Banner]: "Bảng quảng cáo",
  [Source.TayDo]: "Đã từng học tại trường Tây Đô",
  [Source.Reference]: "Người quen giới thiệu",
  [Source.Zalo]: "Zalo",
  [Source.ZaloMini]: "Zalo Game mini app",
  [Source.ImportFile]: "Hướng nghiệp trường",
  [Source.DataEntry]: "Nhập liệu",
  [Source.Military]: "Bộ đội xuất ngũ",
  [Source.Hotline]: "Hotline",
  [Source.PersonalCustomer]: "KH Cá nhân",
  [Source.Affiliate]: "Affiliate",
  [Source.LearnerDriver]: "Học viên trường lái",
  [Source.GoogleAds]: "Google Ads",
  [Source.TikTok]: "TikTok",
};

export enum LeadStatus {
  New = 1,
  Will = 2,
  WrongNumber = 3,
  NotIdentified = 4,
  Cold = 5,
  Warm = 6,
  Hot = 7,
  Profiled = 8,
  Deposited = 9,
  Paid = 10,
  ProfileCanceled = 11,
  Withdrawn = 12,
  CanceledDeposit = 13,
  Lost = 14,
}

export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  [LeadStatus.New]: "Chưa liên hệ / Không nghe / Hẹn lại",
  [LeadStatus.Will]: "Sẽ quan tâm",
  [LeadStatus.WrongNumber]: "Sai / Nhầm số",
  [LeadStatus.NotIdentified]: "Không liên lạc được",
  [LeadStatus.Cold]: "Lạnh nhạt / Khó chịu",
  [LeadStatus.Warm]: "Quan tâm",
  [LeadStatus.Hot]: "Rất quan tâm",
  [LeadStatus.Profiled]: "Đã đăng ký",
  [LeadStatus.Deposited]: "Đã đóng cọc",
  [LeadStatus.Paid]: "Đã đóng học phí",
  [LeadStatus.ProfileCanceled]: "Đã hủy đăng ký",
  [LeadStatus.Withdrawn]: "Đã rút hồ sơ / Hoàn phí",
  [LeadStatus.CanceledDeposit]: "Hủy cọc",
  [LeadStatus.Lost]: "Khách hàng không còn quan tâm hoặc từ chối",
};

export enum FollowStatus {
  Will = 1,
  Warm = 2,
  Hot = 3,
  Lost = 4,
}

export const FOLLOW_STATUS_LABELS: Record<FollowStatus, string> = {
  [FollowStatus.Will]: "Đã tư vấn hết kịch bản, xin kết bạn Zalo",
  [FollowStatus.Warm]: "Đã tư vấn hết kịch bản, có quan tâm",
  [FollowStatus.Hot]: "Rất quan tâm, đã tư vấn đầy đủ thông tin, có ý định đăng ký học",
  [FollowStatus.Lost]: "Khách hàng không còn quan tâm hoặc từ chối",
};

export enum EducationLevel {
  UnderSecondarySchool = 1,
  SecondarySchool = 2,
  HighSchool = 3,
  Intermediate = 4,
  College = 5,
  Undergraduate = 6,
  Graduate = 7,
  DrivingTraining = 8,
}

export const EDUCATION_LEVEL_LABELS: Record<EducationLevel, string> = {
  [EducationLevel.UnderSecondarySchool]: "Chưa tốt nghiệp THCS",
  [EducationLevel.SecondarySchool]: "Tốt nghiệp THCS",
  [EducationLevel.HighSchool]: "Tốt nghiệp THPT",
  [EducationLevel.Intermediate]: "Trung Cấp/Chứng chỉ nghề",
  [EducationLevel.College]: "Cao đẳng",
  [EducationLevel.Undergraduate]: "Đại học",
  [EducationLevel.Graduate]: "Sau đại học",
  [EducationLevel.DrivingTraining]: "Đào tạo lái xe",
};

export enum CustomerStatus {
  Interest = 1,
  Profile = 2,
  Registered = 3,
  Paid = 4,
  Withdraw = 5,
  AwaitingProcess = 6,
  Canceled = 7,
  CanceledDeposit = 8,
}

export const CUSTOMER_STATUS_LABELS: Record<CustomerStatus, string> = {
  [CustomerStatus.Interest]: "Quan tâm",
  [CustomerStatus.Profile]: "Đã đăng ký xét tuyển",
  [CustomerStatus.Registered]: "Đã đóng cọc",
  [CustomerStatus.Paid]: "Đã đóng học phí",
  [CustomerStatus.Withdraw]: "Hủy học phí",
  [CustomerStatus.AwaitingProcess]: "Chờ xử lý",
  [CustomerStatus.Canceled]: "Đã hủy đăng ký",
  [CustomerStatus.CanceledDeposit]: "Đã hủy cọc",
};

// --- LeadAssignment.Domain.Enums ---

export enum AssignmentReason {
  AutoAssign = 0,
  ManualAssign = 1,
  SlaViolation = 2,
}

export const ASSIGNMENT_REASON_LABELS: Record<AssignmentReason, string> = {
  [AssignmentReason.AutoAssign]: "Tự động phân bổ",
  [AssignmentReason.ManualAssign]: "Giao thủ công",
  [AssignmentReason.SlaViolation]: "Vi phạm SLA",
};

// Placeholder enum for evidence types (backend uses string-based approach)
export enum ContactEvidenceType {
  Call = 1,
  Email = 2,
  Meeting = 3,
  Document = 4,
  Note = 5,
}

export const CONTACT_EVIDENCE_TYPE_LABELS: Record<ContactEvidenceType, string> = {
  [ContactEvidenceType.Call]: "Cuộc gọi",
  [ContactEvidenceType.Email]: "Email",
  [ContactEvidenceType.Meeting]: "Gặp mặt",
  [ContactEvidenceType.Document]: "Tài liệu",
  [ContactEvidenceType.Note]: "Ghi chú",
};

// ============================================================
// DTOs — Matching backend query response shapes
// ============================================================

export interface QueueStatusItem {
  id: string;
  trainingSystem: string;
  consultantId: string;
  consultantName: string;
  orderIndex: number;
  currentLoad: number;
  maxLoad: number;
  isActive: boolean;
  lastAssignedAt: string | null;
}

export interface ActiveSlaItem {
  id: string;
  customerId: string;
  customerName: string;
  trainingSystem: string;
  assigneeId: string;
  assigneeName: string;
  assignedAt: string;
  deadline: string;
  remainingMinutes: number;
  isViolated: boolean;
}

export interface AssignmentHistoryItem {
  id: string;
  assigneeId: string;
  assigneeName: string;
  assignedById: string;
  assignmentDate: string;
  reason: string | null;
  note: string | null;
}

export interface ContactEvidenceItem {
  id: string;
  customerId: string;
  customerName: string;
  trainingSystem: TrainingSystem | null;
  assigneeId: string | null;
  status: LeadStatus | null;
  followStatus: FollowStatus | null;
  statusDate: string | null;
  reportDate: string | null;
  note: string | null;
}

// ============================================================
// Commands — Matching backend command request shapes
// ============================================================

export interface CreateCustomerCommand {
  customerId?: string;
  fullName: string;
  mobile?: string | null;
  source: number;
}

export interface AssignCustomerCommand {
  customerId: string;
  assigneeId: string;
  assignedById: string;
  note?: string | null;
}

export interface CreateContactEvidenceCommand {
  customerId: string;
  consultantId: string;
  fileUrl?: string | null;
  description?: string | null;
  durationSeconds?: number | null;
  leadStatus: number;
  followStatus: number;
}

// ============================================================
// Events — For display/reference purposes
// ============================================================

export interface CustomerCreatedEvent {
  customerId: string;
  fullName: string;
  mobile?: string;
  source: Source;
  trainingSystem: TrainingSystem;
}

export interface LeadAssignedEvent {
  customerId: string;
  customerName: string;
  assigneeId: string;
  assigneeName: string;
  assignedById: string;
  reason: AssignmentReason;
  assignedAt: string;
  slaDeadline: string;
}

export interface ContactEvidenceSubmittedEvent {
  customerId: string;
  consultantId: string;
  leadStatus: LeadStatus;
  followStatus: FollowStatus;
}

export interface SlaViolationEvent {
  customerId: string;
  customerName: string;
  assigneeId: string;
  violatedAt: string;
}
