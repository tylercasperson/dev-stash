'use client';

import { useState } from 'react';
import TopBar from './TopBar';
import Sidebar from './Sidebar';
import type { SidebarData } from '@/lib/db/collections';

interface DashboardShellProps {
  children: React.ReactNode;
  sidebarData: SidebarData;
  userInitials: string;
  userName: string;
  userEmail: string;
}

export default function DashboardShell({
  children,
  sidebarData,
  userInitials,
  userName,
  userEmail,
}: DashboardShellProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background">
      <TopBar onMobileMenuClick={() => setIsMobileOpen(true)} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          isCollapsed={isCollapsed}
          isMobileOpen={isMobileOpen}
          onToggleCollapse={() => setIsCollapsed((c) => !c)}
          onMobileClose={() => setIsMobileOpen(false)}
          sidebarData={sidebarData}
          userInitials={userInitials}
          userName={userName}
          userEmail={userEmail}
        />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
