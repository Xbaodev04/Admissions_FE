"use client";

import React from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/ui/components/ui/card";
import { Button } from "@/shared/ui/components/ui/button";
import { AlertTriangle, ArrowLeft, Database, UserPlus } from "lucide-react";

export default function CreateLeadPage() {
  return (
    <div className="animate-fade-in max-w-xl mx-auto py-12">
      <Card className="border border-navy-700/30 bg-navy-800/20 backdrop-blur-md text-center p-6 space-y-6">
        <div className="flex justify-center">
          <div className="h-16 w-16 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500">
            <AlertTriangle className="h-8 w-8" />
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-bold text-navy-100">Tính năng Tạo Lead Thủ Công không khả dụng</h2>
          <p className="text-sm text-navy-300">
            Hệ thống hiện tại không hỗ trợ API tạo thủ công khách hàng đơn lẻ. Việc sinh lead được thực hiện tự động bằng tính năng <strong>Seed Lead Mẫu</strong> hoặc đẩy trực tiếp qua RabbitMQ.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-3 pt-4 border-t border-navy-700/30">
          <Link href="/assignment">
            <Button className="w-full sm:w-auto bg-cyan-600 hover:bg-cyan-500 text-white gap-2">
              <Database className="h-4 w-4" />
              Đi tới trang Seed Lead & Giao việc
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline" className="w-full sm:w-auto text-navy-300 border-navy-700 hover:bg-navy-800 gap-2">
              <ArrowLeft className="h-4 w-4" />
              Về Trang chủ
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
