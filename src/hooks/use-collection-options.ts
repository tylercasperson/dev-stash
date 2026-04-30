'use client';

import { useState, useEffect } from 'react';
import { getUserCollections } from '@/actions/collections';
import type { CollectionOption } from '@/lib/db/collections';

export function useCollectionOptions(enabled = true): CollectionOption[] {
  const [collections, setCollections] = useState<CollectionOption[]>([]);

  useEffect(() => {
    if (!enabled) return;
    getUserCollections().then(setCollections);
  }, [enabled]);

  return collections;
}
