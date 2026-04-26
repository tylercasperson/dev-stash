'use client';

import { createContext, useContext, useState, useCallback, useRef } from 'react';
import { toast } from 'sonner';
import { EditorPreferences, DEFAULT_EDITOR_PREFERENCES } from '@/types/editor-preferences';
import { updateEditorPreferences } from '@/actions/settings';

interface EditorPreferencesContextValue {
  preferences: EditorPreferences;
  updatePreference: <K extends keyof EditorPreferences>(key: K, value: EditorPreferences[K]) => void;
}

const EditorPreferencesContext = createContext<EditorPreferencesContextValue>({
  preferences: DEFAULT_EDITOR_PREFERENCES,
  updatePreference: () => {},
});

export function EditorPreferencesProvider({
  children,
  initialPreferences,
}: {
  children: React.ReactNode;
  initialPreferences: EditorPreferences;
}) {
  const [preferences, setPreferences] = useState<EditorPreferences>(initialPreferences);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const updatePreference = useCallback(
    <K extends keyof EditorPreferences>(key: K, value: EditorPreferences[K]) => {
      setPreferences((prev) => {
        const next = { ...prev, [key]: value };

        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(async () => {
          const result = await updateEditorPreferences(next);
          if (result.success) {
            toast.success('Editor preferences saved.');
          }
        }, 600);

        return next;
      });
    },
    []
  );

  return (
    <EditorPreferencesContext.Provider value={{ preferences, updatePreference }}>
      {children}
    </EditorPreferencesContext.Provider>
  );
}

export function useEditorPreferences() {
  return useContext(EditorPreferencesContext);
}
