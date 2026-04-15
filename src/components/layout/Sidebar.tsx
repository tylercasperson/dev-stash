'use client';

import { useState } from 'react';
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
  ChevronDown,
  X,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import type { SidebarData } from '@/lib/db/collections';

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
  sidebarData: SidebarData;
  userInitials: string;
  userName: string;
  userEmail: string;
}

export default function Sidebar({
  isCollapsed,
  isMobileOpen,
  onToggleCollapse,
  onMobileClose,
  sidebarData,
  userInitials,
  userName,
  userEmail,
}: SidebarProps) {
  const pathname = usePathname();
  const [typesOpen, setTypesOpen] = useState(true);
  const [collectionsOpen, setCollectionsOpen] = useState(true);

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
          'fixed top-14 bottom-0 left-0 z-50 w-64',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full',
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
          {!isCollapsed && (
            <span className="hidden lg:block text-xs font-semibold text-muted-foreground pl-1">
              Navigation
            </span>
          )}

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

          <button
            onClick={onMobileClose}
            className="flex lg:hidden h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors ml-auto"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Scrollable nav content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden py-2">

          {/* Types section */}
          {!isCollapsed ? (
            <div className="mb-1">
              <button
                onClick={() => setTypesOpen((o) => !o)}
                className="flex w-full items-center justify-between px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
              >
                <span>Types</span>
                <ChevronDown
                  className={cn('h-3 w-3 transition-transform duration-150', typesOpen && 'rotate-180')}
                />
              </button>
              {typesOpen && (
                <div className="space-y-0.5 px-1">
                  {sidebarData.itemTypes.map((type) => {
                    const Icon = ICON_MAP[type.icon];
                    const href = `/items/${type.name}s`;
                    return (
                      <SidebarLink
                        key={type.id}
                        href={href}
                        icon={<Icon className="h-4 w-4 shrink-0" style={{ color: type.color }} />}
                        label={`${type.name.charAt(0).toUpperCase()}${type.name.slice(1)}s`}
                        count={type.count}
                        isActive={pathname === href}
                        isCollapsed={false}
                        tooltip={`${type.name}s (${type.count})`}
                        isPro={type.name === 'file' || type.name === 'image'}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            <div className="mb-1 space-y-0.5 px-1">
              {sidebarData.itemTypes.map((type) => {
                const Icon = ICON_MAP[type.icon];
                const href = `/items/${type.name}s`;
                return (
                  <SidebarLink
                    key={type.id}
                    href={href}
                    icon={<Icon className="h-4 w-4 shrink-0" style={{ color: type.color }} />}
                    label={`${type.name.charAt(0).toUpperCase()}${type.name.slice(1)}s`}
                    count={type.count}
                    isActive={pathname === href}
                    isCollapsed={true}
                    tooltip={`${type.name}s (${type.count})`}
                    isPro={type.name === 'file' || type.name === 'image'}
                  />
                );
              })}
            </div>
          )}

          {/* Separator between Types and Collections */}
          {!isCollapsed && (
            <div className="mx-3 my-2 border-t border-border/60" />
          )}

          {/* Collections section */}
          {!isCollapsed ? (
            <div className="mb-1">
              <button
                onClick={() => setCollectionsOpen((o) => !o)}
                className="flex w-full items-center justify-between px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
              >
                <span>Collections</span>
                <ChevronDown
                  className={cn('h-3 w-3 transition-transform duration-150', collectionsOpen && 'rotate-180')}
                />
              </button>

              {collectionsOpen && (
                <>
                  {/* Favorites subsection */}
                  {sidebarData.favoriteCollections.length > 0 && (
                    <div className="mb-1">
                      <div className="flex items-center gap-1 px-3 py-1">
                        <Star className="h-3 w-3 text-muted-foreground" />
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                          Favorites
                        </span>
                      </div>
                      <div className="space-y-0.5 px-1">
                        {sidebarData.favoriteCollections.map((col) => (
                          <SidebarLink
                            key={col.id}
                            href={`/collections/${col.id}`}
                            icon={<Star className="h-4 w-4 shrink-0 fill-yellow-500 text-yellow-500" />}
                            label={col.name}
                            isActive={pathname === `/collections/${col.id}`}
                            isCollapsed={false}
                            tooltip={col.name}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* All Collections subsection */}
                  {sidebarData.recentCollections.length > 0 && (
                    <div className="mb-1">
                      <div className="flex items-center gap-1 px-3 py-1">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                          All Collections
                        </span>
                      </div>
                      <div className="space-y-0.5 px-1">
                        {sidebarData.recentCollections.map((col) => (
                          <SidebarLink
                            key={col.id}
                            href={`/collections/${col.id}`}
                            icon={
                              <span
                                className="h-4 w-4 shrink-0 rounded-full"
                                style={{ backgroundColor: col.dominantTypeColor }}
                              />
                            }
                            label={col.name}
                            isActive={pathname === `/collections/${col.id}`}
                            isCollapsed={false}
                            tooltip={col.name}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* View all link */}
                  <div className="px-2 pt-1 pb-2">
                    <Link
                      href="/collections"
                      className="flex items-center justify-center rounded-md px-2 py-1.5 text-xs text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground transition-colors"
                    >
                      View all collections
                    </Link>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="mb-1 space-y-0.5 px-1">
              {[...sidebarData.favoriteCollections, ...sidebarData.recentCollections].map((col) => (
                <SidebarLink
                  key={col.id}
                  href={`/collections/${col.id}`}
                  icon={
                    <span
                      className="h-4 w-4 shrink-0 rounded-full"
                      style={{ backgroundColor: col.dominantTypeColor }}
                    />
                  }
                  label={col.name}
                  isActive={pathname === `/collections/${col.id}`}
                  isCollapsed={true}
                  tooltip={col.name}
                />
              ))}
            </div>
          )}
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
              <p className="truncate text-sm font-medium text-sidebar-foreground">{userName}</p>
              <p className="truncate text-xs text-muted-foreground">{userEmail}</p>
            </div>
          )}
        </div>
      </aside>
    </>
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
  isPro,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  count?: number;
  isActive: boolean;
  isCollapsed: boolean;
  tooltip: string;
  isPro?: boolean;
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
          {isPro && (
            <Badge variant="secondary" className="h-4 px-1 text-[10px] font-semibold tracking-wide">
              PRO
            </Badge>
          )}
          {count !== undefined && (
            <span className="text-xs text-muted-foreground tabular-nums">{count}</span>
          )}
        </>
      )}
    </Link>
  );
}
