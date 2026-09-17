import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useConfig } from '../hooks/useConfig';
import Toast from '../components/ui/Toast';

const emptyForm = { name: '', email: '', subject: '', message: '' };

export default function ContactPage() {
  const { site, owner, contact = {} } = useConfig();
  const [form, setForm] = useState(emptyForm);
  const [status, setStatus] = useState('');
  const endpoint = contact.formspreeId ? `https://formspree.io/f/${contact.formspreeId}` : '';

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function submit(event) {
    event.preventDefault();
    if (!form.name.trim() || !form.email.includes('@') || !form.subject.trim() || !form.message.trim()) {
      setStatus('Vui lòng điền đầy đủ và kiểm tra email.');
      return;
    }
    if (!endpoint) {
      setStatus('Form liên hệ chưa được cấu hình. Vui lòng gửi email trực tiếp.');
      return;
    }
    try {
      const response = await fetch(endpoint, { method: 'POST', headers: { Accept: 'application/json', 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      if (!response.ok) throw new Error('Request failed');
      setForm(emptyForm);
      setStatus('Đã gửi thành công. Cảm ơn bạn đã liên hệ.');
    } catch {
      setStatus('Không thể gửi lúc này. Vui lòng thử lại sau.');
    }
  }

  return <><Helmet><title>{`Liên hệ | ${site.name}`}</title><meta name="description" content={`Liên hệ với ${owner.name}.`} /></Helmet><main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8"><h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Liên hệ</h1><div className="mt-8 grid gap-8 md:grid-cols-[1fr_280px]"><form onSubmit={submit} className="space-y-4"><label className="block text-sm font-medium">Họ tên<input required maxLength={100} value={form.name} onChange={(event) => update('name', event.target.value)} className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 dark:border-slate-600 dark:bg-slate-800" /></label><label className="block text-sm font-medium">Email<input required type="email" maxLength={254} value={form.email} onChange={(event) => update('email', event.target.value)} className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 dark:border-slate-600 dark:bg-slate-800" /></label><label className="block text-sm font-medium">Tiêu đề<input required maxLength={150} value={form.subject} onChange={(event) => update('subject', event.target.value)} className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 dark:border-slate-600 dark:bg-slate-800" /></label><label className="block text-sm font-medium">Nội dung<textarea required maxLength={2000} rows="7" value={form.message} onChange={(event) => update('message', event.target.value)} className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 dark:border-slate-600 dark:bg-slate-800" /></label><button className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">Gửi liên hệ</button></form><aside className="h-fit rounded-xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-800"><h2 className="font-semibold">Thông tin liên hệ</h2><a className="mt-3 block text-sm text-blue-600" href={`mailto:${owner.email}`}>{owner.email}</a><div className="mt-4 space-y-2 text-sm">{Object.entries(owner.social || {}).map(([name, url]) => <a key={name} href={url} target="_blank" rel="noopener noreferrer" className="block capitalize text-slate-600 dark:text-slate-400">{name}</a>)}</div></aside></div></main><Toast message={status} tone={status.startsWith('Đã gửi') ? 'success' : 'error'} /></>;
}
