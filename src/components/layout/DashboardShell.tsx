'use client';

import { useState } from 'react';
import TopBar from './TopBar';
import Sidebar from './Sidebar';
import type { SidebarData } from '@/lib/db/collections';

interface DashboardShellProps {
  children: React.ReactNode;
  sidebarData: SidebarData;
  userName: string;
  userEmail: string;
  userImage?: string | null;
}

export default function DashboardShell({
  children,
  sidebarData,
  userName,
  userEmail,
  userImage,
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
          userName={userName}
          userEmail={userEmail}
          userImage={userImage}
        />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
