# Item Types

DevStash has 7 system item types. All are immutable (`isSystem: true`, `userId: null`).

---

## Type Reference

| Type    | Icon (Lucide) | Hex Color | Content Class | Pro Only |
|---------|---------------|-----------|---------------|----------|
| snippet | `Code`        | `#3b82f6` | TEXT          | No       |
| prompt  | `Sparkles`    | `#8b5cf6` | TEXT          | No       |
| command | `Terminal`    | `#f97316` | TEXT          | No       |
| note    | `StickyNote`  | `#fde047` | TEXT          | No       |
| link    | `Link`        | `#10b981` | URL           | No       |
| file    | `File`        | `#6b7280` | FILE          | Yes      |
| image   | `Image`       | `#ec4899` | FILE          | Yes      |

---

## Per-Type Details

### snippet
- **Purpose:** Reusable code blocks, utility functions, patterns
- **Key fields:** `content` (Text), `language` (syntax highlighting)
- **Typical tags:** language name, framework, pattern category

### prompt
- **Purpose:** AI prompts — system messages, task templates, instructional templates
- **Key fields:** `content` (Text), `language` null (plain text)
- **Typical tags:** `ai`, workflow category

### command
- **Purpose:** Shell commands, one-liners, CLI recipes
- **Key fields:** `content` (Text), `language: 'bash'`
- **Typical tags:** tool name, task category

### note
- **Purpose:** Free-form markdown notes, explanations, documentation
- **Key fields:** `content` (Text), `language` null
- **Typical tags:** topic, project

### link
- **Purpose:** External URLs — docs, references, tools
- **Key fields:** `url` (URL), `content` null, `language` null
- **Typical tags:** tool/framework name, `docs`

### file
- **Purpose:** Uploaded files — context files, configs, exports (Pro only)
- **Key fields:** `fileUrl`, `fileName`, `fileSize`
- **Typical tags:** file type, project

### image
- **Purpose:** Uploaded images — screenshots, diagrams, assets (Pro only)
- **Key fields:** `fileUrl`, `fileName`, `fileSize`
- **Typical tags:** subject, project

---

## Content Classification

Items map to one of three `ContentType` enum values:

| ContentType | Types                      | Active fields              |
|-------------|----------------------------|----------------------------|
| `TEXT`      | snippet, prompt, command, note | `content`, `language`  |
| `URL`       | link                       | `url`                      |
| `FILE`      | file, image                | `fileUrl`, `fileName`, `fileSize` |

---

## Shared Properties

All item types share these fields regardless of content class:

- `id`, `title`, `description` — identity and metadata
- `userId`, `typeId` — ownership and type reference
- `isFavorite`, `isPinned` — user organization flags
- `collections` (many-to-many via `ItemCollection`)
- `tags` (many-to-many via `ItemTag`)
- `createdAt`, `updatedAt` — timestamps

---

## Display Differences

- **Card border color** is driven by the type's hex color
- **Collection card background** uses the dominant type color among its items
- **Syntax highlighting** applies only to TEXT types when `language` is set
- **File/image types** show file size and a download/preview affordance instead of text content
- **Link type** shows the URL with an external-link affordance instead of content
- FILE and IMAGE items are gated by `isPro` — the sidebar marks them with a PRO badge
