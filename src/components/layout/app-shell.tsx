"use client";

import * as React from "react";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";
import { Breadcrumb } from "./breadcrumb";
import { cn } from "@/lib/utils";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main area */}
      <div
        className={cn(
          "transition-all duration-300",
          sidebarCollapsed ? "lg:ml-[68px]" : "lg:ml-64"
        )}
      >
        <Topbar
          sidebarCollapsed={sidebarCollapsed}
          onMenuClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        <main className="pt-16 min-h-screen">
          <div className="p-6 lg:p-8">
            <Breadcrumb />
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
