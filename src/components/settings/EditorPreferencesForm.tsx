'use client';

import { useEditorPreferences } from '@/context/EditorPreferencesContext';
import type { EditorPreferences } from '@/types/editor-preferences';

const FONT_SIZES = [10, 12, 13, 14, 16, 18, 20];
const TAB_SIZES = [2, 4];
const THEMES: { value: EditorPreferences['theme']; label: string }[] = [
  { value: 'vs-dark', label: 'VS Dark' },
  { value: 'monokai', label: 'Monokai' },
  { value: 'github-dark', label: 'GitHub Dark' },
];

const selectClass =
  'rounded-md border border-border bg-background px-3 py-1.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring';

export default function EditorPreferencesForm() {
  const { preferences, updatePreference } = useEditorPreferences();

  return (
    <div className="space-y-4">
      {/* Font size */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-foreground">Font size</p>
          <p className="text-xs text-muted-foreground">Editor text size in pixels</p>
        </div>
        <select
          value={preferences.fontSize}
          onChange={(e) => updatePreference('fontSize', Number(e.target.value))}
          className={selectClass}
        >
          {FONT_SIZES.map((s) => (
            <option key={s} value={s}>{s}px</option>
          ))}
        </select>
      </div>

      {/* Tab size */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-foreground">Tab size</p>
          <p className="text-xs text-muted-foreground">Number of spaces per indentation level</p>
        </div>
        <select
          value={preferences.tabSize}
          onChange={(e) => updatePreference('tabSize', Number(e.target.value))}
          className={selectClass}
        >
          {TAB_SIZES.map((s) => (
            <option key={s} value={s}>{s} spaces</option>
          ))}
        </select>
      </div>

      {/* Theme */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-foreground">Theme</p>
          <p className="text-xs text-muted-foreground">Color theme for the code editor</p>
        </div>
        <select
          value={preferences.theme}
          onChange={(e) => updatePreference('theme', e.target.value as EditorPreferences['theme'])}
          className={selectClass}
        >
          {THEMES.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </div>

      {/* Word wrap */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-foreground">Word wrap</p>
          <p className="text-xs text-muted-foreground">Wrap long lines in the editor</p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={preferences.wordWrap}
          onClick={() => updatePreference('wordWrap', !preferences.wordWrap)}
          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
            preferences.wordWrap ? 'bg-primary' : 'bg-muted'
          }`}
        >
          <span
            className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-lg transition-transform ${
              preferences.wordWrap ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      {/* Minimap */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-foreground">Minimap</p>
          <p className="text-xs text-muted-foreground">Show code overview minimap on the right</p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={preferences.minimap}
          onClick={() => updatePreference('minimap', !preferences.minimap)}
          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
            preferences.minimap ? 'bg-primary' : 'bg-muted'
          }`}
        >
          <span
            className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-lg transition-transform ${
              preferences.minimap ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>
    </div>
  );
}
