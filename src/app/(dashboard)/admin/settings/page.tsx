"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings, Globe, Bell, Shield, Database } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-navy-100 flex items-center gap-2">
          <Settings className="h-5 w-5 text-cyan-400" />
          Cài đặt hệ thống
        </h1>
        <p className="text-sm text-navy-400 mt-0.5">
          Quản lý cài đặt chung cho hệ thống CRM
        </p>
      </div>

      <div className="space-y-6 max-w-2xl">
        {/* General */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Globe className="h-4 w-4 text-cyan-400" />
              Cài đặt chung
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="orgName">Tên tổ chức</Label>
              <Input id="orgName" defaultValue="Trường Đại Học ABC" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="apiUrl">API Gateway URL</Label>
              <Input
                id="apiUrl"
                defaultValue="http://localhost:5000"
                disabled
              />
              <p className="text-xs text-navy-500">
                Cấu hình qua biến môi trường NEXT_PUBLIC_API_BASE_URL
              </p>
            </div>
          </CardContent>
        </Card>

        {/* SLA */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Shield className="h-4 w-4 text-amber-400" />
              Cài đặt SLA
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="slaHours">Thời hạn SLA (giờ)</Label>
                <Input
                  id="slaHours"
                  type="number"
                  defaultValue="72"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slaWarning">Cảnh báo trước (giờ)</Label>
                <Input
                  id="slaWarning"
                  type="number"
                  defaultValue="12"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notifications placeholder */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Bell className="h-4 w-4 text-emerald-400" />
              Thông báo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-navy-400">
              Cài đặt thông báo sẽ được phát triển trong phiên bản tiếp theo.
            </p>
          </CardContent>
        </Card>

        {/* Audit log placeholder */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Database className="h-4 w-4 text-violet-400" />
              Audit Log
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-navy-400">
              Nhật ký hoạt động hệ thống sẽ được phát triển trong phiên bản tiếp theo.
            </p>
          </CardContent>
        </Card>

        <Button>Lưu cài đặt</Button>
      </div>
    </div>
  );
}
