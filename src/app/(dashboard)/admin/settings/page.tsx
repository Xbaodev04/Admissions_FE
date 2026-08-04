"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/shared/ui/components/ui/card";
import { Button } from "@/shared/ui/components/ui/button";
import { Input } from "@/shared/ui/components/ui/input";
import { Label } from "@/shared/ui/components/ui/label";
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

        {/* Automation Rules */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Shield className="h-4 w-4 text-violet-400" />
              Tự động phân bổ & Cảnh báo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="autoAssignRule">Quy tắc phân bổ Lead</Label>
                <select
                  id="autoAssignRule"
                  className="w-full h-10 rounded-md border border-navy-700/50 bg-navy-800/50 px-3 py-2 text-sm text-navy-100 outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50"
                  defaultValue="round-robin"
                >
                  <option value="round-robin">Round-Robin (Xoay vòng đều)</option>
                  <option value="performance">Ưu tiên theo hiệu suất (SLA)</option>
                  <option value="manual">Chỉ định thủ công</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxRetries">Số lần giao không liên hệ tối đa</Label>
                <Input
                  id="maxRetries"
                  type="number"
                  defaultValue="3"
                />
                <p className="text-xs text-navy-500">
                  Giao quá số lần này sẽ gửi email cảnh báo và chuyển về Quản lý
                </p>
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="fallbackManager">Account Quản lý nhận Lead thu hồi</Label>
                <select
                  id="fallbackManager"
                  className="w-full h-10 rounded-md border border-navy-700/50 bg-navy-800/50 px-3 py-2 text-sm text-navy-100 outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50"
                  defaultValue="manager1"
                >
                  <option value="manager1">Manager Tuyển Sinh (manager@crm.edu.vn)</option>
                  <option value="admin1">System Admin (admin@crm.edu.vn)</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notifications config */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Bell className="h-4 w-4 text-emerald-400" />
              Thông báo (Zalo/Email)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2 flex flex-col justify-center">
                <Label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="accent-cyan-500" />
                  Gửi Email khi có Lead mới
                </Label>
                <Label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="accent-cyan-500" />
                  Gửi thông báo Zalo ZNS khi có Lead mới
                </Label>
              </div>
              <div className="space-y-2 flex flex-col justify-center">
                 <Label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="accent-rose-500" />
                  Gửi Email cảnh báo vi phạm SLA
                </Label>
                 <Label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="accent-rose-500" />
                  Thông báo quản lý khi thu hồi Lead
                </Label>
              </div>
            </div>
          </CardContent>
        </Card>

        <Button>Lưu cài đặt</Button>
      </div>
    </div>
  );
}
