import Image from 'next/image';
import { cn } from '@/lib/utils';

interface UserAvatarProps {
  name?: string | null;
  image?: string | null;
  className?: string;
}

function getInitials(name?: string | null): string {
  if (!name) return '?';
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join('');
}

export default function UserAvatar({ name, image, className }: UserAvatarProps) {
  const baseClass = cn(
    'flex h-8 w-8 shrink-0 items-center justify-center rounded-full overflow-hidden',
    className,
  );

  if (image) {
    return (
      <div className={baseClass}>
        <Image src={image} alt={name ?? 'User avatar'} width={32} height={32} className="h-full w-full object-cover" />
      </div>
    );
  }

  return (
    <div className={cn(baseClass, 'bg-sidebar-primary text-sidebar-primary-foreground text-xs font-semibold')}>
      {getInitials(name)}
    </div>
  );
}
