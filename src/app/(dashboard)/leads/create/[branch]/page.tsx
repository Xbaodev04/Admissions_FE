"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/shared/ui/components/ui/button";
import { Input } from "@/shared/ui/components/ui/input";
import { Label } from "@/shared/ui/components/ui/label";
import { Textarea } from "@/shared/ui/components/ui/textarea";
import { Select } from "@/shared/ui/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/ui/components/ui/card";
import { Badge } from "@/shared/ui/components/ui/badge";
import { useToast } from "@/shared/ui/components/shared/toast";
import { formalService, shorttermService } from "@/features/customers/customer.service";
import { BRANCH_LABELS, type Branch } from "@/shared/types/common";
import { maskPhone } from "@/shared/utils/utils";
import {
  User,
  Phone,
  Mail,
  MapPin,
  FileText,
  GraduationCap,
  Car,
  BookOpen,
  ArrowLeft,
  Eye,
  Send,
} from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "@/features/auth/auth.store";
import { RoleTeam } from "@/features/auth/auth.types";

// Base validation schema shared by all branches
const baseSchema = z.object({
  name: z.string().min(2, "Họ tên phải có ít nhất 2 ký tự"),
  phone: z
    .string()
    .min(10, "Số điện thoại phải có ít nhất 10 số")
    .regex(/^[0-9]+$/, "Số điện thoại chỉ chứa chữ số"),
  email: z.string().email("Email không hợp lệ").optional().or(z.literal("")),
  address: z.string().optional(),
  source: z.string().optional(),
  notes: z.string().optional(),
});

// Formal-specific fields
const formalSchema = baseSchema.extend({
  highSchool: z.string().optional(),
  graduationYear: z.string().optional(),
  desiredMajor: z.string().optional(),
  parentName: z.string().optional(),
  parentPhone: z.string().optional(),
});

// Driving-specific fields
const drivingSchema = baseSchema.extend({
  licenseType: z.string().optional(),
  currentLicense: z.string().optional(),
  dateOfBirth: z.string().optional(),
  identityNumber: z.string().optional(),
});

// ShortTerm-specific fields
const shorttermSchema = baseSchema.extend({
  desiredCourse: z.string().optional(),
  preferredSchedule: z.string().optional(),
  currentOccupation: z.string().optional(),
});

const schemaMap: Record<string, z.ZodType> = {
  formal: formalSchema,
  driving: drivingSchema,
  shortterm: shorttermSchema,
};

const BRANCH_ICON: Record<string, React.ReactNode> = {
  formal: <GraduationCap className="h-5 w-5" />,
  driving: <Car className="h-5 w-5" />,
  shortterm: <BookOpen className="h-5 w-5" />,
};

const SOURCE_OPTIONS = [
  { value: "website", label: "Website" },
  { value: "facebook", label: "Facebook" },
  { value: "referral", label: "Giới thiệu" },
  { value: "hotline", label: "Hotline" },
  { value: "event", label: "Sự kiện" },
  { value: "other", label: "Khác" },
];

const LICENSE_TYPES = [
  { value: "B1", label: "B1 - Xe số tự động" },
  { value: "B2", label: "B2 - Xe ô tô" },
  { value: "C", label: "C - Xe tải" },
  { value: "D", label: "D - Xe khách" },
  { value: "E", label: "E - Xe đầu kéo" },
];

export default function CreateLeadPage() {
  const params = useParams();
  const router = useRouter();
  const { addToast } = useToast();
  const branch = params.branch as string;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    if (user?.roleTeam === RoleTeam.Formal) {
      router.replace("/reports/assignment");
    }
  }, [user, router]);

  const branchLabel = BRANCH_LABELS[branch as Branch] || branch;
  const schema = schemaMap[branch] || baseSchema;

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      address: "",
      source: "",
      notes: "",
    },
  });

  const formValues = watch();

  const mapSourceToEnum = (src?: string | null): number => {
    switch (src) {
      case "website": return 1;
      case "facebook": return 2;
      case "referral": return 5;
      case "hotline": return 11;
      default: return 9; // DataEntry
    }
  };

  const onSubmit = async (_data: Record<string, unknown>) => {
    if (branch === "driving") {
      addToast({
        type: "error",
        title: "API chưa sẵn sàng",
        description: "Hệ thống chưa hỗ trợ tạo Lead tự động cho hệ Lái xe (Driving).",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        fullName: _data.name as string,
        mobile: _data.phone as string,
        source: mapSourceToEnum(_data.source as string),
      };

      if (branch === "formal") {
        await formalService.createCustomer(payload);
      } else if (branch === "shortterm") {
        await shorttermService.createCustomer(payload);
      } else {
        throw new Error("API chưa sẵn sàng: Nhánh tuyển sinh không hỗ trợ API mới này.");
      }

      addToast({
        type: "success",
        title: "Tạo lead thành công",
        description: `Lead ${formValues.name} đã được tạo cho nhánh ${branchLabel}.`,
      });
      router.push("/");
    } catch (err: any) {
      addToast({
        type: "error",
        title: "Tạo lead thất bại",
        description: err.message || "Đã xảy ra lỗi. Vui lòng thử lại.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const errs = errors as Record<string, { message?: string }>;

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/">
          <Button variant="ghost" size="icon-sm">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-xl font-bold text-navy-100 flex items-center gap-2">
            {BRANCH_ICON[branch]}
            Tạo Lead {branchLabel}
          </h1>
          <p className="text-sm text-navy-400 mt-0.5">
            Nhập thông tin khách hàng mới
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit(onSubmit)}>
            <Card>
              <CardHeader>
                <CardTitle>Thông tin cơ bản</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="name" required>Họ tên</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-navy-500" />
                      <Input
                        id="name"
                        placeholder="Nguyễn Văn A"
                        className="pl-10"
                        error={errs.name?.message}
                        {...register("name")}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" required>Số điện thoại</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-navy-500" />
                      <Input
                        id="phone"
                        placeholder="09xx xxx xxx"
                        className="pl-10"
                        error={errs.phone?.message}
                        {...register("phone")}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-navy-500" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="email@example.com"
                        className="pl-10"
                        error={errs.email?.message}
                        {...register("email")}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="source">Nguồn lead</Label>
                    <Select
                      id="source"
                      options={SOURCE_OPTIONS}
                      placeholder="Chọn nguồn"
                      {...register("source")}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Địa chỉ</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-navy-500" />
                    <Input
                      id="address"
                      placeholder="Số nhà, đường, quận/huyện, tỉnh/thành phố"
                      className="pl-10"
                      {...register("address")}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Ghi chú</Label>
                  <Textarea
                    id="notes"
                    placeholder="Ghi chú thêm về khách hàng..."
                    rows={3}
                    {...register("notes")}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Branch-specific fields */}
            {branch === "formal" && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Thông tin chính quy</CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label htmlFor="highSchool">Trường THPT</Label>
                      <Input
                        id="highSchool"
                        placeholder="Tên trường THPT"
                        {...register("highSchool")}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="graduationYear">Năm tốt nghiệp</Label>
                      <Input
                        id="graduationYear"
                        placeholder="2024"
                        {...register("graduationYear")}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="desiredMajor">Ngành mong muốn</Label>
                      <Input
                        id="desiredMajor"
                        placeholder="Công nghệ thông tin"
                        {...register("desiredMajor")}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="parentName">Tên phụ huynh</Label>
                      <Input
                        id="parentName"
                        placeholder="Họ tên phụ huynh"
                        {...register("parentName")}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="parentPhone">SĐT phụ huynh</Label>
                      <Input
                        id="parentPhone"
                        placeholder="09xx xxx xxx"
                        {...register("parentPhone")}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {branch === "driving" && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Thông tin lái xe</CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label htmlFor="licenseType">Loại bằng muốn học</Label>
                      <Select
                        id="licenseType"
                        options={LICENSE_TYPES}
                        placeholder="Chọn loại bằng"
                        {...register("licenseType")}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="currentLicense">Bằng hiện có</Label>
                      <Input
                        id="currentLicense"
                        placeholder="Nếu có"
                        {...register("currentLicense")}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dateOfBirth">Ngày sinh</Label>
                      <Input
                        id="dateOfBirth"
                        type="date"
                        {...register("dateOfBirth")}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="identityNumber">Số CCCD</Label>
                      <Input
                        id="identityNumber"
                        placeholder="Số căn cước công dân"
                        {...register("identityNumber")}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {branch === "shortterm" && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Thông tin ngắn hạn</CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label htmlFor="desiredCourse">Khóa học mong muốn</Label>
                      <Input
                        id="desiredCourse"
                        placeholder="Tên khóa học"
                        {...register("desiredCourse")}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="preferredSchedule">Lịch học mong muốn</Label>
                      <Input
                        id="preferredSchedule"
                        placeholder="Sáng / Chiều / Tối"
                        {...register("preferredSchedule")}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="currentOccupation">Nghề nghiệp hiện tại</Label>
                      <Input
                        id="currentOccupation"
                        placeholder="Sinh viên, nhân viên..."
                        {...register("currentOccupation")}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Submit */}
            <div className="mt-6 flex flex-col gap-3">
              {branch === "driving" && (
                <p className="text-sm font-semibold text-rose-500">
                  ⚠️ Hệ thống Lái xe (Driving API) chưa sẵn sàng. Bạn không thể tạo lead tại thời điểm này.
                </p>
              )}
              <div className="flex items-center gap-3">
                <Button type="submit" isLoading={isSubmitting} size="lg" disabled={branch === "driving"}>
                  <Send className="h-4 w-4" />
                  {branch === "driving" ? "API chưa sẵn sàng" : "Tạo Lead"}
                </Button>
                <Link href="/">
                  <Button variant="ghost" type="button">
                    Hủy
                  </Button>
                </Link>
              </div>
            </div>
          </form>
        </div>

        {/* Preview Panel */}
        <div className="hidden lg:block">
          <div className="sticky top-24">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-cyan-400" />
                  Xem trước
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-xs text-navy-500 uppercase tracking-wider mb-1">Nhánh</p>
                  <Badge variant={branch === "formal" ? "cyan" : branch === "driving" ? "warning" : "success"}>
                    {branchLabel}
                  </Badge>
                </div>

                <div>
                  <p className="text-xs text-navy-500 uppercase tracking-wider mb-1">Họ tên</p>
                  <p className="text-sm text-navy-200 font-medium">
                    {formValues.name || "—"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-navy-500 uppercase tracking-wider mb-1">Số điện thoại</p>
                  <p className="text-sm text-navy-200">
                    {formValues.phone ? maskPhone(formValues.phone) : "—"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-navy-500 uppercase tracking-wider mb-1">Email</p>
                  <p className="text-sm text-navy-200">
                    {formValues.email || "—"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-navy-500 uppercase tracking-wider mb-1">Nguồn</p>
                  <p className="text-sm text-navy-200">
                    {SOURCE_OPTIONS.find((o) => o.value === formValues.source)?.label || "—"}
                  </p>
                </div>

                {formValues.notes && (
                  <div>
                    <p className="text-xs text-navy-500 uppercase tracking-wider mb-1">Ghi chú</p>
                    <p className="text-sm text-navy-300">{formValues.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
