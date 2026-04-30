'use client';

import { useState, useEffect } from 'react';
import { Copy, Check } from 'lucide-react';
import MonacoEditor, { useMonaco } from '@monaco-editor/react';
import { useEditorPreferences } from '@/context/EditorPreferencesContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const LANGUAGES = [
  { value: 'plaintext',   label: 'Plain Text' },
  { value: 'typescript',  label: 'TypeScript' },
  { value: 'javascript',  label: 'JavaScript' },
  { value: 'python',      label: 'Python' },
  { value: 'bash',        label: 'Bash' },
  { value: 'sql',         label: 'SQL' },
  { value: 'json',        label: 'JSON' },
  { value: 'yaml',        label: 'YAML' },
  { value: 'html',        label: 'HTML' },
  { value: 'css',         label: 'CSS' },
  { value: 'markdown',    label: 'Markdown' },
  { value: 'go',          label: 'Go' },
  { value: 'rust',        label: 'Rust' },
  { value: 'java',        label: 'Java' },
  { value: 'cpp',         label: 'C++' },
  { value: 'csharp',      label: 'C#' },
  { value: 'php',         label: 'PHP' },
  { value: 'ruby',        label: 'Ruby' },
  { value: 'dockerfile',  label: 'Dockerfile' },
  { value: 'xml',         label: 'XML' },
  { value: 'toml',        label: 'TOML' },
];

interface CodeEditorProps {
  value: string;
  onChange?: (value: string) => void;
  language?: string;
  onLanguageChange?: (language: string) => void;
  readOnly?: boolean;
}

export default function CodeEditor({ value, onChange, language = 'plaintext', onLanguageChange, readOnly = false }: CodeEditorProps) {
  const [copied, setCopied] = useState(false);
  const { preferences } = useEditorPreferences();
  const monaco = useMonaco();

  useEffect(() => {
    function suppressMonacoCancellation(event: PromiseRejectionEvent) {
      const r = event.reason;
      if (r && typeof r === 'object' && 'type' in r && r.type === 'cancelation') {
        event.preventDefault();
      }
    }
    window.addEventListener('unhandledrejection', suppressMonacoCancellation);
    return () => window.removeEventListener('unhandledrejection', suppressMonacoCancellation);
  }, []);

  useEffect(() => {
    if (!monaco) return;

    monaco.editor.defineTheme('monokai', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '75715e', fontStyle: 'italic' },
        { token: 'keyword', foreground: 'f92672' },
        { token: 'string', foreground: 'e6db74' },
        { token: 'number', foreground: 'ae81ff' },
        { token: 'type', foreground: '66d9e8' },
        { token: 'function', foreground: 'a6e22e' },
        { token: 'variable', foreground: 'f8f8f2' },
      ],
      colors: {
        'editor.background': '#272822',
        'editor.foreground': '#f8f8f2',
        'editor.lineHighlightBackground': '#3e3d32',
        'editor.selectionBackground': '#49483e',
        'editorCursor.foreground': '#f8f8f0',
        'editorLineNumber.foreground': '#75715e',
      },
    });

    monaco.editor.defineTheme('github-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '8b949e', fontStyle: 'italic' },
        { token: 'keyword', foreground: 'ff7b72' },
        { token: 'string', foreground: 'a5d6ff' },
        { token: 'number', foreground: '79c0ff' },
        { token: 'type', foreground: 'ffa657' },
        { token: 'function', foreground: 'd2a8ff' },
        { token: 'variable', foreground: 'c9d1d9' },
      ],
      colors: {
        'editor.background': '#0d1117',
        'editor.foreground': '#c9d1d9',
        'editor.lineHighlightBackground': '#161b22',
        'editor.selectionBackground': '#3b5070',
        'editorCursor.foreground': '#c9d1d9',
        'editorLineNumber.foreground': '#6e7681',
      },
    });
  }, [monaco]);

  async function handleCopy() {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="rounded-md overflow-hidden border border-border">
      {/* macOS-style header */}
      <div className="flex items-center gap-2 px-3 py-2 bg-[#1e1e1e] border-b border-[#3a3a3a]">
        <span className="h-3 w-3 rounded-full bg-[#ff5f56]" />
        <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
        <span className="h-3 w-3 rounded-full bg-[#28c840]" />

        {onLanguageChange ? (
          <Select value={language} onValueChange={(v) => onLanguageChange?.(v ?? 'plaintext')}>
            <SelectTrigger
              size="sm"
              className="ml-1 h-6 border-[#3a3a3a] bg-transparent text-[#6b7280] hover:text-[#d4d4d4] hover:bg-[#2a2a2a] text-xs font-mono px-2 min-w-0 w-auto"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent align="start">
              {LANGUAGES.map((l) => (
                <SelectItem key={l.value} value={l.value}>
                  {l.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          language && language !== 'plaintext' && (
            <span className="ml-2 text-xs text-[#6b7280] font-mono">{language}</span>
          )
        )}

        <button
          onClick={handleCopy}
          className="ml-auto flex items-center gap-1 text-xs text-[#6b7280] hover:text-[#d4d4d4] transition-colors"
          aria-label="Copy code"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-green-400" /> : <Copy className="h-3.5 w-3.5" />}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>

      {/* Monaco editor */}
      <MonacoEditor
        value={value}
        language={language === 'plaintext' ? undefined : language}
        theme={preferences.theme}
        options={{
          readOnly,
          minimap: { enabled: preferences.minimap },
          scrollBeyondLastLine: false,
          fontSize: preferences.fontSize,
          tabSize: preferences.tabSize,
          lineNumbers: 'off',
          folding: false,
          wordWrap: preferences.wordWrap ? 'on' : 'off',
          renderLineHighlight: readOnly ? 'none' : 'line',
          scrollbar: {
            vertical: 'auto',
            horizontal: 'hidden',
            verticalScrollbarSize: 6,
            useShadows: false,
          },
          overviewRulerLanes: 0,
          hideCursorInOverviewRuler: true,
          overviewRulerBorder: false,
          padding: { top: 12, bottom: 12 },
        }}
        onChange={(val) => onChange?.(val ?? '')}
        onMount={(editor) => {
          function updateHeight() {
            const contentHeight = Math.min(editor.getContentHeight(), 400);
            const container = editor.getContainerDomNode();
            if (container) {
              container.style.height = `${contentHeight}px`;
            }
            editor.layout();
          }
          editor.onDidContentSizeChange(updateHeight);
          updateHeight();
        }}
      />
    </div>
  );
}
