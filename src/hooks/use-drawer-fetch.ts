'use client';

import { useCallback, useEffect, useState } from 'react';

type FetchState<T> = { data: T | null; loading: boolean };

export function useDrawerFetch<T>(id: string | null, endpoint: (id: string) => string) {
  const [state, setState] = useState<FetchState<T>>({ data: null, loading: false });

  useEffect(() => {
    if (!id) {
      setState({ data: null, loading: false });
      return;
    }
    setState({ data: null, loading: true });
    fetch(endpoint(id))
      .then((r) => {
        if (!r.ok) throw new Error('Failed to fetch');
        return r.json() as Promise<T>;
      })
      .then((d) => setState({ data: d, loading: false }))
      .catch(() => setState({ data: null, loading: false }));
  }, [id, endpoint]);

  const setData = useCallback(
    (d: T | null) => setState((prev) => ({ ...prev, data: d })),
    [],
  );

  return { data: state.data, loading: state.loading, setData };
}
