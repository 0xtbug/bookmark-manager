// Mock data for development and testing

import type { Bookmark, Tag } from "./types"

export const mockBookmarks: Bookmark[] = [
  {
    id: 72,
    url: "https://www.kibo-ui.com/",
    title: "Kibo UI",
    description:
      "Kibo UI is a custom registry of composable, accessible and open source components designed for use with shadcn/ui.",
    notes: "",
    web_archive_snapshot_url: "https://web.archive.org/web/20250817160511/https://www.kibo-ui.com/",
    favicon_url: null,
    preview_image_url: null,
    is_archived: false,
    unread: false,
    shared: false,
    tag_names: ["Component", "UI"],
    date_added: "2025-08-17T16:05:11.830984Z",
    date_modified: "2025-08-17T16:05:11.830989Z",
    website_title: null,
    website_description: null,
  },
  {
    id: 73,
    url: "https://nextjs.org/docs",
    title: "Next.js Documentation",
    description: "The official Next.js documentation with guides, API reference, and examples.",
    notes: "Great resource for learning Next.js features",
    web_archive_snapshot_url: null,
    favicon_url: "https://nextjs.org/favicon.ico",
    preview_image_url: null,
    is_archived: false,
    unread: true,
    shared: true,
    tag_names: ["Documentation", "React", "Next.js"],
    date_added: "2025-08-16T14:30:00.000000Z",
    date_modified: "2025-08-16T14:30:00.000000Z",
    website_title: "Next.js by Vercel - The React Framework",
    website_description:
      "Used by some of the world's largest companies, Next.js enables you to create full-stack Web applications by extending the latest React features",
  },
  {
    id: 74,
    url: "https://tailwindcss.com/",
    title: "Tailwind CSS",
    description:
      "A utility-first CSS framework packed with classes that can be composed to build any design, directly in your markup.",
    notes: "My favorite CSS framework",
    web_archive_snapshot_url: "https://web.archive.org/web/20250815120000/https://tailwindcss.com/",
    favicon_url: "https://tailwindcss.com/favicon.ico",
    preview_image_url: null,
    is_archived: true,
    unread: false,
    shared: false,
    tag_names: ["CSS", "Framework", "Styling"],
    date_added: "2025-08-15T10:15:30.000000Z",
    date_modified: "2025-08-15T10:15:30.000000Z",
    website_title: "Tailwind CSS - Rapidly build modern websites without ever leaving your HTML",
    website_description:
      "Tailwind CSS is a utility-first CSS framework for rapidly building modern websites without ever leaving your HTML.",
  },
  {
    id: 75,
    url: "https://react.dev/",
    title: "React",
    description: "The library for web and native user interfaces",
    notes: "",
    web_archive_snapshot_url: null,
    favicon_url: "https://react.dev/favicon.ico",
    preview_image_url: null,
    is_archived: false,
    unread: true,
    shared: true,
    tag_names: ["React", "JavaScript", "Library"],
    date_added: "2025-08-14T09:45:15.000000Z",
    date_modified: "2025-08-14T09:45:15.000000Z",
    website_title: "React",
    website_description: "The library for web and native user interfaces",
  },
  {
    id: 76,
    url: "https://ui.shadcn.com/",
    title: "shadcn/ui",
    description:
      "Beautifully designed components that you can copy and paste into your apps. Accessible. Customizable. Open Source.",
    notes: "Amazing component library",
    web_archive_snapshot_url: null,
    favicon_url: null,
    preview_image_url: null,
    is_archived: false,
    unread: false,
    shared: true,
    tag_names: ["Component", "UI", "React"],
    date_added: "2025-08-13T16:20:45.000000Z",
    date_modified: "2025-08-13T16:20:45.000000Z",
    website_title: "shadcn/ui",
    website_description: "Beautifully designed components that you can copy and paste into your apps.",
  },
]

// Generate more mock bookmarks for testing pagination
const additionalBookmarks: Bookmark[] = Array.from({ length: 25 }, (_, i) => ({
  id: 77 + i,
  url: `https://example${i + 1}.com`,
  title: `Example Site ${i + 1}`,
  description: `This is a sample bookmark description for testing purposes. Site ${i + 1} offers various features and content.`,
  notes: i % 3 === 0 ? `Personal note about site ${i + 1}` : "",
  web_archive_snapshot_url:
    i % 4 === 0 ? `https://web.archive.org/web/20250815000000/https://example${i + 1}.com` : null,
  favicon_url: i % 2 === 0 ? `https://example${i + 1}.com/favicon.ico` : null,
  preview_image_url: null,
  is_archived: i % 5 === 0,
  unread: i % 3 === 0,
  shared: i % 4 === 0,
  tag_names: [
    ...(i % 2 === 0 ? ["Web"] : []),
    ...(i % 3 === 0 ? ["Tool"] : []),
    ...(i % 4 === 0 ? ["Resource"] : []),
    ...(i % 5 === 0 ? ["Archive"] : []),
  ],
  date_added: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
  date_modified: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
  website_title: `Example ${i + 1} - Official Site`,
  website_description: `Official website for Example ${i + 1} with comprehensive information and resources.`,
}))

export const allMockBookmarks = [...mockBookmarks, ...additionalBookmarks]

export const mockTags: Tag[] = [
  { id: 1, name: "Component", date_added: "2025-08-17T16:05:11.830984Z" },
  { id: 2, name: "UI", date_added: "2025-08-17T16:05:11.830984Z" },
  { id: 3, name: "Documentation", date_added: "2025-08-16T14:30:00.000000Z" },
  { id: 4, name: "React", date_added: "2025-08-16T14:30:00.000000Z" },
  { id: 5, name: "Next.js", date_added: "2025-08-16T14:30:00.000000Z" },
  { id: 6, name: "CSS", date_added: "2025-08-15T10:15:30.000000Z" },
  { id: 7, name: "Framework", date_added: "2025-08-15T10:15:30.000000Z" },
  { id: 8, name: "Styling", date_added: "2025-08-15T10:15:30.000000Z" },
  { id: 9, name: "JavaScript", date_added: "2025-08-14T09:45:15.000000Z" },
  { id: 10, name: "Library", date_added: "2025-08-14T09:45:15.000000Z" },
  { id: 11, name: "Web", date_added: "2025-08-13T16:20:45.000000Z" },
  { id: 12, name: "Tool", date_added: "2025-08-13T16:20:45.000000Z" },
  { id: 13, name: "Resource", date_added: "2025-08-13T16:20:45.000000Z" },
  { id: 14, name: "Archive", date_added: "2025-08-13T16:20:45.000000Z" },
]

// Generate additional tags for testing pagination
const additionalTags: Tag[] = Array.from({ length: 110 }, (_, i) => ({
  id: 15 + i,
  name: `Tag${i + 15}`,
  date_added: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
}))

export const allMockTags = [...mockTags, ...additionalTags]
