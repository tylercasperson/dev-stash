'use client';

import { useState, useTransition } from 'react';
import { Copy, Check, Sparkles, Crown, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { toast } from 'sonner';
import { optimizePrompt } from '@/actions/ai';

interface MarkdownEditorProps {
  value: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  height?: string;
  isPro?: boolean;
  onUseOptimized?: (content: string) => void;
}

type WriteTab = 'write' | 'preview';
type OptimizeTab = 'original' | 'optimized';

export default function MarkdownEditor({
  value,
  onChange,
  readOnly = false,
  height = '400px',
  isPro,
  onUseOptimized,
}: MarkdownEditorProps) {
  const [writeTab, setWriteTab] = useState<WriteTab>(readOnly ? 'preview' : 'write');
  const [copied, setCopied] = useState(false);
  const [optimized, setOptimized] = useState<string | null>(null);
  const [optimizeTab, setOptimizeTab] = useState<OptimizeTab>('original');
  const [isPending, startTransition] = useTransition();

  const showOptimizeFeature = isPro !== undefined && readOnly;
  const displayValue = optimizeTab === 'optimized' && optimized ? optimized : value;

  async function handleCopy() {
    await navigator.clipboard.writeText(displayValue);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  function handleOptimize() {
    startTransition(async () => {
      try {
        const result = await optimizePrompt(value);
        if (!result.success) {
          toast.error(result.error);
          return;
        }
        setOptimized(result.data);
        setOptimizeTab('optimized');
      } catch {
        toast.error('Could not reach the AI service. Please try again.');
      }
    });
  }

  function handleDiscard() {
    setOptimized(null);
    setOptimizeTab('original');
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
            <TabButton active={writeTab === 'write'} onClick={() => setWriteTab('write')}>
              Write
            </TabButton>
            <TabButton active={writeTab === 'preview'} onClick={() => setWriteTab('preview')}>
              Preview
            </TabButton>
          </div>
        )}

        <div className="ml-auto flex items-center gap-3">
          {/* Original/Optimized tabs — only visible after optimization */}
          {showOptimizeFeature && optimized && (
            <div className="flex items-center gap-0.5">
              <TabButton active={optimizeTab === 'original'} onClick={() => setOptimizeTab('original')}>
                Original
              </TabButton>
              <TabButton active={optimizeTab === 'optimized'} onClick={() => setOptimizeTab('optimized')}>
                Optimized
              </TabButton>
            </div>
          )}

          {/* Use this / Discard — only when viewing optimized tab */}
          {showOptimizeFeature && optimized && optimizeTab === 'optimized' && (
            <>
              <button
                onClick={() => onUseOptimized?.(optimized)}
                className="text-xs text-green-400 hover:text-green-300 transition-colors"
              >
                Use this
              </button>
              <button
                onClick={handleDiscard}
                className="text-xs text-[#6b7280] hover:text-[#d4d4d4] transition-colors"
              >
                Discard
              </button>
            </>
          )}

          {/* Discard only when on Original tab with optimized available */}
          {showOptimizeFeature && optimized && optimizeTab === 'original' && (
            <button
              onClick={handleDiscard}
              className="text-xs text-[#6b7280] hover:text-[#d4d4d4] transition-colors"
            >
              Discard
            </button>
          )}

          {/* Optimize button */}
          {showOptimizeFeature && (
            isPro ? (
              <button
                onClick={handleOptimize}
                disabled={isPending}
                className="flex items-center gap-1 text-xs text-[#6b7280] hover:text-[#d4d4d4] transition-colors disabled:opacity-50"
                aria-label="Optimize prompt with AI"
              >
                {isPending
                  ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  : <Sparkles className="h-3.5 w-3.5" />
                }
                <span>{isPending ? 'Optimizing…' : 'Optimize'}</span>
              </button>
            ) : (
              <button
                className="flex items-center gap-1 text-xs text-[#6b7280] opacity-50 cursor-default"
                title="AI features require Pro subscription"
                aria-label="AI prompt optimization requires Pro"
                tabIndex={-1}
              >
                <Crown className="h-3.5 w-3.5" />
                <span>Optimize</span>
              </button>
            )
          )}

          <button
            onClick={handleCopy}
            className="flex items-center gap-1 text-xs text-[#6b7280] hover:text-[#d4d4d4] transition-colors"
            aria-label="Copy content"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-green-400" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="bg-[#1e1e1e]">
        {writeTab === 'write' && !readOnly ? (
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
            {displayValue ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{displayValue}</ReactMarkdown>
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
