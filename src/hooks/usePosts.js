import { useEffect, useState } from 'react';
import { getAllPosts } from '../lib/posts.js';
import { getAdminEventName } from '../lib/admin.js';

/**
 * Hook để lấy danh sách bài viết với optional filtering.
 *
 * @param {Object} options - Tuỳ chọn lọc
 * @param {string} [options.category] - Lọc theo category (case-insensitive)
 * @param {string} [options.tag] - Lọc theo tag
 * @param {number} [options.limit] - Giới hạn số lượng bài trả về
 * @returns {Object[]} Danh sách bài viết sau khi lọc
 */
export function usePosts(options = {}) {
  const { category, tag, limit } = options;
  const [posts, setPosts] = useState(() => getAllPosts());

  useEffect(() => {
    const refresh = () => setPosts(getAllPosts());
    window.addEventListener(getAdminEventName(), refresh);
    return () => window.removeEventListener(getAdminEventName(), refresh);
  }, []);

  let result = posts;

  if (category) {
    result = result.filter(
      post => post.category.toLowerCase() === category.toLowerCase()
    );
  }

  if (tag) {
    result = result.filter(post => post.tags.includes(tag));
  }

  if (limit) {
    result = result.slice(0, limit);
  }

  return result;
}
