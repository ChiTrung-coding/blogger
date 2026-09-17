import Fuse from 'fuse.js';
import { getAllPosts } from './posts.js';

// Lazy-initialized Fuse instance — created only on first search call
let fuseInstance = null;

/**
 * Returns (or lazily creates) the Fuse search index over all published posts.
 * @returns {Fuse} The Fuse.js instance
 */
function getFuseInstance() {
  if (fuseInstance) return fuseInstance;

  const posts = getAllPosts();
  fuseInstance = new Fuse(posts, {
    keys: [
      { name: 'title', weight: 3 },
      { name: 'excerpt', weight: 2 },
      { name: 'content', weight: 1 },
      { name: 'tags', weight: 2 },
    ],
    threshold: 0.3,
    includeScore: true,
    minMatchCharLength: 2,
  });

  return fuseInstance;
}

/**
 * Search posts by keyword using Fuse.js fuzzy search.
 *
 * Returns [] if:
 *  - keyword is falsy
 *  - keyword length < 2
 *  - keyword contains only whitespace
 *
 * Returns at most 20 results.
 *
 * @param {string} keyword - The search keyword
 * @returns {Array} Matching post objects (not Fuse result wrappers), max 20
 */
export function searchPosts(keyword) {
  if (!keyword || keyword.trim().length < 2) return [];

  return getFuseInstance()
    .search(keyword)
    .slice(0, 20)
    .map(result => result.item);
}

/**
 * Resets the lazy Fuse instance (useful for testing).
 */
export function resetSearchIndex() {
  fuseInstance = null;
}
