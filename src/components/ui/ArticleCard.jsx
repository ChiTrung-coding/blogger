import { Link } from 'react-router-dom';
import { useConfig } from '../../hooks/useConfig.js';
import CategoryBadge from './CategoryBadge.jsx';
import { resolveAssetUrl } from '../../lib/assets.js';

/**
 * ArticleCard — Hiển thị card bài viết trong danh sách.
 *
 * Props:
 *   post — Post object từ posts.js (slug, title, date, category,
 *           excerpt, thumbnail, readingTime)
 *
 * Yêu cầu: 2.1, 11.4
 */
export default function ArticleCard({ post }) {
  const config = useConfig();

  // Lấy màu category từ config, fallback về blue-500
  const categoryColor = (() => {
    const found = config.categories?.find(
      (c) => c.name.toLowerCase() === (post.category || '').toLowerCase()
    );
    return found?.color ?? '#3B82F6';
  })();

  // Format ngày dd/mm/yyyy
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (isNaN(d)) return dateStr;
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  };

  const excerpt =
    post.excerpt ? post.excerpt.slice(0, 150) : (post.content || '').slice(0, 150);

  return (
    <article className="article-card group flex flex-col h-full">
      {/* Thumbnail */}
      <Link
        to={`/blog/${post.slug}`}
        className="block overflow-hidden"
        aria-label={`Xem bài viết: ${post.title}`}
        tabIndex={-1}
      >
        {post.thumbnail ? (
          <img
            src={resolveAssetUrl(post.thumbnail)}
            alt={post.title}
            loading="lazy"
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          /* Fallback khi không có thumbnail */
          <div className="w-full h-48 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 flex items-center justify-center">
            <svg
              className="w-12 h-12 text-slate-400 dark:text-slate-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}
      </Link>

      {/* Card body */}
      <div className="flex flex-col flex-1 p-5">
        {/* Category badge */}
        {post.category && (
          <div className="mb-3 self-start">
            <CategoryBadge name={post.category} color={categoryColor} />
          </div>
        )}

        {/* Title */}
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2 leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-150">
          <Link to={`/blog/${post.slug}`}>{post.title}</Link>
        </h3>

        {/* Excerpt */}
        {excerpt && (
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 leading-relaxed flex-1">
            {excerpt}
          </p>
        )}

        {/* Meta: date + reading time */}
        <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-500 mb-4">
          <span className="flex items-center gap-1">
            {/* Calendar icon */}
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            {formatDate(post.date)}
          </span>

          {post.readingTime != null && (
            <span className="flex items-center gap-1">
              {/* Clock icon */}
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {post.readingTime} phút đọc
            </span>
          )}
        </div>

        {/* CTA link */}
        <Link
          to={`/blog/${post.slug}`}
          className="mt-auto self-end text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-150 flex items-center gap-1 group/link"
        >
          Xem chi tiết
          <span
            className="inline-block translate-x-0 group-hover/link:translate-x-1 transition-transform duration-150"
            aria-hidden="true"
          >
            →
          </span>
        </Link>
      </div>
    </article>
  );
}
