interface TagListProps {
  tags: string[];
  limit?: number;
  className?: string;
}

export default function TagList({ tags, limit = 3, className }: TagListProps) {
  if (tags.length === 0) return null;
  return (
    <div className={className ?? 'flex flex-wrap gap-1'}>
      {tags.slice(0, limit).map((tag) => (
        <span
          key={tag}
          className="rounded px-1.5 py-0.5 text-[10px] bg-muted text-muted-foreground"
        >
          {tag}
        </span>
      ))}
    </div>
  );
}
