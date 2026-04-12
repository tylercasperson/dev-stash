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
      icon: <Layers className="h-4 w-4 text-blue-500" />,
    },
    {
      label: 'Collections',
      value: totalCollections,
      icon: <FolderOpen className="h-4 w-4 text-purple-500" />,
    },
    {
      label: 'Favorite Items',
      value: favoriteItems,
      icon: <Star className="h-4 w-4 text-yellow-500" />,
    },
    {
      label: 'Favorite Collections',
      value: favoriteCollections,
      icon: <Heart className="h-4 w-4 text-pink-500" />,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-lg border border-border bg-card p-4"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">{stat.label}</span>
            {stat.icon}
          </div>
          <p className="mt-2 text-2xl font-semibold text-foreground tabular-nums">
            {stat.value}
          </p>
        </div>
      ))}
    </div>
  );
}
