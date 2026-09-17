import { Link, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { searchPosts } from '../lib/search';
import { useConfig } from '../hooks/useConfig';

/**
 * SearchPage — Hiển thị kết quả tìm kiếm theo từ khóa ?q=
 *
 * - Đọc ?q= từ useSearchParams()
 * - Validate: q thiếu hoặc q.trim().length < 2 → hiển thị lỗi
 * - Gọi searchPosts(q) (đã giới hạn 20 kết quả)
 * - Hiển thị: title (Link đến /blog/:slug), excerpt ≤ 160 ký tự, date dd/mm/yyyy
 * - Thông báo "Không tìm thấy kết quả nào" khi rỗng
 * - Full dark mode support
 *
 * Yêu cầu: 5.2, 5.3, 5.4, 5.5, 5.6
 */
export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const config = useConfig();

  const q = searchParams.get('q') || '';
  const siteName = config?.site?.name ?? "Trung's Blog";

  // Validate: cần ít nhất 2 ký tự không phải whitespace
  const isInvalid = q.trim().length < 2;

  // Chỉ search khi query hợp lệ
  const results = isInvalid ? [] : searchPosts(q);

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

  const pageTitle = q
    ? `Tìm kiếm: ${q} | ${siteName}`
    : `Tìm kiếm | ${siteName}`;

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta
          name="description"
          content={
            q
              ? `Kết quả tìm kiếm cho "${q}" trên ${siteName}.`
              : `Tìm kiếm bài viết trên ${siteName}.`
          }
        />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Page heading */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
            🔍 Tìm kiếm
          </h1>
          {q && !isInvalid && (
            <p className="mt-2 text-slate-600 dark:text-slate-400">
              {results.length > 0
                ? `${results.length} kết quả cho: `
                : 'Tìm kiếm: '}
              <span className="font-medium text-slate-800 dark:text-slate-200">
                &ldquo;{q}&rdquo;
              </span>
            </p>
          )}
        </div>

        {/* Validation error */}
        {isInvalid && (
          <div
            role="alert"
            className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 dark:border-amber-700 dark:bg-amber-900/20 p-4 mb-8"
          >
            <svg
              className="w-5 h-5 text-amber-500 dark:text-amber-400 flex-shrink-0 mt-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
              />
            </svg>
            <p className="text-sm text-amber-800 dark:text-amber-300">
              Vui lòng nhập ít nhất 2 ký tự để tìm kiếm.
            </p>
          </div>
        )}

        {/* No results */}
        {!isInvalid && results.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="text-5xl mb-4" aria-hidden="true">🔎</div>
            <p className="text-lg font-medium text-slate-700 dark:text-slate-300">
              Không tìm thấy kết quả nào cho:{' '}
              <span className="font-semibold">&ldquo;{q}&rdquo;</span>
            </p>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Thử tìm với từ khóa khác hoặc kiểm tra chính tả.
            </p>
            <Link
              to="/blog"
              className="mt-6 text-sm text-blue-600 dark:text-blue-400 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
            >
              Xem tất cả bài viết
            </Link>
          </div>
        )}

        {/* Search results list */}
        {results.length > 0 && (
          <ol className="space-y-6" aria-label="Kết quả tìm kiếm">
            {results.map((post) => {
              const excerpt = post.excerpt
                ? post.excerpt.slice(0, 160)
                : (post.content || '').slice(0, 160);

              return (
                <li
                  key={post.slug}
                  className="group rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 shadow-sm hover:shadow-md hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-150"
                >
                  {/* Title */}
                  <h2 className="text-lg font-semibold mb-1.5">
                    <Link
                      to={`/blog/${post.slug}`}
                      className="text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-150"
                    >
                      {post.title}
                    </Link>
                  </h2>

                  {/* Date */}
                  {post.date && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1">
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
                    </p>
                  )}

                  {/* Excerpt ≤ 160 chars */}
                  {excerpt && (
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {excerpt}
                      {(post.excerpt?.length ?? (post.content?.length ?? 0)) > 160 && '…'}
                    </p>
                  )}

                  {/* Read more link */}
                  <Link
                    to={`/blog/${post.slug}`}
                    className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-150"
                    aria-label={`Đọc bài: ${post.title}`}
                  >
                    Xem chi tiết
                    <span aria-hidden="true">→</span>
                  </Link>
                </li>
              );
            })}
          </ol>
        )}
      </div>
    </>
  );
}
