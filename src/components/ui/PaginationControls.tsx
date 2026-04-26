import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';

interface Props {
  currentPage: number;
  totalPages: number;
  buildHref: (page: number) => string;
}

function pageRange(current: number, total: number): Array<number | '...'> {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages: Array<number | '...'> = [1];

  if (current > 3) pages.push('...');

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  for (let i = start; i <= end; i++) pages.push(i);

  if (current < total - 2) pages.push('...');

  pages.push(total);
  return pages;
}

export default function PaginationControls({ currentPage, totalPages, buildHref }: Props) {
  if (totalPages <= 1) return null;

  const pages = pageRange(currentPage, totalPages);
  const isFirst = currentPage === 1;
  const isLast = currentPage === totalPages;

  const linkCls = buttonVariants({ variant: 'outline', size: 'icon' });
  const disabledCls = 'pointer-events-none opacity-40';

  return (
    <nav className="mt-8 flex items-center justify-center gap-1" aria-label="Pagination">
      {isFirst ? (
        <span className={cn(linkCls, disabledCls)} aria-disabled="true">
          <ChevronLeft className="size-4" />
        </span>
      ) : (
        <Link href={buildHref(currentPage - 1)} className={linkCls} aria-label="Previous page">
          <ChevronLeft className="size-4" />
        </Link>
      )}

      {pages.map((p, i) =>
        p === '...' ? (
          <span key={`ellipsis-${i}`} className="px-1 text-sm text-muted-foreground">
            …
          </span>
        ) : (
          <Link
            key={p}
            href={buildHref(p)}
            className={cn(
              buttonVariants({ variant: p === currentPage ? 'default' : 'outline', size: 'icon' }),
            )}
            aria-current={p === currentPage ? 'page' : undefined}
          >
            {p}
          </Link>
        ),
      )}

      {isLast ? (
        <span className={cn(linkCls, disabledCls)} aria-disabled="true">
          <ChevronRight className="size-4" />
        </span>
      ) : (
        <Link href={buildHref(currentPage + 1)} className={linkCls} aria-label="Next page">
          <ChevronRight className="size-4" />
        </Link>
      )}
    </nav>
  );
}
