import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { getPostsByCategory } from '../lib/posts';
import { useConfig } from '../hooks/useConfig';
import ArticleCard from '../components/ui/ArticleCard';

/**
 * CategoryPage — Hiển thị tất cả bài viết thuộc một category cụ thể.
 *
 * - Nhận :name từ URL params (/blog/category/:name)
 * - Gọi getPostsByCategory(name) để lấy danh sách bài
 * - Hiển thị tiêu đề category, màu từ config
 * - Grid ArticleCard (1-2 cột giống BlogPage)
 * - Thông báo khi danh mục rỗng
 * - Helmet meta tags
 *
 * Yêu cầu: 2.3, 5.4
 */
export default function CategoryPage() {
  const { name } = useParams();
  const config = useConfig();

  const posts = getPostsByCategory(name || '');

  const siteName = config?.site?.name ?? "Trung's Blog";

  // Lấy màu category từ config, fallback về blue-500
  const catConfig = (config.categories ?? []).find(
    (c) => c.name.toLowerCase() === (name || '').toLowerCase()
  );
  const categoryColor = catConfig?.color ?? '#3B82F6';

  const pageTitle = `${name} | Bài viết | ${siteName}`;
  const metaDescription = `Danh sách bài viết trong danh mục ${name}. ${config?.site?.description ?? ''}`.trim();

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={metaDescription.slice(0, 160)} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={metaDescription.slice(0, 160)} />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Breadcrumb / back link */}
        <nav className="mb-6" aria-label="Điều hướng">
          <Link
            to="/blog"
            className="inline-flex items-center gap-1.5 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-150"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Tất cả bài viết
          </Link>
        </nav>

        {/* Page heading with category color accent */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            {/* Color dot from category config */}
            <span
              className="inline-block w-4 h-4 rounded-full flex-shrink-0"
              style={{ backgroundColor: categoryColor }}
              aria-hidden="true"
            />
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              {name}
            </h1>
          </div>
          <p className="text-slate-600 dark:text-slate-400 ml-7">
            {posts.length > 0
              ? `${posts.length} bài viết trong danh mục này`
              : 'Danh mục này chưa có bài viết nào'}
          </p>
        </div>

        {/* Article grid or empty state */}
        {posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="text-5xl mb-4" aria-hidden="true">📭</div>
            <p className="text-lg font-medium text-slate-700 dark:text-slate-300">
              Không có bài viết nào trong danh mục này.
            </p>
            <Link
              to="/blog"
              className="mt-4 text-sm text-blue-600 dark:text-blue-400 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
            >
              Xem tất cả bài viết
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {posts.map((post) => (
              <ArticleCard key={post.slug} post={post} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
