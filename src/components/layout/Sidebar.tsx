'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Code,
  Sparkles,
  Terminal,
  StickyNote,
  File,
  Image,
  Link as LinkIcon,
  Star,
  Clock,
  ChevronLeft,
  ChevronRight,
  X,
  type LucideIcon,
} from 'lucide-react';
import { mockItemTypes, mockCollections, mockTypeCounts, mockUser } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

const ICON_MAP: Record<string, LucideIcon> = {
  Code,
  Sparkles,
  Terminal,
  StickyNote,
  File,
  Image,
  Link: LinkIcon,
};

interface SidebarProps {
  isCollapsed: boolean;
  isMobileOpen: boolean;
  onToggleCollapse: () => void;
  onMobileClose: () => void;
}

export default function Sidebar({
  isCollapsed,
  isMobileOpen,
  onToggleCollapse,
  onMobileClose,
}: SidebarProps) {
  const pathname = usePathname();

  const favoriteCollections = mockCollections.filter((c) => c.isFavorite);
  const recentCollections = mockCollections.filter((c) => !c.isFavorite).slice(0, 3);

  const userInitials = mockUser.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onMobileClose}
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={cn(
          'flex flex-col border-r border-border bg-sidebar overflow-x-hidden shrink-0',
          'transition-[width,transform] duration-200 ease-in-out',
          // Mobile: fixed overlay from left, always w-64
          'fixed top-14 bottom-0 left-0 z-50 w-64',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full',
          // Desktop: in-flow, translate reset, width-based collapse
          'lg:relative lg:top-auto lg:bottom-auto lg:z-auto lg:translate-x-0',
          isCollapsed ? 'lg:w-12' : 'lg:w-56',
        )}
      >
        {/* Collapse toggle row */}
        <div
          className={cn(
            'flex items-center border-b border-border px-2 py-2',
            isCollapsed ? 'justify-center' : 'justify-between',
          )}
        >
          {/* Desktop: brand label when expanded */}
          {!isCollapsed && (
            <span className="hidden lg:block text-xs font-semibold text-muted-foreground pl-1">
              Navigation
            </span>
          )}

          {/* Desktop: collapse/expand toggle */}
          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>

          {/* Mobile: close button */}
          <button
            onClick={onMobileClose}
            className="flex lg:hidden h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors ml-auto"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Scrollable nav content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden py-2">
          {/* Types */}
          <SidebarSection label="Types" isCollapsed={isCollapsed}>
            {mockItemTypes.map((type) => {
              const Icon = ICON_MAP[type.icon];
              const count = mockTypeCounts[type.name as keyof typeof mockTypeCounts];
              const href = `/items/${type.name}s`;

              return (
                <SidebarLink
                  key={type.id}
                  href={href}
                  icon={<Icon className="h-4 w-4 shrink-0" style={{ color: type.color }} />}
                  label={`${type.name.charAt(0).toUpperCase()}${type.name.slice(1)}s`}
                  count={count}
                  isActive={pathname === href}
                  isCollapsed={isCollapsed}
                  tooltip={`${type.name}s (${count})`}
                />
              );
            })}
          </SidebarSection>

          {/* Favorites */}
          <SidebarSection
            label="Favorites"
            isCollapsed={isCollapsed}
            icon={<Star className="h-3 w-3" />}
          >
            {favoriteCollections.map((col) => (
              <SidebarLink
                key={col.id}
                href={`/collections/${col.id}`}
                icon={<Star className="h-4 w-4 shrink-0 text-yellow-500" />}
                label={col.name}
                isActive={pathname === `/collections/${col.id}`}
                isCollapsed={isCollapsed}
                tooltip={col.name}
              />
            ))}
          </SidebarSection>

          {/* Recent */}
          <SidebarSection
            label="Recent"
            isCollapsed={isCollapsed}
            icon={<Clock className="h-3 w-3" />}
          >
            {recentCollections.map((col) => (
              <SidebarLink
                key={col.id}
                href={`/collections/${col.id}`}
                icon={<Clock className="h-4 w-4 shrink-0 text-muted-foreground" />}
                label={col.name}
                isActive={pathname === `/collections/${col.id}`}
                isCollapsed={isCollapsed}
                tooltip={col.name}
              />
            ))}
          </SidebarSection>
        </div>

        {/* User avatar */}
        <div
          className={cn(
            'border-t border-border p-2',
            isCollapsed ? 'flex justify-center' : 'flex items-center gap-2',
          )}
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sidebar-primary text-sidebar-primary-foreground text-xs font-semibold">
            {userInitials}
          </div>
          {!isCollapsed && (
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-sidebar-foreground">
                {mockUser.name}
              </p>
              <p className="truncate text-xs text-muted-foreground">{mockUser.email}</p>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

function SidebarSection({
  label,
  isCollapsed,
  icon,
  children,
}: {
  label: string;
  isCollapsed: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-1">
      {!isCollapsed ? (
        <div className="flex items-center gap-1 px-3 py-1">
          {icon}
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            {label}
          </span>
        </div>
      ) : (
        <div className="flex justify-center py-1">
          <div className="h-px w-6 bg-border" />
        </div>
      )}
      <div className="space-y-0.5 px-1">{children}</div>
    </div>
  );
}

function SidebarLink({
  href,
  icon,
  label,
  count,
  isActive,
  isCollapsed,
  tooltip,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  count?: number;
  isActive: boolean;
  isCollapsed: boolean;
  tooltip: string;
}) {
  return (
    <Link
      href={href}
      title={isCollapsed ? tooltip : undefined}
      className={cn(
        'flex items-center gap-2.5 rounded-md px-2 py-1.5 text-sm transition-colors',
        isActive
          ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
          : 'text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground',
        isCollapsed && 'justify-center px-0',
      )}
    >
      {icon}
      {!isCollapsed && (
        <>
          <span className="flex-1 truncate">{label}</span>
          {count !== undefined && (
            <span className="text-xs text-muted-foreground tabular-nums">{count}</span>
          )}
        </>
      )}
    </Link>
  );
}
