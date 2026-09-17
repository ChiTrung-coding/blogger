import yaml from 'js-yaml';
import { getAdminData } from './admin.js';

// Load tất cả Markdown files lúc build (Vite import.meta.glob)
const modules = import.meta.glob('/posts/*.md', { query: '?raw', import: 'default', eager: true });

/**
 * Parse một Markdown file thành Post object.
 * @param {string} filepath - đường dẫn file, vd: /posts/2024-01-15-ten-bai.md
 * @param {string} raw - nội dung raw của file Markdown
 * @returns {Object} post object
 */
export function parsePost(filepath, raw) {
  const { data, content } = parseFrontmatter(raw);
  const filename = filepath.split('/').pop().replace('.md', '');
  // Ưu tiên slug từ frontmatter, fallback: bỏ prefix YYYY-MM-DD-
  const slug = String(data.slug || filename.replace(/^\d{4}-\d{2}-\d{2}-/, ''))
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/^-+|-+$/g, '');
  // Excerpt: từ frontmatter hoặc cắt 150 ký tự đầu của content
  const excerptRaw = data.excerpt || content.slice(0, 150);
  return {
    slug,
    title: data.title || '',
    date: data.date ? String(data.date) : '',
    category: data.category || 'Uncategorized',
    tags: Array.isArray(data.tags) ? data.tags : [],
    excerpt: excerptRaw.trim().slice(0, 150),
    thumbnail: data.thumbnail || null,
    published: data.published !== false,
    content,
    readingTime: Math.max(1, Math.ceil(content.trim().split(/\s+/).filter(Boolean).length / 200)),
  };
}

function parseFrontmatter(raw) {
  const match = raw.match(/^\uFEFF?---\s*\r?\n([\s\S]*?)\r?\n---\s*(?:\r?\n|$)/);
  if (!match) return { data: {}, content: raw };

  const data = yaml.load(match[1], { schema: yaml.JSON_SCHEMA }) || {};
  return {
    data: typeof data === 'object' && !Array.isArray(data) ? data : {},
    content: raw.slice(match[0].length),
  };
}

/**
 * Trả về tất cả bài viết đã published, sắp xếp mới nhất trước.
 * @returns {Object[]}
 */
export function getAllPosts() {
  const basePosts = Object.entries(modules)
    .map(([filepath, raw]) => parsePost(filepath, raw))
  const adminData = getAdminData();
  const deleted = new Set(adminData.deletedPosts || []);
  const customPosts = adminData.posts || [];
  const customSlugs = new Set(customPosts.map((post) => post.slug));

  return [...basePosts.filter((post) => !deleted.has(post.slug) && !customSlugs.has(post.slug)), ...customPosts]
    .filter(post => post.published !== false)
    .sort((a, b) => new Date(b.date) - new Date(a.date));
}

export function getManageablePosts() {
  const basePosts = Object.entries(modules).map(([filepath, raw]) => parsePost(filepath, raw));
  const adminData = getAdminData();
  const deleted = new Set(adminData.deletedPosts || []);
  const customPosts = adminData.posts || [];
  const customSlugs = new Set(customPosts.map((post) => post.slug));
  return [...basePosts.filter((post) => !deleted.has(post.slug) && !customSlugs.has(post.slug)), ...customPosts]
    .sort((a, b) => new Date(b.date) - new Date(a.date));
}

/**
 * Tìm bài viết theo slug.
 * @param {string} slug
 * @returns {Object|null}
 */
export function getPostBySlug(slug) {
  return getAllPosts().find(p => p.slug === slug) || null;
}

/**
 * Lọc bài viết theo tên category (case-insensitive).
 * @param {string} name - tên category
 * @returns {Object[]}
 */
export function getPostsByCategory(name) {
  return getAllPosts().filter(
    p => p.category.toLowerCase() === name.toLowerCase()
  );
}

/**
 * Trả về các bài viết liên quan đến post hiện tại.
 * Score = (số tag trùng × 3) + (cùng category × 1)
 * @param {Object} post - post hiện tại
 * @param {number} limit - số lượng bài trả về (mặc định 5)
 * @returns {Object[]}
 */
export function getRelatedPosts(post, limit = 5) {
  const all = getAllPosts().filter(p => p.slug !== post.slug);
  const scored = all.map(p => ({
    post: p,
    score:
      p.tags.filter(t => post.tags.includes(t)).length * 3 +
      (p.category === post.category ? 1 : 0),
  }));
  return scored
    .sort(
      (a, b) =>
        b.score - a.score ||
        new Date(b.post.date) - new Date(a.post.date)
    )
    .slice(0, limit)
    .map(s => s.post);
}

/**
 * Trả về danh sách unique categories kèm số bài viết.
 * @returns {{ name: string, count: number }[]}
 */
export function getAllCategories() {
  const posts = getAllPosts();
  const map = {};
  for (const post of posts) {
    const cat = post.category;
    map[cat] = (map[cat] || 0) + 1;
  }
  return Object.entries(map).map(([name, count]) => ({ name, count }));
}

/**
 * Trả về N bài viết mới nhất.
 * @param {number} limit - số lượng bài (mặc định 5)
 * @returns {Object[]}
 */
export function getLatestPosts(limit = 5) {
  return getAllPosts().slice(0, limit);
}
