import { Link } from 'react-router-dom';
import { useConfig } from '../../hooks/useConfig.js';
import { getAllCategories, getLatestPosts } from '../../lib/posts.js';
import { resolveAssetUrl } from '../../lib/assets.js';

/**
 * Format a date string (ISO or YYYY-MM-DD) as dd/mm/yyyy.
 * @param {string} dateStr
 * @returns {string}
 */
function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

export default function Sidebar() {
  const config = useConfig();
  const { owner, skills } = config;

  // Top 5 technical skills
  const topSkills = (skills?.technical ?? []).slice(0, 5);

  // Categories with post counts
  const categories = getAllCategories();

  // 5 most recent posts
  const recentPosts = getLatestPosts(5);

  return (
    <aside className="flex flex-col gap-6">
      {/* Widget 1 — Giới thiệu */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 flex flex-col items-center text-center gap-3 shadow-sm">
        <img
          src={resolveAssetUrl(owner.avatar)}
          alt={owner.name}
          loading="lazy"
          className="w-20 h-20 rounded-full object-cover border-2 border-blue-500"
        />
        <div>
          <p className="font-semibold text-slate-900 dark:text-slate-100 text-base">
            {owner.name}
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {owner.title}
          </p>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-4">
          {owner.bio}
        </p>
      </div>

      {/* Widget 2 — Kỹ năng chính */}
      {topSkills.length > 0 && (
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 shadow-sm">
          <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-3 text-sm uppercase tracking-wide">
            ⚡ Kỹ năng chính
          </h3>
          <div className="flex flex-wrap gap-2">
            {topSkills.map((skill) => (
              <span
                key={skill.name}
                className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300"
              >
                {skill.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Widget 3 — Danh mục */}
      {categories.length > 0 && (
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 shadow-sm">
          <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-3 text-sm uppercase tracking-wide">
            📂 Danh mục
          </h3>
          <ul className="space-y-2">
            {categories.map((cat) => {
              // Find color from config.categories if available
              const catConfig = (config.categories ?? []).find(
                (c) => c.name.toLowerCase() === cat.name.toLowerCase()
              );
              const color = catConfig?.color ?? '#3B82F6';

              return (
                <li key={cat.name}>
                  <Link
                    to={`/blog/category/${encodeURIComponent(cat.name)}`}
                    className="flex items-center justify-between group hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    <span className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                      <span
                        className="inline-block w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: color }}
                      />
                      {cat.name}
                    </span>
                    <span className="text-xs text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-700 rounded-full px-2 py-0.5">
                      {cat.count}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* Widget 4 — Bài viết gần đây */}
      {recentPosts.length > 0 && (
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 shadow-sm">
          <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-3 text-sm uppercase tracking-wide">
            🕐 Bài viết gần đây
          </h3>
          <ul className="space-y-3">
            {recentPosts.map((post) => (
              <li key={post.slug}>
                <Link
                  to={`/blog/${post.slug}`}
                  className="flex gap-3 group"
                >
                  {/* Thumbnail */}
                  <div className="flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-700">
                    {post.thumbnail ? (
                      <img
                        src={resolveAssetUrl(post.thumbnail)}
                        alt={post.title}
                        loading="lazy"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400 dark:text-slate-500 text-lg">
                        📄
                      </div>
                    )}
                  </div>

                  {/* Title + Date */}
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 leading-snug">
                      {post.title}
                    </p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                      {formatDate(post.date)}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </aside>
  );
}
