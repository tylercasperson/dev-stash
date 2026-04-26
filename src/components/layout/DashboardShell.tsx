'use client';

import { useState, useEffect } from 'react';
import TopBar from './TopBar';
import Sidebar from './Sidebar';
import CommandPalette from '@/components/dashboard/CommandPalette';
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
  const [commandOpen, setCommandOpen] = useState(false);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandOpen((open) => !open);
      }
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background">
      <TopBar
        onMobileMenuClick={() => setIsMobileOpen(true)}
        onOpenSearch={() => setCommandOpen(true)}
      />
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
      <CommandPalette open={commandOpen} onOpenChange={setCommandOpen} />
    </div>
  );
}
