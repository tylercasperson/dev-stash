'use client';

import { useTransition } from 'react';
import { Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { generateDescription } from '@/actions/ai';

interface GenerateDescriptionButtonProps {
  title: string;
  typeName: string;
  content?: string | null;
  url?: string | null;
  fileName?: string | null;
  onGenerate: (description: string) => void;
  isPro: boolean;
}

export default function GenerateDescriptionButton({
  title,
  typeName,
  content,
  url,
  fileName,
  onGenerate,
  isPro,
}: GenerateDescriptionButtonProps) {
  const [isPending, startTransition] = useTransition();

  if (!isPro) return null;

  function handleGenerate() {
    startTransition(async () => {
      try {
        const result = await generateDescription({ title, typeName, content, url, fileName });
        if (!result.success) {
          toast.error(result.error);
          return;
        }
        onGenerate(result.data);
      } catch {
        toast.error('Could not reach the AI service. Please try again.');
      }
    });
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className="h-6 gap-1 px-1.5 text-xs text-muted-foreground hover:text-foreground"
      onClick={handleGenerate}
      disabled={isPending || !title.trim()}
      aria-label="Generate description with AI"
    >
      <Sparkles className="h-3.5 w-3.5" />
      Describe
    </Button>
  );
}
