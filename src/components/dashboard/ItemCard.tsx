'use client';

import ItemCardRow from './ItemCardRow';
import ItemCardGrid from './ItemCardGrid';
import ImageThumbnailCard from './ImageThumbnailCard';
import FileListRow from './FileListRow';

export interface ItemCardProps {
  id: string;
  title: string;
  description: string | null | undefined;
  contentType: 'TEXT' | 'FILE' | 'URL';
  content: string | null | undefined;
  url: string | null | undefined;
  fileUrl: string | null | undefined;
  fileName: string | null | undefined;
  fileSize: number | null | undefined;
  isFavorite: boolean;
  isPinned: boolean;
  typeName: string;
  typeIcon: string;
  typeColor: string;
  tags: string[];
  updatedAt: string;
  layout?: 'card' | 'row' | 'list';
  onSelect?: (id: string) => void;
}

export default function ItemCard(props: ItemCardProps) {
  if (props.layout === 'list') {
    return <FileListRow {...props} />;
  }
  if (props.layout === 'row') {
    return <ItemCardRow {...props} />;
  }
  if (props.typeName === 'image') {
    return <ImageThumbnailCard {...props} />;
  }
  return <ItemCardGrid {...props} />;
}
