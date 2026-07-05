import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// 필기(글) 컬렉션 — MDX 본문 + 프런트매터
// cabin: 어느 오두막(주제)에 속하는지 / hasSim: 시뮬 있는 글(칠판에 노란 분필)
const notes = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/notes' }),
  schema: z.object({
    title: z.string(),
    cabin: z.enum(['eyes', 'math', 'ai', 'talk']),
    date: z.coerce.date(),
    hasSim: z.boolean().default(false),
    summary: z.string().optional(),
  }),
});

export const collections = { notes };
