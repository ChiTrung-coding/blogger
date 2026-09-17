import { getAllPosts } from '../lib/posts.js';

/**
 * Hook để lấy danh sách bài viết với optional filtering.
 * Vì dữ liệu là static (build-time), không cần useState/useEffect.
 *
 * @param {Object} options - Tuỳ chọn lọc
 * @param {string} [options.category] - Lọc theo category (case-insensitive)
 * @param {string} [options.tag] - Lọc theo tag
 * @param {number} [options.limit] - Giới hạn số lượng bài trả về
 * @returns {Object[]} Danh sách bài viết sau khi lọc
 */
export function usePosts(options = {}) {
  const { category, tag, limit } = options;

  let posts = getAllPosts();

  if (category) {
    posts = posts.filter(
      post => post.category.toLowerCase() === category.toLowerCase()
    );
  }

  if (tag) {
    posts = posts.filter(post => post.tags.includes(tag));
  }

  if (limit) {
    posts = posts.slice(0, limit);
  }

  return posts;
}
