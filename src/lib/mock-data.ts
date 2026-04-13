export const mockUser = {
  id: 'user_1',
  name: 'John Doe',
  email: 'demo@dev-stash.io',
  image: null,
  isPro: false,
};

export const mockItemTypes = [
  { id: 'type_snippet', name: 'snippet', icon: 'Code', color: '#3b82f6', isSystem: true },
  { id: 'type_prompt', name: 'prompt', icon: 'Sparkles', color: '#8b5cf6', isSystem: true },
  { id: 'type_command', name: 'command', icon: 'Terminal', color: '#f97316', isSystem: true },
  { id: 'type_note', name: 'note', icon: 'StickyNote', color: '#fde047', isSystem: true },
  { id: 'type_file', name: 'file', icon: 'File', color: '#6b7280', isSystem: true },
  { id: 'type_image', name: 'image', icon: 'Image', color: '#ec4899', isSystem: true },
  { id: 'type_link', name: 'link', icon: 'Link', color: '#10b981', isSystem: true },
];

export const mockCollections = [
  {
    id: 'col_1',
    name: 'React Patterns',
    description: 'Common React patterns and hooks',
    isFavorite: true,
    itemCount: 12,
    dominantTypeId: 'type_snippet',
  },
  {
    id: 'col_2',
    name: 'Python Snippets',
    description: 'Useful Python code snippets',
    isFavorite: false,
    itemCount: 8,
    dominantTypeId: 'type_snippet',
  },
  {
    id: 'col_3',
    name: 'Context Files',
    description: 'AI context files for projects',
    isFavorite: true,
    itemCount: 5,
    dominantTypeId: 'type_file',
  },
  {
    id: 'col_4',
    name: 'Interview Prep',
    description: 'Technical interview preparation',
    isFavorite: false,
    itemCount: 24,
    dominantTypeId: 'type_snippet',
  },
  {
    id: 'col_5',
    name: 'Git Commands',
    description: 'Frequently used git commands',
    isFavorite: true,
    itemCount: 15,
    dominantTypeId: 'type_command',
  },
  {
    id: 'col_6',
    name: 'AI Prompts',
    description: 'Curated AI prompts for coding',
    isFavorite: false,
    itemCount: 18,
    dominantTypeId: 'type_prompt',
  },
];

export const mockItems = [
  {
    id: 'item_1',
    title: 'useAuth Hook',
    contentType: 'TEXT' as const,
    content: `import { useSession } from 'next-auth/react';

export function useAuth() {
  const { data: session, status } = useSession();
  return {
    user: session?.user,
    isLoading: status === 'loading',
    isAuthenticated: status === 'authenticated',
  };
}`,
    language: 'typescript',
    description: 'Custom authentication hook for React applications',
    isFavorite: true,
    isPinned: true,
    typeId: 'type_snippet',
    tags: ['react', 'auth', 'hooks'],
    collectionIds: ['col_1'],
    createdAt: '2026-04-10',
    updatedAt: '2026-04-10',
  },
  {
    id: 'item_2',
    title: 'API Error Handling Pattern',
    contentType: 'TEXT' as const,
    content: `async function fetchWithRetry(url: string, retries = 3): Promise<Response> {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
      return res;
    } catch (err) {
      if (i === retries - 1) throw err;
      await new Promise(r => setTimeout(r, 2 ** i * 1000));
    }
  }
  throw new Error('Max retries exceeded');
}`,
    language: 'typescript',
    description: 'Fetch wrapper with exponential backoff retry logic',
    isFavorite: false,
    isPinned: true,
    typeId: 'type_snippet',
    tags: ['api', 'error-handling', 'typescript'],
    collectionIds: ['col_1', 'col_4'],
    createdAt: '2026-04-10',
    updatedAt: '2026-04-10',
  },
  {
    id: 'item_3',
    title: 'Git Undo Last Commit',
    contentType: 'TEXT' as const,
    content: 'git reset --soft HEAD~1',
    language: 'bash',
    description: 'Undo the last commit but keep changes staged',
    isFavorite: false,
    isPinned: false,
    typeId: 'type_command',
    tags: ['git', 'undo'],
    collectionIds: ['col_5'],
    createdAt: '2026-04-09',
    updatedAt: '2026-04-09',
  },
  {
    id: 'item_4',
    title: 'Explain This Code Prompt',
    contentType: 'TEXT' as const,
    content: 'Explain the following code in plain English. Focus on what it does, why it might be written this way, and any potential edge cases or improvements:\n\n```\n{{code}}\n```',
    language: null,
    description: 'General-purpose code explanation prompt',
    isFavorite: true,
    isPinned: false,
    typeId: 'type_prompt',
    tags: ['ai', 'code-review'],
    collectionIds: ['col_6'],
    createdAt: '2026-04-08',
    updatedAt: '2026-04-08',
  },
  {
    id: 'item_5',
    title: 'Python List Comprehension',
    contentType: 'TEXT' as const,
    content: '# Filter and transform in one line\nresult = [x * 2 for x in range(10) if x % 2 == 0]\n# Output: [0, 4, 8, 12, 16]',
    language: 'python',
    description: 'Concise list comprehension with filter',
    isFavorite: false,
    isPinned: false,
    typeId: 'type_snippet',
    tags: ['python', 'list', 'comprehension'],
    collectionIds: ['col_2'],
    createdAt: '2026-04-07',
    updatedAt: '2026-04-07',
  },
  {
    id: 'item_6',
    title: 'MDN CSS Grid Guide',
    contentType: 'URL' as const,
    content: null,
    url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout',
    language: null,
    description: 'Comprehensive guide to CSS Grid Layout',
    isFavorite: false,
    isPinned: false,
    typeId: 'type_link',
    tags: ['css', 'grid', 'layout'],
    collectionIds: ['col_4'],
    createdAt: '2026-04-06',
    updatedAt: '2026-04-06',
  },
];

// Counts by type for sidebar
export const mockTypeCounts = {
  snippet: 24,
  prompt: 18,
  command: 15,
  note: 12,
  file: 5,
  image: 3,
  link: 8,
};
