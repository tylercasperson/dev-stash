'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownEditorProps {
  value: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
}

type Tab = 'write' | 'preview';

export default function MarkdownEditor({ value, onChange, readOnly = false }: MarkdownEditorProps) {
  const [tab, setTab] = useState<Tab>(readOnly ? 'preview' : 'write');
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="rounded-md overflow-hidden border border-border">
      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-2 bg-[#2d2d2d] border-b border-[#3a3a3a]">
        {!readOnly && (
          <div className="flex items-center gap-1">
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
            className="w-full bg-transparent text-[#d4d4d4] text-sm font-mono px-4 py-3 resize-none focus:outline-none leading-relaxed"
            style={{ minHeight: '120px', maxHeight: '400px' }}
          />
        ) : (
          <div
            className="markdown-preview px-4 py-3 text-sm overflow-y-auto"
            style={{ minHeight: '60px', maxHeight: '400px' }}
          >
            {value ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{value}</ReactMarkdown>
            ) : (
              <span className="text-[#6b7280] italic">Nothing to preview</span>
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
