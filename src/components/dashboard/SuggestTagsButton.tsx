'use client';

import { useState, useTransition } from 'react';
import { Sparkles, Check, X } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { generateAutoTags } from '@/actions/ai';

interface SuggestTagsButtonProps {
  title: string;
  content: string | null;
  existingTags: string[];
  onAccept: (tags: string[]) => void;
  isPro: boolean;
}

export default function SuggestTagsButton({
  title,
  content,
  existingTags,
  onAccept,
  isPro,
}: SuggestTagsButtonProps) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();

  if (!isPro) return null;

  function handleSuggest() {
    setSuggestions([]);
    startTransition(async () => {
      try {
        const result = await generateAutoTags(title, content);
        if (!result.success) {
          toast.error(result.error);
          return;
        }
        const existing = new Set(existingTags.map((t) => t.toLowerCase().trim()));
        const novel = result.data.filter((t) => !existing.has(t));
        if (novel.length === 0) {
          toast.info('No new tag suggestions — all suggestions already applied.');
          return;
        }
        setSuggestions(novel);
      } catch {
        toast.error('Could not reach the AI service. Please try again.');
      }
    });
  }

  function acceptTag(tag: string) {
    onAccept([tag]);
    setSuggestions((prev) => prev.filter((t) => t !== tag));
  }

  function rejectTag(tag: string) {
    setSuggestions((prev) => prev.filter((t) => t !== tag));
  }

  return (
    <div className="space-y-2">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="h-7 gap-1.5 text-xs text-muted-foreground hover:text-foreground px-2"
        onClick={handleSuggest}
        disabled={isPending || !title.trim()}
      >
        <Sparkles className="h-3.5 w-3.5" />
        {isPending ? 'Suggesting…' : 'Suggest Tags'}
      </Button>

      {suggestions.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {suggestions.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 rounded-full border border-border bg-muted/50 px-2 py-0.5 text-xs text-foreground"
            >
              {tag}
              <button
                type="button"
                onClick={() => acceptTag(tag)}
                className="rounded-full p-0.5 hover:bg-green-500/20 hover:text-green-500 transition-colors"
                aria-label={`Accept tag ${tag}`}
              >
                <Check className="h-3 w-3" />
              </button>
              <button
                type="button"
                onClick={() => rejectTag(tag)}
                className="rounded-full p-0.5 hover:bg-destructive/20 hover:text-destructive transition-colors"
                aria-label={`Reject tag ${tag}`}
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
