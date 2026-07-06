// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import tailwindcss from '@tailwindcss/vite';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

// choo-studio — 숲속 오두막 강의동
// 뼈대: Astro + React(island) + MDX + Tailwind v4
// 수식: KaTeX (remark-math로 $...$ 파싱 → rehype-katex로 렌더). mdx()는 기본적으로 markdown 설정을 상속.
export default defineConfig({
  integrations: [react(), mdx()],
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
