import { Helmet } from 'react-helmet-async';
import { useParams, Navigate, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import { getPostBySlug, getRelatedPosts } from '../lib/posts';
import { useConfig } from '../hooks/useConfig';
import CategoryBadge from '../components/ui/CategoryBadge';
import TableOfContents from '../components/ui/TableOfContents';
import ShareButtons from '../components/blog/ShareButtons';
import CommentSection from '../components/blog/CommentSection';
import ArticleCard from '../components/ui/ArticleCard';
import { resolveAssetUrl } from '../lib/assets';

/**
 * Formats a date string as dd/mm/yyyy.
 * @param {string} dateStr - ISO date string
 * @returns {string}
 */
function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr;
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

/**
 * PostPage — Trang chi tiết bài viết.
 *
 * - Load post bằng slug từ URL params, redirect 404 nếu không tìm thấy
 * - Thumbnail full-width, h1 tiêu đề, category badge + tags
 * - Author info + date + reading time
 * - ShareButtons với URL và title
 * - Layout 2 cột: content bên trái + TableOfContents sticky bên phải (ẩn trên mobile)
 * - Render Markdown với remarkGfm, rehypeHighlight, rehypeSlug
 * - Bài viết liên quan: grid cards (ẩn section nếu rỗng)
 * - CommentSection dưới cùng
 * - Helmet: meta title, description, OG tags đầy đủ (og:type = article)
 *
 * Yêu cầu: 3.1, 3.2, 3.3, 3.4, 3.5, 12.1, 12.2
 */
export default function PostPage() {
  const { slug } = useParams();
  const config = useConfig();

  // Load post từ slug
  const post = getPostBySlug(slug);

  // Redirect 404 nếu không tìm thấy
  if (!post) {
    return <Navigate to="/*" replace />;
  }

  // Lấy bài viết liên quan (tối đa 5)
  const relatedPosts = getRelatedPosts(post, 5);

  // Lấy màu category từ config
  const categoryColor = (() => {
    const found = (config.categories ?? []).find(
      (c) => c.name.toLowerCase() === (post.category || '').toLowerCase()
    );
    return found?.color ?? '#3B82F6';
  })();

  // Construct URL đầy đủ của bài viết
  const postUrl = (config.site?.url ?? '') + '/#/blog/' + post.slug;

  // Ảnh OG: thumbnail hoặc defaultOgImage
  const ogImage = post.thumbnail || config.site?.defaultOgImage || '';

  const siteName = config.site?.name ?? "Trung's Blog";

  const metaTitle = `${post.title} | ${siteName}`;
  const metaDescription = (post.excerpt || '').slice(0, 160);

  return (
    <>
      <Helmet>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
        {/* Open Graph */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:url" content={postUrl} />
        <meta property="og:site_name" content={siteName} />
        {/* Article meta */}
        {post.date && (
          <meta property="article:published_time" content={post.date} />
        )}
        {post.category && (
          <meta property="article:section" content={post.category} />
        )}
        {(post.tags ?? []).map((tag) => (
          <meta key={tag} property="article:tag" content={tag} />
        ))}
        {/* Canonical */}
        <link rel="canonical" href={postUrl} />
      </Helmet>

      <article className="max-w-7xl mx-auto">
        {/* ── THUMBNAIL FULL-WIDTH ── */}
        {post.thumbnail && (
          <div className="w-full overflow-hidden max-h-[480px]">
            <img
              src={resolveAssetUrl(post.thumbnail)}
              alt={post.title}
              loading="lazy"
              className="w-full h-full object-cover"
              style={{ maxHeight: '480px' }}
            />
          </div>
        )}

        {/* ── HEADER BLOCK (centered) ── */}
        <header className="max-w-3xl mx-auto px-4 sm:px-6 pt-10 pb-6 text-center">
          {/* Category badge + tags */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
            {post.category && (
              <CategoryBadge name={post.category} color={categoryColor} />
            )}
            {(post.tags ?? []).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-100 leading-tight mb-6">
            {post.title}
          </h1>

          {/* Author info row */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-slate-600 dark:text-slate-400">
            {/* Avatar + name */}
            <div className="flex items-center gap-2">
              {config.owner?.avatar && (
                <img
                  src={resolveAssetUrl(config.owner.avatar)}
                  alt={config.owner.name ?? ''}
                  loading="lazy"
                  className="w-8 h-8 rounded-full object-cover border-2 border-slate-200 dark:border-slate-600"
                />
              )}
              <span className="font-medium text-slate-800 dark:text-slate-200">
                {config.owner?.name ?? ''}
              </span>
            </div>

            {/* Separator */}
            <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">•</span>

            {/* Date */}
            <span className="flex items-center gap-1">
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
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <time dateTime={post.date}>{formatDate(post.date)}</time>
            </span>

            {/* Separator */}
            <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">•</span>

            {/* Reading time */}
            {post.readingTime != null && (
              <span className="flex items-center gap-1">
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
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {post.readingTime} phút đọc
              </span>
            )}
          </div>

          {/* Share buttons */}
          <div className="mt-6 flex justify-center">
            <ShareButtons url={postUrl} title={post.title} />
          </div>
        </header>

        {/* ── MAIN CONTENT AREA ── */}
        <div className="px-4 sm:px-6 lg:px-8 pb-16">
          <div className="max-w-7xl mx-auto flex gap-10 items-start">
            {/* ── ARTICLE CONTENT (flex-1) ── */}
            <div className="flex-1 min-w-0">
              <div className="prose-blog">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeHighlight, rehypeSlug]}
                >
                  {post.content}
                </ReactMarkdown>
              </div>
            </div>

            {/* ── TABLE OF CONTENTS (sticky, hidden on mobile) ── */}
            <aside
              className="hidden lg:block w-64 flex-shrink-0 sticky top-6 self-start"
              aria-label="Mục lục"
            >
              <TableOfContents content={post.content} />
            </aside>
          </div>
        </div>

        {/* ── RELATED POSTS ── */}
        {relatedPosts.length > 0 && (
          <section
            className="border-t border-slate-200 dark:border-slate-700 px-4 sm:px-6 lg:px-8 py-12"
            aria-labelledby="related-posts-heading"
          >
            <div className="max-w-7xl mx-auto">
              <h2
                id="related-posts-heading"
                className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-8"
              >
                📚 Bài viết liên quan
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedPosts.map((relatedPost) => (
                  <ArticleCard key={relatedPost.slug} post={relatedPost} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── COMMENT SECTION ── */}
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <CommentSection slug={post.slug} />
          </div>
        </div>
      </article>
    </>
  );
}
