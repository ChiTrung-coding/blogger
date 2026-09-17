import { Helmet } from 'react-helmet-async';
import { BriefcaseBusiness, GraduationCap } from 'lucide-react';
import { useConfig } from '../hooks/useConfig';

function formatMonth(value) {
  if (!value) return 'Hiện tại';
  const [year, month] = value.split('-');
  return `${month}/${year}`;
}

export default function ExperiencePage() {
  const { site, experiences = [] } = useConfig();
  const sorted = [...experiences].sort((a, b) => String(b.startDate || '').localeCompare(String(a.startDate || '')));

  return (
    <>
      <Helmet><title>{`Kinh nghiệm | ${site.name}`}</title><meta name="description" content="Kinh nghiệm làm việc và học tập." /><link rel="canonical" href={`${site.url}/#/experience`} /></Helmet>
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Kinh nghiệm</h1>
        {sorted.length === 0 ? <p className="py-16 text-center text-slate-500 dark:text-slate-400">Chưa có thông tin kinh nghiệm.</p> : <div className="timeline mt-10">{sorted.map((item) => { const education = item.type === 'education'; const Icon = education ? GraduationCap : BriefcaseBusiness; return <article key={`${item.organization}-${item.startDate}`} className="timeline-item"><div className="timeline-card"><div className="flex items-start gap-3"><Icon className={education ? 'text-purple-500' : 'text-blue-500'} size={22} aria-hidden="true" /><div><p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{education ? 'Học tập' : 'Làm việc'}</p><h2 className="mt-1 text-lg font-semibold text-slate-900 dark:text-slate-100">{item.role}</h2><p className="text-sm font-medium text-blue-600 dark:text-blue-400">{item.organization}</p><p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{formatMonth(item.startDate)} - {formatMonth(item.endDate)}</p></div></div><p className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{(item.description || '').slice(0, 500)}</p></div></article>; })}</div>}
      </main>
    </>
  );
}
