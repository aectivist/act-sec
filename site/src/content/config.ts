import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      tags: z.array(z.string()).default([]),
      category: z.string().default('General'),
      difficulty: z.enum(['Easy', 'Medium', 'Hard', 'Insane']).default('Easy'),
      coverImage: image().optional().or(z.string().optional()),
      draft: z.boolean().default(false),
    }),
});

const projects = defineCollection({
  type: 'content',
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      tags: z.array(z.string()).default([]),
      role: z.string().optional(),
      dateRange: z.string().optional(),
      githubUrl: z.string().url().optional(),
      liveUrl: z.string().url().optional(),
      coverImage: image().optional().or(z.string().optional()),
      featured: z.boolean().default(false),
    }),
});

const certifications = defineCollection({
  type: 'content',
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      issuer: z.string(),
      dateIssued: z.coerce.date(),
      credentialId: z.string().optional(),
      credentialUrl: z.string().url().optional(),
      badgeImage: image().optional().or(z.string().optional()),
      skills: z.array(z.string()).default([]),
    }),
});

const papers = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    pdfPath: z.string(),
    authors: z.array(z.string()).default([]),
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = { blog, projects, certifications, papers };
