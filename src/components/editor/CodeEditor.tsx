'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import MonacoEditor from '@monaco-editor/react';

interface CodeEditorProps {
  value: string;
  onChange?: (value: string) => void;
  language?: string;
  readOnly?: boolean;
}

export default function CodeEditor({ value, onChange, language = 'plaintext', readOnly = false }: CodeEditorProps) {
  const [copied, setCopied] = useState(false);

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
        {language && language !== 'plaintext' && (
          <span className="ml-2 text-xs text-[#6b7280] font-mono">{language}</span>
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
        theme="vs-dark"
        options={{
          readOnly,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          fontSize: 13,
          lineNumbers: 'off',
          folding: false,
          wordWrap: 'on',
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
          // Auto-height up to max 400px
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
