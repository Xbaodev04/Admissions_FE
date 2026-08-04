"use client";

import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/components/ui/card";
import { Badge } from "@/shared/ui/components/ui/badge";
import { Avatar } from "@/shared/ui/components/ui/avatar";
import { Timeline } from "@/shared/ui/components/shared/timeline";
import {
  User,
  Phone,
  Mail,
  Calendar,
  Clock,
  History,
  AlertTriangle,
  UserPlus,
  ArrowRightLeft,
  CheckCircle2,
} from "lucide-react";

const mockLead = {
  id: "L-2023-001",
  name: "Phan Văn Bảo",
  phone: "0901234567",
  email: "bao.phan@example.com",
  source: "Facebook Ads",
  status: "new",
  createdAt: "2023-10-15 08:30:00",
  assignedTo: "Trần Thị B",
};

const mockHistory = [
  {
    id: 1,
    title: "Lead được tạo mới trên hệ thống",
    description: "Nguồn: Facebook Ads",
    timestamp: "2023-10-15 08:30:00",
    icon: <User className="h-4 w-4 text-cyan-400" />,
    status: "default",
  },
  {
    id: 2,
    title: "Hệ thống tự động phân bổ",
    description: "Giao cho nhân viên: Nguyễn Văn A (Round-robin)",
    timestamp: "2023-10-15 08:30:05",
    icon: <UserPlus className="h-4 w-4 text-emerald-400" />,
    status: "success",
  },
  {
    id: 3,
    title: "Cảnh báo vi phạm SLA",
    description: "Nhân viên Nguyễn Văn A không liên hệ trong vòng 2h. Gửi email cảnh báo lần 1.",
    timestamp: "2023-10-15 10:30:00",
    icon: <AlertTriangle className="h-4 w-4 text-amber-400" />,
    status: "warning",
  },
  {
    id: 4,
    title: "Cảnh báo vi phạm SLA (Lần 3)",
    description: "Thu hồi Lead. Gửi email cho Manager.",
    timestamp: "2023-10-15 14:30:00",
    icon: <AlertTriangle className="h-4 w-4 text-rose-400" />,
    status: "destructive",
  },
  {
    id: 5,
    title: "Quản lý phân bổ lại",
    description: "Chuyển giao từ Manager sang nhân viên Trần Thị B.",
    timestamp: "2023-10-15 15:00:00",
    icon: <ArrowRightLeft className="h-4 w-4 text-violet-400" />,
    status: "default",
  },
  {
    id: 6,
    title: "Liên hệ khách hàng thành công",
    description: "Trần Thị B đã ghi nhận cuộc gọi dài 5 phút. Khách hàng quan tâm.",
    timestamp: "2023-10-15 15:30:00",
    icon: <CheckCircle2 className="h-4 w-4 text-emerald-400" />,
    status: "success",
  },
];

export default function LeadDetailPage() {
  const params = useParams();
  const id = params.id as string;

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="text-xl font-bold text-navy-100 flex items-center gap-2">
          <User className="h-5 w-5 text-cyan-400" />
          Chi tiết Khách hàng: {id || mockLead.id}
        </h1>
        <p className="text-sm text-navy-400 mt-0.5">
          Xem thông tin và lịch sử phân bổ của khách hàng này.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lead Info */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <User className="h-4 w-4 text-cyan-400" />
                Thông tin chung
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 pb-4 border-b border-navy-700/50">
                <Avatar name={mockLead.name} size="md" />
                <div>
                  <p className="text-sm font-medium text-navy-100">{mockLead.name}</p>
                  <Badge variant="cyan" className="mt-1">Lead Mới</Badge>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="h-4 w-4 text-navy-400" />
                  <span className="text-navy-200">{mockLead.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="h-4 w-4 text-navy-400" />
                  <span className="text-navy-200">{mockLead.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Clock className="h-4 w-4 text-navy-400" />
                  <span className="text-navy-200">Nguồn: {mockLead.source}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="h-4 w-4 text-navy-400" />
                  <span className="text-navy-200">Tạo: {mockLead.createdAt}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lead History Session */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <History className="h-4 w-4 text-amber-400" />
                Session Lịch sử Phân bổ & Xử lý (Audit Trail)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Force type cast to any to bypass strict type checking for timeline items if needed */}
              <Timeline items={mockHistory as any} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
