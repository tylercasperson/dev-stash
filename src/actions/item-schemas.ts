import { z } from 'zod';

export const VALID_ITEM_TYPES = ['snippet', 'prompt', 'command', 'note', 'link', 'file', 'image'] as const;

const tagsField = z
  .string()
  .transform((v) =>
    v
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean),
  )
  .or(z.array(z.string().trim()).transform((arr) => arr.filter(Boolean)));

const urlField = (allowEmpty = true) =>
  z
    .string()
    .trim()
    .nullable()
    .optional()
    .refine((v) => !v || v === '' || /^https?:\/\/.+/.test(v), { message: 'Must be a valid URL' })
    .transform((v) => (allowEmpty ? v || null : v ?? null));

const nullableString = z
  .string()
  .trim()
  .nullable()
  .optional()
  .transform((v) => v ?? null);

const nullableStringEmpty = z
  .string()
  .trim()
  .nullable()
  .optional()
  .transform((v) => v || null);

const collectionIdsField = z
  .array(z.string())
  .optional()
  .transform((v) => v ?? []);

export const UpdateItemSchema = z.object({
  title: z.string().trim().min(1, 'Title is required'),
  description: nullableString,
  content: z.string().nullable().optional().transform((v) => v ?? null),
  url: urlField(true),
  language: nullableStringEmpty,
  tags: tagsField,
  collectionIds: collectionIdsField,
});

export const CreateItemSchema = z.object({
  typeName: z.enum(VALID_ITEM_TYPES),
  title: z.string().trim().min(1, 'Title is required'),
  description: nullableString,
  content: z.string().nullable().optional().transform((v) => v ?? null),
  url: urlField(false),
  language: nullableStringEmpty,
  tags: tagsField,
  collectionIds: collectionIdsField,
  fileUrl: z.string().url().nullable().optional().transform((v) => v ?? null),
  fileName: nullableString,
  fileSize: z.number().nullable().optional().transform((v) => v ?? null),
});
