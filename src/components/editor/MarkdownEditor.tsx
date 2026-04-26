'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownEditorProps {
  value: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  height?: string;
}

type Tab = 'write' | 'preview';

export default function MarkdownEditor({ value, onChange, readOnly = false, height = '400px' }: MarkdownEditorProps) {
  const [tab, setTab] = useState<Tab>(readOnly ? 'preview' : 'write');
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="rounded-md overflow-hidden border border-border">
      {/* Header — matches CodeEditor macOS style */}
      <div className="flex items-center gap-2 px-3 py-2 bg-[#1e1e1e] border-b border-[#3a3a3a]">
        <span className="h-3 w-3 rounded-full bg-[#ff5f56]" />
        <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
        <span className="h-3 w-3 rounded-full bg-[#28c840]" />

        {!readOnly && (
          <div className="ml-2 flex items-center gap-1">
            <TabButton active={tab === 'write'} onClick={() => setTab('write')}>
              Write
            </TabButton>
            <TabButton active={tab === 'preview'} onClick={() => setTab('preview')}>
              Preview
            </TabButton>
          </div>
        )}

        <button
          onClick={handleCopy}
          className="ml-auto flex items-center gap-1 text-xs text-[#6b7280] hover:text-[#d4d4d4] transition-colors"
          aria-label="Copy content"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-green-400" /> : <Copy className="h-3.5 w-3.5" />}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>

      {/* Body */}
      <div className="bg-[#1e1e1e]">
        {tab === 'write' && !readOnly ? (
          <textarea
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            placeholder="Write markdown..."
            className="slim-scrollbar w-full bg-transparent text-[#d4d4d4] text-sm font-mono px-4 py-3 resize-none focus:outline-none leading-relaxed overflow-y-auto"
            style={{ height, maxHeight: '500px' }}
          />
        ) : (
          <div
            className="slim-scrollbar prose prose-invert prose-sm max-w-none px-4 py-3 overflow-y-auto"
            style={{ height, maxHeight: '500px' }}
          >
            {value ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{value}</ReactMarkdown>
            ) : (
              <span className="not-prose text-[#6b7280] italic text-sm">Nothing to preview</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
        active
          ? 'bg-[#3a3a3a] text-[#d4d4d4]'
          : 'text-[#6b7280] hover:text-[#d4d4d4]'
      }`}
    >
      {children}
    </button>
  );
}
