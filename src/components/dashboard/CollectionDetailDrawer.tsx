'use client';

import { useEffect, useState } from 'react';
import { File, FolderOpen, Star } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';
import { ICON_MAP } from '@/lib/icon-map';
import type { CollectionDetail } from '@/lib/db/collections';

interface CollectionDetailDrawerProps {
  collectionId: string | null;
  onClose: () => void;
}

export default function CollectionDetailDrawer({ collectionId, onClose }: CollectionDetailDrawerProps) {
  const [collection, setCollection] = useState<CollectionDetail | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!collectionId) {
      setCollection(null);
      return;
    }
    setCollection(null);
    setLoading(true);
    fetch(`/api/collections/${collectionId}`)
      .then((r) => {
        if (!r.ok) throw new Error('Failed to fetch collection');
        return r.json();
      })
      .then((data: CollectionDetail) => setCollection(data))
      .catch(() => setCollection(null))
      .finally(() => setLoading(false));
  }, [collectionId]);

  return (
    <Sheet open={!!collectionId} onOpenChange={(open) => { if (!open) onClose(); }}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto flex flex-col gap-0 p-0">
        {loading || !collection ? (
          <DrawerSkeleton />
        ) : (
          <DrawerContent collection={collection} />
        )}
      </SheetContent>
    </Sheet>
  );
}

function DrawerContent({ collection }: { collection: CollectionDetail }) {
  return (
    <>
      {/* Header */}
      <SheetHeader className="px-6 pt-6 pb-4 border-b border-border">
        <div className="flex items-center gap-2 mb-1">
          <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium bg-muted text-muted-foreground">
            <FolderOpen className="h-3 w-3" />
            Collection
          </span>
          {collection.isFavorite && (
            <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs bg-yellow-500/10 text-yellow-600">
              <Star className="h-3 w-3 fill-current" />
              Favorite
            </span>
          )}
        </div>
        <SheetTitle className="text-base font-semibold text-foreground text-left">
          {collection.name}
        </SheetTitle>
      </SheetHeader>

      {/* Body */}
      <div className="flex flex-col gap-5 px-6 py-5">
        {collection.description && (
          <Section label="Description">
            <p className="text-sm text-muted-foreground leading-relaxed">{collection.description}</p>
          </Section>
        )}

        <Section label={`Items (${collection.items.length})`}>
          {collection.items.length === 0 ? (
            <p className="text-sm text-muted-foreground">No items in this collection.</p>
          ) : (
            <ul className="flex flex-col gap-1.5">
              {collection.items.map((item) => {
                const Icon = ICON_MAP[item.typeIcon] ?? File;
                return (
                  <li
                    key={item.id}
                    className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm"
                  >
                    <Icon className="h-4 w-4 shrink-0" style={{ color: item.typeColor }} />
                    <span className="flex-1 truncate text-foreground">{item.title}</span>
                    <span className="shrink-0 text-xs text-muted-foreground capitalize">
                      {item.typeName}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </Section>

        <Section label="Details">
          <div className="flex flex-col gap-1.5 text-sm">
            <DetailRow label="Created" value={collection.createdAt} />
            <DetailRow label="Updated" value={collection.updatedAt} />
          </div>
        </Section>
      </div>
    </>
  );
}

function DrawerSkeleton() {
  return (
    <div className="flex flex-col gap-4 px-6 py-6">
      <Skeleton className="h-5 w-24 rounded-full" />
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-1/4 mt-2" />
      <Skeleton className="h-16 w-full" />
      <Skeleton className="h-4 w-1/4 mt-2" />
      <div className="flex flex-col gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-full" />
        ))}
      </div>
    </div>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</span>
      {children}
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-foreground">{value}</span>
    </div>
  );
}
