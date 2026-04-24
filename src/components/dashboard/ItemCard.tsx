'use client';

import ItemCardRow from './ItemCardRow';
import ItemCardGrid from './ItemCardGrid';
import ImageThumbnailCard from './ImageThumbnailCard';

export interface ItemCardProps {
  id: string;
  title: string;
  description: string | null | undefined;
  contentType: 'TEXT' | 'FILE' | 'URL';
  content: string | null | undefined;
  fileUrl: string | null | undefined;
  isFavorite: boolean;
  isPinned: boolean;
  typeName: string;
  typeIcon: string;
  typeColor: string;
  tags: string[];
  updatedAt: string;
  layout?: 'card' | 'row';
  onSelect?: (id: string) => void;
}

export default function ItemCard(props: ItemCardProps) {
  if (props.typeName === 'image') {
    return <ImageThumbnailCard {...props} />;
  }
  if (props.layout === 'row') {
    return <ItemCardRow {...props} />;
  }
  return <ItemCardGrid {...props} />;
}
