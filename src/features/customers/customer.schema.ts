import * as z from "zod";
import { ContactEvidenceType, EducationLevel, Source, TrainingSystem } from "./customer.types";

export const assignCustomerSchema = z.object({
  customerId: z.string().uuid("ID Khách hàng không hợp lệ"),
  assigneeId: z.string().uuid("ID Người được giao không hợp lệ"),
  assignedById: z.string().uuid("ID Người giao không hợp lệ"),
  note: z.string().nullable().optional(),
});

export type AssignCustomerFormInput = z.infer<typeof assignCustomerSchema>;

export const createContactEvidenceSchema = z.object({
  customerId: z.string().uuid("ID Khách hàng không hợp lệ"),
  consultantId: z.string().uuid("ID Tư vấn viên không hợp lệ"),
  type: z.nativeEnum(ContactEvidenceType, {
    errorMap: () => ({ message: "Loại bằng chứng không hợp lệ" }),
  }),
  fileUrl: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  durationSeconds: z.number().int().nullable().optional(),
  oldStatusValue: z.string().nullable().optional(),
  newStatusValue: z.string().nullable().optional(),
});

export type CreateContactEvidenceFormInput = z.infer<typeof createContactEvidenceSchema>;

export const createCustomerSchema = z.object({
  name: z.string().nullable().optional(),
  email: z.string().email("Email không hợp lệ").nullable().optional().or(z.literal("")),
  mobile: z.string().nullable().optional(),
  studentId: z.string().nullable().optional(),
  source: z.nativeEnum(Source, {
    errorMap: () => ({ message: "Nguồn khách hàng không hợp lệ" }),
  }),
  birthDate: z.string().datetime().nullable().optional(),
  gender: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
  trainingSystem: z.nativeEnum(TrainingSystem, {
    errorMap: () => ({ message: "Hệ đào tạo không hợp lệ" }),
  }),
  educationLevel: z.nativeEnum(EducationLevel, {
    errorMap: () => ({ message: "Trình độ học vấn không hợp lệ" }),
  }),
  placeOfBirth: z.string().nullable().optional(),
  latestSchool: z.string().nullable().optional(),
  onlineMessageMobile: z.string().nullable().optional(),
  ethnic: z.string().nullable().optional(),
  schoolAddress: z.string().nullable().optional(),
  userIdByOa: z.string().nullable().optional(),
  parentMobile: z.string().nullable().optional(),
  cccd: z.string().nullable().optional(),
  cccdIssueDate: z.string().datetime().nullable().optional(),
  fatherName: z.string().nullable().optional(),
  motherName: z.string().nullable().optional(),
  graduationYear: z.number().int().nullable().optional(),
  createdBy: z.string().uuid("ID Người tạo không hợp lệ"),
});

export type CreateCustomerFormInput = z.infer<typeof createCustomerSchema>;
