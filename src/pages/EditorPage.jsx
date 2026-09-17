import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Download, GripVertical, RotateCcw, Save } from 'lucide-react';
import { useConfig } from '../hooks/useConfig';
import { persistConfig, clearConfigOverrides, getConfig } from '../lib/config';
import Toast from '../components/ui/Toast';

const sectionLabels = {
  latestPosts: 'Bài viết mới nhất',
  skills: 'Kỹ năng nổi bật',
  projects: 'Dự án nổi bật',
};

function createDraft(config) {
  return {
    site: {
      description: config.site.description,
    },
    owner: {
      name: config.owner.name,
      title: config.owner.title,
      motto: config.owner.motto,
      location: config.owner.location,
      education: config.owner.education,
      bio: config.owner.bio,
    },
    homeLayout: config.homeLayout ?? ['latestPosts', 'skills', 'projects'],
  };
}

function Field({ label, value, onChange, multiline = false }) {
  const Tag = multiline ? 'textarea' : 'input';
  return (
    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
      {label}
      <Tag
        value={value || ''}
        onChange={(event) => onChange(event.target.value)}
        rows={multiline ? 5 : undefined}
        className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-normal text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
      />
    </label>
  );
}

export default function EditorPage() {
  const config = useConfig();
  const [draft, setDraft] = useState(() => createDraft(config));
  const [dragged, setDragged] = useState(null);
  const [saved, setSaved] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  function updateOwner(field, value) {
    setDraft((current) => ({ ...current, owner: { ...current.owner, [field]: value } }));
    setSaved(false);
  }

  async function save() {
    const { savedToDisk } = await persistConfig(draft);
    setSaved(true);
    setSaveMessage(savedToDisk
      ? 'Đã ghi vào posts/_config.json. Commit và push để mọi thiết bị cùng dữ liệu.'
      : 'Đã cập nhật tạm trên máy này. Website tĩnh không đồng bộ giữa thiết bị — hãy xuất config rồi commit/push.');
  }

  async function reset() {
    await clearConfigOverrides();
    setDraft(createDraft(getConfig()));
    setSaved(false);
    setSaveMessage('');
  }

  function downloadConfig() {
    const exported = {
      ...config,
      site: { ...config.site, ...draft.site },
      owner: { ...config.owner, ...draft.owner },
      homeLayout: draft.homeLayout,
    };
    const blob = new Blob([JSON.stringify(exported, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = '_config.json';
    link.click();
    URL.revokeObjectURL(url);
  }

  function moveSection(target) {
    if (!dragged || dragged === target) return;
    setDraft((current) => {
      const layout = [...current.homeLayout];
      const from = layout.indexOf(dragged);
      const to = layout.indexOf(target);
      layout.splice(from, 1);
      layout.splice(to, 0, dragged);
      return { ...current, homeLayout: layout };
    });
    setDragged(null);
    setSaved(false);
  }

  return (
    <>
      <Helmet>
        <title>Chỉnh sửa giao diện | {config.site.name}</title>
        <meta name="description" content="Chỉnh sửa nội dung và bố cục blog trực tiếp trên giao diện." />
      </Helmet>
      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <header className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600 dark:text-blue-400">Visual editor</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-100">Chỉnh sửa blog</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-400">Nguồn dữ liệu chính là <code>posts/_config.json</code>. GitHub Pages không lưu được thay đổi Admin giữa các thiết bị.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={downloadConfig} className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"><Download size={16} /> Xuất config</button>
            <button type="button" onClick={reset} className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-950/30"><RotateCcw size={16} /> Khôi phục</button>
          </div>
        </header>

        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          <section className="space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Nội dung giới thiệu</h2>
              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <Field label="Tên hiển thị" value={draft.owner.name} onChange={(value) => updateOwner('name', value)} />
                <Field label="Chức danh" value={draft.owner.title} onChange={(value) => updateOwner('title', value)} />
                <Field label="Motto" value={draft.owner.motto} onChange={(value) => updateOwner('motto', value)} />
                <Field label="Địa điểm" value={draft.owner.location} onChange={(value) => updateOwner('location', value)} />
                <Field label="Học vấn" value={draft.owner.education} onChange={(value) => updateOwner('education', value)} />
                <Field label="Mô tả blog" value={draft.site.description} onChange={(value) => { setDraft((current) => ({ ...current, site: { ...current.site, description: value } })); setSaved(false); }} />
              </div>
              <div className="mt-5"><Field label="Tiểu sử" value={draft.owner.bio} multiline onChange={(value) => updateOwner('bio', value)} /></div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Bố cục trang chủ</h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Kéo các khối để thay đổi thứ tự hiển thị.</p>
              <div className="mt-5 space-y-3">
                {draft.homeLayout.map((section) => (
                  <div key={section} draggable onDragStart={() => setDragged(section)} onDragOver={(event) => event.preventDefault()} onDrop={() => moveSection(section)} className="flex cursor-grab items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 active:cursor-grabbing dark:border-slate-700 dark:bg-slate-900">
                    <GripVertical size={18} className="text-slate-400" />
                    <span className="font-medium text-slate-800 dark:text-slate-200">{sectionLabels[section]}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <aside className="h-fit rounded-2xl border border-blue-200 bg-blue-50 p-5 dark:border-blue-900 dark:bg-blue-950/30">
            <h2 className="font-semibold text-slate-900 dark:text-slate-100">Cách lưu thay đổi</h2>
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              <li>Sửa nội dung hoặc kéo thả bố cục.</li>
              <li>Khi chạy <code>npm run dev</code>, “Lưu thay đổi” ghi thẳng vào <code>posts/_config.json</code>.</li>
              <li>Trên GitHub Pages hãy xuất JSON, thay file rồi commit/push để máy tính và điện thoại cùng dữ liệu.</li>
            </ol>
            <button type="button" onClick={save} className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"><Save size={16} /> Lưu thay đổi</button>
          </aside>
        </div>
      </main>
      <Toast message={saved ? (saveMessage || 'Đã lưu và cập nhật giao diện.') : ''} />
    </>
  );
}
