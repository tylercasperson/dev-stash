'use client';

import { useEffect, useState } from 'react';

export function useDrawerFetch<T>(id: string | null, endpoint: (id: string) => string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) {
      setData(null);
      return;
    }
    setData(null);
    setLoading(true);
    fetch(endpoint(id))
      .then((r) => {
        if (!r.ok) throw new Error('Failed to fetch');
        return r.json() as Promise<T>;
      })
      .then((d) => setData(d))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [id, endpoint]);

  return { data, loading, setData };
}
