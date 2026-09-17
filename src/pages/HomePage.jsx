import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { getLatestPosts } from '../lib/posts.js';
import { useConfig } from '../hooks/useConfig.js';
import ArticleCard from '../components/ui/ArticleCard.jsx';
import Sidebar from '../components/layout/Sidebar.jsx';
import { resolveAssetUrl } from '../lib/assets.js';

/**
 * HomePage — Trang chủ
 *
 * Bố cục: Hero → (Main 2/3 + Sidebar 1/3)
 *   Main: Bài viết mới nhất, Kỹ năng nổi bật, Dự án nổi bật
 *   Sidebar: Component Sidebar dùng chung
 *
 * Yêu cầu: 1.1, 1.2, 1.5, 1.6, 1.7
 */
export default function HomePage() {
  const config = useConfig();
  const { site, owner, skills, projects } = config;
  const homeLayout = config.homeLayout ?? ['latestPosts', 'skills', 'projects'];
  const sectionOrder = (section) => ({ order: homeLayout.indexOf(section) < 0 ? 99 : homeLayout.indexOf(section) });

  // 5 bài mới nhất
  const latestPosts = getLatestPosts(5);

  // Tối đa 6 technical skills
  const topSkills = (skills?.technical ?? []).slice(0, 6);

  // Top 3 dự án, sắp xếp theo sortOrder ASC
  const topProjects = [...(projects ?? [])]
    .sort((a, b) => (a.sortOrder ?? 999) - (b.sortOrder ?? 999))
    .slice(0, 3);

  const { social = {} } = owner;

  return (
    <>
      <Helmet>
        <title>{site.name} — Trang chủ</title>
        <meta name="description" content={site.description} />
        <meta property="og:title" content={site.name} />
        <meta property="og:description" content={site.description} />
        <meta property="og:image" content={site.defaultOgImage} />
        <meta property="og:url" content={site.url} />
        <meta property="og:type" content="website" />
      </Helmet>

      {/* ── HERO SECTION ── */}
      <section className="bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 border-b border-slate-200 dark:border-slate-700 py-12 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center gap-8">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <img
              src={resolveAssetUrl(owner.avatar)}
              alt={owner.name}
              loading="lazy"
              className="w-28 h-28 sm:w-36 sm:h-36 rounded-full object-cover border-4 border-blue-500 shadow-lg"
            />
          </div>

          {/* Info */}
          <div className="text-center sm:text-left">
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-1">
              {owner.name}
            </h1>
            <p className="text-lg text-blue-600 dark:text-blue-400 font-medium mb-2">
              {owner.title}
            </p>
            {owner.motto && (
              <p className="italic text-slate-600 dark:text-slate-400 mb-3">
                &ldquo;{owner.motto}&rdquo;
              </p>
            )}

            {/* Location + Education */}
            <div className="flex flex-wrap justify-center sm:justify-start gap-4 text-sm text-slate-600 dark:text-slate-400 mb-4">
              {owner.location && (
                <span className="flex items-center gap-1">
                  <span aria-hidden="true">📍</span>
                  {owner.location}
                </span>
              )}
              {owner.education && (
                <span className="flex items-center gap-1">
                  <span aria-hidden="true">🎓</span>
                  {owner.education}
                </span>
              )}
            </div>

            {/* Social Links */}
            <div className="flex flex-wrap justify-center sm:justify-start gap-3">
              {social.github && (
                <a
                  href={social.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-slate-900 text-white dark:bg-slate-700 dark:text-slate-100 hover:bg-slate-700 dark:hover:bg-slate-600 transition-colors duration-150"
                  aria-label="GitHub"
                >
                  {/* GitHub icon */}
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                  </svg>
                  GitHub
                </a>
              )}
              {social.linkedin && (
                <a
                  href={social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-150"
                  aria-label="LinkedIn"
                >
                  {/* LinkedIn icon */}
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                  LinkedIn
                </a>
              )}
              {social.facebook && (
                <a
                  href={social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-150"
                  aria-label="Facebook"
                >
                  {/* Facebook icon */}
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  Facebook
                </a>
              )}
              {social.discord && (
                <a
                  href={social.discord}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition-colors duration-150"
                  aria-label="Discord"
                >
                  {/* Discord icon */}
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028 14.09 14.09 0 001.226-1.994.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                  </svg>
                  Discord
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── MAIN CONTENT + SIDEBAR ── */}
      <div className="max-w-7xl mx-auto px-4 py-8 lg:grid lg:grid-cols-3 lg:gap-8">
        {/* Main content — 2/3 */}
        <main className="flex flex-col gap-12 lg:col-span-2">

          {/* ── BÀI VIẾT MỚI NHẤT ── */}
          <section aria-labelledby="latest-posts-heading" style={sectionOrder('latestPosts')}>
            <div className="flex items-center justify-between mb-6">
              <h2
                id="latest-posts-heading"
                className="text-xl font-bold text-slate-900 dark:text-slate-100"
              >
                📝 Bài viết mới nhất
              </h2>
              <Link
                to="/blog"
                className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-150 flex items-center gap-1"
              >
                Xem tất cả
                <span aria-hidden="true">→</span>
              </Link>
            </div>

            {latestPosts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {latestPosts.map((post) => (
                  <ArticleCard key={post.slug} post={post} />
                ))}
              </div>
            ) : (
              <p className="text-slate-500 dark:text-slate-400">
                Chưa có bài viết nào.
              </p>
            )}
          </section>

          {/* ── KỸ NĂNG NỔI BẬT ── */}
          {topSkills.length > 0 && (
            <section aria-labelledby="skills-heading" style={sectionOrder('skills')}>
              <h2
                id="skills-heading"
                className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-8"
              >
                ⚡ Kỹ năng nổi bật
              </h2>
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {topSkills.map((skill) => (
                    <div key={skill.name}>
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          {skill.name}
                        </span>
                        <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                          {skill.level}%
                        </span>
                      </div>
                      <div className="skill-bar" role="progressbar" aria-valuenow={skill.level} aria-valuemin={0} aria-valuemax={100} aria-label={`${skill.name}: ${skill.level}%`}>
                        <div
                          className="skill-bar-fill"
                          style={{ width: `${skill.level}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* ── DỰ ÁN NỔI BẬT ── */}
          {topProjects.length > 0 && (
            <section aria-labelledby="projects-heading" style={sectionOrder('projects')}>
              <div className="flex items-center justify-between mb-6">
                <h2
                  id="projects-heading"
                  className="text-xl font-bold text-slate-900 dark:text-slate-100"
                >
                  🚀 Dự án nổi bật
                </h2>
                <Link
                  to="/portfolio"
                  className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-150 flex items-center gap-1"
                >
                  Tất cả dự án
                  <span aria-hidden="true">→</span>
                </Link>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {topProjects.map((project) => (
                  <div
                    key={project.name}
                    className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
                  >
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                      {project.name}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
                      {project.description
                        ? project.description.slice(0, 200)
                        : ''}
                    </p>

                    {/* Technology tags */}
                    {project.technologies && project.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.technologies.map((tech) => (
                          <span
                            key={tech}
                            className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Links */}
                    <div className="flex gap-3">
                      {project.github && (
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 transition-colors duration-150"
                          aria-label={`GitHub: ${project.name}`}
                        >
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                          </svg>
                          GitHub
                        </a>
                      )}
                      {project.demo && (
                        <a
                          href={project.demo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-150"
                          aria-label={`Demo: ${project.name}`}
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                          Demo
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </main>

        {/* ── SIDEBAR — 1/3 ── */}
        <aside className="lg:col-span-1 mt-12 lg:mt-0">
          <Sidebar />
        </aside>
      </div>
    </>
  );
}
