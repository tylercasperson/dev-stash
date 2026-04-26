import { prisma } from '@/lib/prisma';
import { EditorPreferences, DEFAULT_EDITOR_PREFERENCES } from '@/types/editor-preferences';

export interface ProfileStats {
  totalItems: number;
  totalCollections: number;
  typeCounts: Array<{ name: string; icon: string; color: string; count: number }>;
}

export interface ProfileUser {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  createdAt: Date;
  hasPassword: boolean;
}

export async function getEditorPreferences(userId: string): Promise<EditorPreferences> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { editorPreferences: true },
  });
  if (!user?.editorPreferences) return DEFAULT_EDITOR_PREFERENCES;
  return { ...DEFAULT_EDITOR_PREFERENCES, ...(user.editorPreferences as Partial<EditorPreferences>) };
}

export async function getProfileData(userId: string): Promise<{ user: ProfileUser; stats: ProfileStats }> {
  const [user, totalItems, totalCollections, itemTypes] = await Promise.all([
    prisma.user.findUniqueOrThrow({
      where: { id: userId },
      select: { id: true, name: true, email: true, image: true, createdAt: true, password: true },
    }),
    prisma.item.count({ where: { userId } }),
    prisma.collection.count({ where: { userId } }),
    prisma.itemType.findMany({
      where: { isSystem: true },
      select: {
        name: true,
        icon: true,
        color: true,
        _count: { select: { items: { where: { userId } } } },
      },
    }),
  ]);

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      createdAt: user.createdAt,
      hasPassword: !!user.password,
    },
    stats: {
      totalItems,
      totalCollections,
      typeCounts: itemTypes.map((t) => ({
        name: t.name,
        icon: t.icon,
        color: t.color,
        count: t._count.items,
      })),
    },
  };
}
