import { describe, expect, it } from 'vitest';
import { getAllPosts, parsePost } from '../../src/lib/posts.js';

describe('post loader properties', () => {
  it('normalizes arbitrary slugs to lowercase URL-safe values', () => {
    const post = parsePost('/posts/2024-01-01-My Post!.md', '---\ntitle: Test\n---\nContent');
    expect(post.slug).toMatch(/^[a-z0-9-]*$/);
  });

  it('returns published posts sorted newest first with bounded excerpts', () => {
    const posts = getAllPosts();
    expect(posts.every((post) => post.published !== false)).toBe(true);
    expect(posts.every((post) => post.excerpt.length <= 150)).toBe(true);
    expect(posts.every((post, index) => index === 0 || new Date(posts[index - 1].date) >= new Date(post.date))).toBe(true);
  });
});
