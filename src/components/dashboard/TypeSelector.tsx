import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { ICON_MAP } from '@/lib/icon-map';

export const ITEM_TYPES = [
  { name: 'snippet', label: 'Snippet', icon: 'Code', color: '#3b82f6' },
  { name: 'prompt', label: 'Prompt', icon: 'Sparkles', color: '#8b5cf6' },
  { name: 'command', label: 'Command', icon: 'Terminal', color: '#f97316' },
  { name: 'note', label: 'Note', icon: 'StickyNote', color: '#fde047' },
  { name: 'link', label: 'Link', icon: 'Link', color: '#10b981' },
  { name: 'file', label: 'File', icon: 'File', color: '#6b7280' },
  { name: 'image', label: 'Image', icon: 'Image', color: '#ec4899' },
] as const;

export type ItemTypeName = (typeof ITEM_TYPES)[number]['name'];

interface TypeSelectorProps {
  value: ItemTypeName;
  onChange: (value: ItemTypeName) => void;
}

export default function TypeSelector({ value, onChange }: TypeSelectorProps) {
  return (
    <div className="space-y-1.5">
      <Label>Type</Label>
      <Select value={value} onValueChange={(v) => onChange(v as ItemTypeName)}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {ITEM_TYPES.map((t) => {
            const Icon = ICON_MAP[t.icon];
            return (
              <SelectItem key={t.name} value={t.name}>
                <span className="flex items-center gap-2">
                  <Icon className="h-4 w-4" style={{ color: t.color }} />
                  {t.label}
                </span>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
}
