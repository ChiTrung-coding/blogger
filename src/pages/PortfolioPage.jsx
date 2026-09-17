import { Helmet } from 'react-helmet-async';
import { Code2, ExternalLink } from 'lucide-react';
import { useConfig } from '../hooks/useConfig';
import { resolveAssetUrl } from '../lib/assets';

export default function PortfolioPage() {
  const { site, projects = [] } = useConfig();
  const sortedProjects = [...projects].sort((a, b) => (a.sortOrder ?? 999) - (b.sortOrder ?? 999));

  return (
    <>
      <Helmet>
        <title>{`Dự án | ${site.name}`}</title>
        <meta name="description" content={`Các dự án cá nhân của ${site.name}.`} />
        <link rel="canonical" href={`${site.url}/#/portfolio`} />
      </Helmet>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Dự án</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">Những sản phẩm và bài toán mình đã thực hiện.</p>
        </header>
        {sortedProjects.length === 0 ? (
          <p className="py-16 text-center text-slate-500 dark:text-slate-400">Chưa có dự án nào.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {sortedProjects.map((project) => (
              <article key={project.name} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
                {project.image ? <img src={resolveAssetUrl(project.image)} alt={project.name} loading="lazy" onError={(event) => { event.currentTarget.style.display = 'none'; }} className="h-44 w-full object-cover" /> : <div className="h-44 bg-gradient-to-br from-blue-600 to-slate-900" />}
                <div className="p-5">
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">{project.name}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{(project.description || '').slice(0, 200)}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {(project.technologies || []).map((technology) => <span key={technology} className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900/40 dark:text-blue-300">{technology}</span>)}
                  </div>
                  <div className="mt-5 flex gap-4 text-sm font-medium">
                    {project.github && <a href={project.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-slate-700 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400"><Code2 size={16} /> GitHub</a>}
                    {project.demo && <a href={project.demo} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"><ExternalLink size={16} /> Demo</a>}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
