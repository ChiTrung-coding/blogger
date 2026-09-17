import { Helmet } from 'react-helmet-async';
import { useSearchParams } from 'react-router-dom';
import { getAllPosts, getAllCategories } from '../lib/posts';
import { useConfig } from '../hooks/useConfig';
import ArticleCard from '../components/ui/ArticleCard';
import Sidebar from '../components/layout/Sidebar';

/**
 * BlogPage — Danh sách tất cả bài viết với filter theo category.
 *
 * - Đọc ?category= query param để lọc bài viết
 * - Tabs filter: "Tất cả" + mỗi category một tab
 * - Grid ArticleCard (2 cột tablet, 2 cột trong vùng content)
 * - Thông báo khi không có bài viết
 * - Sidebar bên phải trên desktop
 * - Helmet meta tags
 *
 * Yêu cầu: 2.2, 2.3, 2.5, 2.6
 */
export default function BlogPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const config = useConfig();

  // Đọc category từ query param (có thể null)
  const activeCategory = searchParams.get('category') || '';

  // Load tất cả published posts
  const allPosts = getAllPosts();

  // Load tất cả categories kèm post count
  const categories = getAllCategories();

  // Filter posts theo category nếu có
  const filteredPosts = activeCategory
    ? allPosts.filter(
        (p) => p.category.toLowerCase() === activeCategory.toLowerCase()
      )
    : allPosts;

  /**
   * Xử lý click vào tab category.
   * "Tất cả" → xóa ?category=, category cụ thể → set ?category=name
   */
  const handleCategoryClick = (categoryName) => {
    if (!categoryName) {
      // "Tất cả" — xóa query param
      setSearchParams({});
    } else {
      setSearchParams({ category: categoryName });
    }
  };

  // Meta description từ config
  const siteDescription = config?.site?.description ?? '';
  const siteName = config?.site?.name ?? "Blogger";

  // Tiêu đề trang động theo category đang active
  const pageTitle = activeCategory
    ? `${activeCategory} | Bài viết | ${siteName}`
    : `Bài viết | ${siteName}`;

  const metaDescription = activeCategory
    ? `Danh sách bài viết trong danh mục ${activeCategory}. ${siteDescription}`
    : `Tất cả bài viết kỹ thuật. ${siteDescription}`;

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
        {/* Page heading */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
            📝 Bài viết
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            {allPosts.length} bài viết được công bố
          </p>
        </div>

        {/* Category filter tabs */}
        {categories.length > 0 && (
          <div className="mb-8 flex flex-wrap gap-2">
            {/* Tab "Tất cả" */}
            <button
              onClick={() => handleCategoryClick('')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                !activeCategory
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
              }`}
              aria-pressed={!activeCategory}
            >
              Tất cả
              <span className="ml-1.5 text-xs opacity-75">({allPosts.length})</span>
            </button>

            {/* Tab cho từng category */}
            {categories.map((cat) => {
              const isActive =
                activeCategory.toLowerCase() === cat.name.toLowerCase();

              // Lấy màu từ config.categories
              const catConfig = (config.categories ?? []).find(
                (c) => c.name.toLowerCase() === cat.name.toLowerCase()
              );
              const accentColor = catConfig?.color ?? '#3B82F6';

              return (
                <button
                  key={cat.name}
                  onClick={() => handleCategoryClick(cat.name)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                    isActive
                      ? 'text-white shadow-sm'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                  }`}
                  style={isActive ? { backgroundColor: accentColor } : {}}
                  aria-pressed={isActive}
                >
                  {cat.name}
                  <span className="ml-1.5 text-xs opacity-75">({cat.count})</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Main content + Sidebar layout */}
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Articles section — 2/3 on desktop */}
          <div className="flex-1 min-w-0">
            {filteredPosts.length === 0 ? (
              /* Empty state */
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="text-5xl mb-4" aria-hidden="true">📭</div>
                <p className="text-lg font-medium text-slate-700 dark:text-slate-300">
                  Không có bài viết nào trong danh mục này.
                </p>
                <button
                  onClick={() => handleCategoryClick('')}
                  className="mt-4 text-sm text-blue-600 dark:text-blue-400 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
                >
                  Xem tất cả bài viết
                </button>
              </div>
            ) : (
              /* Article grid */
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {filteredPosts.map((post) => (
                  <ArticleCard key={post.slug} post={post} />
                ))}
              </div>
            )}
          </div>

          {/* Sidebar — 1/3 on desktop, below content on mobile */}
          <aside className="w-full lg:w-80 xl:w-96 flex-shrink-0">
            <Sidebar />
          </aside>
        </div>
      </div>
    </>
  );
}
