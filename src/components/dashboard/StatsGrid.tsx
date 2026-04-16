import { Layers, FolderOpen, Star, Heart } from 'lucide-react';

interface StatsGridProps {
  totalItems: number;
  totalCollections: number;
  favoriteItems: number;
  favoriteCollections: number;
}

export default function StatsGrid({
  totalItems,
  totalCollections,
  favoriteItems,
  favoriteCollections,
}: StatsGridProps) {
  const stats = [
    {
      label: 'Total Items',
      value: totalItems,
      icon: <Layers className="h-5 w-5 text-blue-500" />,
    },
    {
      label: 'Collections',
      value: totalCollections,
      icon: <FolderOpen className="h-5 w-5 text-purple-500" />,
    },
    {
      label: 'Favorite Items',
      value: favoriteItems,
      icon: <Star className="h-5 w-5 text-yellow-500" />,
    },
    {
      label: 'Favorite Collections',
      value: favoriteCollections,
      icon: <Heart className="h-5 w-5 text-pink-500" />,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-lg border border-border bg-card p-4"
        >
          <div className="flex items-center gap-2">
            {stat.icon}
            <p className="text-2xl font-semibold text-foreground tabular-nums">
              {stat.value}
            </p>
          </div>
          <p className="mt-1.5 text-xs text-muted-foreground">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}
