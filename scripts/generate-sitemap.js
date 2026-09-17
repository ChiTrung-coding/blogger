import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const root = process.cwd();
const config = JSON.parse(fs.readFileSync(path.join(root, 'posts', '_config.json'), 'utf8'));
const baseUrl = config.site.url.replace(/\/$/, '');
const staticRoutes = ['', '#/blog', '#/portfolio', '#/experience', '#/about', '#/contact'];
const postRoutes = fs.readdirSync(path.join(root, 'posts'))
  .filter((file) => file.endsWith('.md'))
  .flatMap((file) => {
    const fullPath = path.join(root, 'posts', file);
    const parsed = matter(fs.readFileSync(fullPath, 'utf8'));
    if (parsed.data.published === false) return [];
    const fallback = file.replace(/^\d{4}-\d{2}-\d{2}-/, '').replace(/\.md$/, '');
    const slug = String(parsed.data.slug || fallback).toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-+|-+$/g, '');
    const modified = fs.statSync(fullPath).mtime.toISOString().slice(0, 10);
    return [{ loc: `${baseUrl}/#/blog/${slug}`, lastmod: modified }];
  });

const urls = [
  ...staticRoutes.map((route) => ({ loc: `${baseUrl}/${route}`, lastmod: new Date().toISOString().slice(0, 10) })),
  ...postRoutes,
];
const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(({ loc, lastmod }) => `  <url><loc>${loc}</loc><lastmod>${lastmod}</lastmod></url>`).join('\n')}\n</urlset>\n`;
fs.mkdirSync(path.join(root, 'public'), { recursive: true });
fs.writeFileSync(path.join(root, 'public', 'sitemap.xml'), xml);
