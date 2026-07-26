"use client";

import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Timeline } from "@/components/shared/timeline";
import { useToast } from "@/components/shared/toast";
import { mockEvidence, mockCustomers } from "@/lib/mock-data";
import { EVIDENCE_TYPE_LABELS } from "@/types/evidence";
import {
  Upload,
  FileText,
  Phone,
  Mail,
  Users,
  Calendar,
  Clock,
  Send,
  CloudUpload,
  File,
  X,
} from "lucide-react";

const evidenceSchema = z.object({
  customerId: z.string().min(1, "Vui lòng chọn khách hàng"),
  type: z.string().min(1, "Vui lòng chọn loại"),
  status: z.string().min(1, "Vui lòng chọn trạng thái"),
  notes: z.string().min(1, "Ghi chú không được để trống"),
  callDuration: z.string().optional(),
});

type EvidenceFormData = z.infer<typeof evidenceSchema>;

const TYPE_OPTIONS = Object.entries(EVIDENCE_TYPE_LABELS).map(([value, label]) => ({
  value,
  label,
}));

const STATUS_OPTIONS = [
  { value: "contacted", label: "Đã liên hệ" },
  { value: "qualified", label: "Đủ điều kiện" },
  { value: "converted", label: "Đã chuyển đổi" },
  { value: "not_reached", label: "Không liên lạc được" },
];

const TYPE_ICONS: Record<string, React.ReactNode> = {
  call: <Phone className="h-4 w-4 text-cyan-400" />,
  email: <Mail className="h-4 w-4 text-amber-400" />,
  meeting: <Users className="h-4 w-4 text-emerald-400" />,
  document: <FileText className="h-4 w-4 text-violet-400" />,
  note: <FileText className="h-4 w-4 text-navy-400" />,
};

export default function EvidencePage() {
  const { addToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<EvidenceFormData>({
    resolver: zodResolver(evidenceSchema),
  });

  const selectedCustomerId = watch("customerId");
  const selectedType = watch("type");

  const customerOptions = mockCustomers
    .filter((c) => c.assignedTo)
    .map((c) => ({
      value: c.id,
      label: `${c.name} — ${c.phone}`,
    }));

  const customerEvidence = selectedCustomerId
    ? mockEvidence.filter((e) => e.customerId === selectedCustomerId)
    : [];

  const timelineItems = customerEvidence.map((e) => ({
    id: e.id,
    title: `${EVIDENCE_TYPE_LABELS[e.type]} — ${e.consultantName}`,
    description: e.notes,
    timestamp: e.createdAt,
    icon: TYPE_ICONS[e.type],
    status: "default" as const,
  }));

  // File upload handlers
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      // TODO(security): Validate file type and size (max 10MB, allowed: PDF, PNG, JPG, DOCX)
      const maxSize = 10 * 1024 * 1024; // 10MB
      const allowedTypes = [
        "application/pdf",
        "image/png",
        "image/jpeg",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      if (droppedFile.size > maxSize) {
        addToast({
          type: "error",
          title: "File quá lớn",
          description: "File không được vượt quá 10MB.",
        });
        return;
      }
      if (!allowedTypes.includes(droppedFile.type)) {
        addToast({
          type: "error",
          title: "Loại file không hợp lệ",
          description: "Chỉ chấp nhận PDF, PNG, JPG, DOCX.",
        });
        return;
      }
      setFile(droppedFile);
    }
  }, [addToast]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) setFile(selectedFile);
  };

  const onSubmit = async (_data: EvidenceFormData) => {
    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      addToast({
        type: "success",
        title: "Upload evidence thành công",
        description: "Bằng chứng liên hệ đã được lưu.",
      });
    } catch {
      addToast({
        type: "error",
        title: "Upload thất bại",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const errs = errors as Record<string, { message?: string }>;

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-navy-100 flex items-center gap-2">
          <Upload className="h-5 w-5 text-cyan-400" />
          Upload Evidence
        </h1>
        <p className="text-sm text-navy-400 mt-0.5">
          Ghi nhận bằng chứng liên hệ với khách hàng
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit(onSubmit)}>
            <Card>
              <CardHeader>
                <CardTitle>Thông tin liên hệ</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="customerId" required>
                      Khách hàng
                    </Label>
                    <Select
                      id="customerId"
                      options={customerOptions}
                      placeholder="Chọn khách hàng"
                      error={errs.customerId?.message}
                      {...register("customerId")}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type" required>
                      Loại liên hệ
                    </Label>
                    <Select
                      id="type"
                      options={TYPE_OPTIONS}
                      placeholder="Chọn loại"
                      error={errs.type?.message}
                      {...register("type")}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status" required>
                      Trạng thái sau liên hệ
                    </Label>
                    <Select
                      id="status"
                      options={STATUS_OPTIONS}
                      placeholder="Chọn trạng thái"
                      error={errs.status?.message}
                      {...register("status")}
                    />
                  </div>
                  {selectedType === "call" && (
                    <div className="space-y-2">
                      <Label htmlFor="callDuration">
                        Thời lượng cuộc gọi (giây)
                      </Label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-navy-500" />
                        <Input
                          id="callDuration"
                          type="number"
                          placeholder="300"
                          className="pl-10"
                          {...register("callDuration")}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes" required>
                    Ghi chú
                  </Label>
                  <Textarea
                    id="notes"
                    placeholder="Mô tả nội dung liên hệ..."
                    rows={4}
                    error={errs.notes?.message}
                    {...register("notes")}
                  />
                </div>

                {/* File Upload */}
                <div className="space-y-2">
                  <Label>Tệp đính kèm</Label>
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragOver(true);
                    }}
                    onDragLeave={() => setIsDragOver(false)}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
                      isDragOver
                        ? "border-cyan-500 bg-cyan-500/5"
                        : "border-navy-600 hover:border-navy-500"
                    }`}
                  >
                    {file ? (
                      <div className="flex items-center justify-center gap-3">
                        <File className="h-8 w-8 text-cyan-400" />
                        <div className="text-left">
                          <p className="text-sm font-medium text-navy-200">
                            {file.name}
                          </p>
                          <p className="text-xs text-navy-500">
                            {(file.size / 1024).toFixed(1)} KB
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setFile(null)}
                          className="p-1 rounded-lg hover:bg-navy-700 text-navy-400 hover:text-navy-200 transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <CloudUpload className="h-10 w-10 text-navy-500 mx-auto mb-3" />
                        <p className="text-sm text-navy-300 mb-1">
                          Kéo thả file vào đây hoặc
                        </p>
                        <label className="text-sm text-cyan-400 hover:text-cyan-300 cursor-pointer font-medium">
                          chọn từ máy tính
                          <input
                            type="file"
                            className="hidden"
                            accept=".pdf,.png,.jpg,.jpeg,.docx"
                            onChange={handleFileInput}
                          />
                        </label>
                        <p className="text-xs text-navy-500 mt-2">
                          PDF, PNG, JPG, DOCX — tối đa 10MB
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="mt-6">
              <Button type="submit" isLoading={isSubmitting} size="lg">
                <Send className="h-4 w-4" />
                Lưu Evidence
              </Button>
            </div>
          </form>
        </div>

        {/* Evidence Timeline */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Calendar className="h-4 w-4 text-cyan-400" />
                Lịch sử liên hệ
              </CardTitle>
            </CardHeader>
            <CardContent>
              {timelineItems.length > 0 ? (
                <Timeline items={timelineItems} />
              ) : (
                <div className="py-8 text-center">
                  <FileText className="h-8 w-8 text-navy-600 mx-auto mb-2" />
                  <p className="text-sm text-navy-500">
                    {selectedCustomerId
                      ? "Chưa có lịch sử liên hệ"
                      : "Chọn khách hàng để xem lịch sử"}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
