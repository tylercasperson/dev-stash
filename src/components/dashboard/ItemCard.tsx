import ItemCardRow from './ItemCardRow';
import ItemCardGrid from './ItemCardGrid';

export interface ItemCardProps {
  title: string;
  description: string | null | undefined;
  contentType: 'TEXT' | 'FILE' | 'URL';
  content: string | null | undefined;
  isFavorite: boolean;
  isPinned: boolean;
  typeName: string;
  typeIcon: string;
  typeColor: string;
  tags: string[];
  updatedAt: string;
  layout?: 'card' | 'row';
}

export default function ItemCard(props: ItemCardProps) {
  if (props.layout === 'row') {
    return <ItemCardRow {...props} />;
  }
  return <ItemCardGrid {...props} />;
}
