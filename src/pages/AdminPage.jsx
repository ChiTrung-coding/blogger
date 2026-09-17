import { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Bold, Download, FilePlus2, Heading2, ImagePlus, Italic, LayoutDashboard, List, Pencil, Plus, Save, Trash2, X } from 'lucide-react';
import { useConfig } from '../hooks/useConfig';
import { getConfigOverrides, saveConfigOverrides } from '../lib/config';
import { getAdminData, saveAdminData } from '../lib/admin';
import { getManageablePosts } from '../lib/posts';
import { logoutAdmin } from '../lib/auth';
import { resolveAssetUrl } from '../lib/assets';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const tabs = [
  ['dashboard', 'Tổng quan', LayoutDashboard],
  ['posts', 'Bài viết', FilePlus2],
  ['projects', 'Dự án', Pencil],
  ['experiences', 'Kinh nghiệm', Pencil],
  ['profile', 'Giới thiệu', Pencil],
  ['aboutContent', 'Nội dung giới thiệu', Pencil],
  ['categories', 'Danh mục', Pencil],
];

const emptyPost = { title: '', slug: '', date: new Date().toISOString().slice(0, 10), category: '', tags: [], excerpt: '', thumbnail: '', published: true, content: '' };
const emptyProject = { name: '', description: '', image: '', technologies: [], github: '', demo: '', sortOrder: 1 };
const emptyExperience = { organization: '', role: '', type: 'work', startDate: '', endDate: '', description: '' };
const emptyCategory = { name: '', color: '#3B82F6' };
const toolOptions = {
  'Ngôn ngữ lập trình': ['PHP', 'Python', 'JavaScript', 'TypeScript', 'Node.js'],
  'Framework / Library': ['Laravel', 'React', 'Vue', 'Bootstrap', 'Tailwind CSS'],
  'Cơ sở dữ liệu': ['MySQL', 'SQL Server', 'MongoDB', 'PostgreSQL', 'Redis'],
  'Hệ điều hành': ['Windows', 'Linux', 'macOS'],
  'Công cụ khác': ['Git', 'Docker', 'VS Code', 'Figma', 'AWS'],
};

function slugify(value) {
  return value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

function Input({ label, value, onChange, textarea = false, type = 'text', options = null }) {
  textarea = textarea || label.startsWith('Kỹ năng mềm');
  if (label === 'Nội dung Markdown') {
    return <MarkdownEditor value={value} onChange={onChange} />;
  }
  if (label === 'Image URL' || label === 'Avatar URL') {
    return <ImagePicker label={label === 'Avatar URL' ? 'Ảnh đại diện' : 'Ảnh'} value={value} onChange={onChange} />;
  }
  const selectOptions = options || (label === 'Loại' ? ['work', 'education'] : null);
  if (selectOptions) {
    return <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">{label}<select value={value ?? ''} onChange={(event) => onChange(event.target.value)} className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-normal text-slate-900 outline-none focus:border-blue-500 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"><option value="">Chọn {label.toLowerCase()}</option>{selectOptions.map((option) => <option key={option} value={option}>{option === 'work' ? 'Làm việc' : option === 'education' ? 'Học tập' : option}</option>)}</select></label>;
  }
    const Tag = textarea ? 'textarea' : 'input';
    const inputType = label === 'Ngày bắt đầu' || label === 'Ngày kết thúc' ? 'date' : type;
    return <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">{label}<Tag type={inputType} value={value ?? ''} onChange={(event) => onChange(event.target.value)} rows={textarea ? 6 : undefined} className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-normal text-slate-900 outline-none focus:border-blue-500 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100" /></label>;
}

  function ImagePicker({ label, value, onChange }) {
    const [mode, setMode] = useState(value && !value.startsWith('data:image/') ? 'url' : 'file');
    const [saveMessage, setSaveMessage] = useState('');

    function handleFile(event) {
      const file = event.target.files?.[0];
      if (!file) return;
      if (!file.type.startsWith('image/')) {
        setSaveMessage('File đã chọn không phải là hình ảnh.');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        onChange(String(reader.result));
        setSaveMessage(`Đã chọn ${file.name}. Bấm nút lưu để ghi ảnh vào public/images.`);
      };
      reader.readAsDataURL(file);
    }

    return <div className="block text-sm font-medium text-slate-700 dark:text-slate-300"><span>{label}</span><div className="mt-1 flex gap-2"><button type="button" onClick={() => setMode('url')} className={`rounded-lg px-3 py-1.5 text-xs font-medium ${mode === 'url' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'}`}>Dán link URL</button><button type="button" onClick={() => setMode('file')} className={`rounded-lg px-3 py-1.5 text-xs font-medium ${mode === 'file' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'}`}>Tải từ máy</button></div><div className="mt-2 flex flex-wrap items-center gap-3">{mode === 'url' ? <input type="url" value={value?.startsWith('data:image/') ? '' : (value || '')} onChange={(event) => onChange(event.target.value)} placeholder="https://example.com/image.jpg" className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-normal text-slate-700 outline-none focus:border-blue-500 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-300" /> : <><input type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={handleFile} className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-normal text-slate-700 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-300" /><p className="basis-full text-xs font-normal text-slate-500">Ảnh từ máy sẽ được lưu khi bạn bấm nút lưu.</p></>}{value && <><img src={resolveAssetUrl(value)} alt="Xem trước" className="h-20 w-28 rounded-lg border border-slate-200 object-cover dark:border-slate-600" /><button type="button" onClick={() => onChange('')} className="text-sm text-red-600 hover:underline">Xóa ảnh</button></>}{saveMessage && <p className="basis-full text-xs font-normal text-amber-600 dark:text-amber-400">{saveMessage}</p>}</div></div>;
  }

function Panel({ title, children, onClose }) {
  return <section className="rounded-2xl border border-blue-200 bg-blue-50/60 p-5 dark:border-blue-900 dark:bg-blue-950/20"><div className="mb-5 flex items-center justify-between"><h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{title}</h2>{onClose && <button type="button" onClick={onClose} aria-label="Đóng" className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"><X size={18} /></button>}</div>{children}</section>;
}

function MarkdownEditor({ value, onChange }) {
  const [showSource, setShowSource] = useState(false);

  function transformPreviewUrl(url) {
    return url.startsWith('data:image/') ? url : url;
  }

  function insert(before, after = '') {
    const textarea = document.querySelector('[data-markdown-editor]');
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = value.slice(start, end) || 'nội dung';
    const nextValue = `${value.slice(0, start)}${before}${selected}${after}${value.slice(end)}`;
    onChange(nextValue);
    requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, start + before.length + selected.length);
    });
  }

  function insertImage(event) {
    const file = event.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => onChange(`${value}\n\n![${file.name}](${reader.result})\n`);
    reader.readAsDataURL(file);
    event.target.value = '';
  }

  return <div className="md:col-span-2"><label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Nội dung Markdown</label><div className="mt-1 overflow-hidden rounded-lg border border-slate-300 bg-white dark:border-slate-600 dark:bg-slate-900"><div className="flex flex-wrap items-center gap-1 border-b border-slate-200 bg-slate-50 p-2 dark:border-slate-700 dark:bg-slate-800">{showSource && <><button type="button" title="Tiêu đề" onClick={() => insert('## ', '')} className="rounded p-2 text-slate-600 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-700"><Heading2 size={16} /></button><button type="button" title="In đậm" onClick={() => insert('**', '**')} className="rounded p-2 text-slate-600 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-700"><Bold size={16} /></button><button type="button" title="In nghiêng" onClick={() => insert('*', '*')} className="rounded p-2 text-slate-600 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-700"><Italic size={16} /></button><button type="button" title="Danh sách" onClick={() => insert('- ', '')} className="rounded p-2 text-slate-600 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-700"><List size={16} /></button></>}<label title="Chèn hình ảnh" className="cursor-pointer rounded p-2 text-slate-600 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-700"><ImagePlus size={16} /><input type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={insertImage} className="hidden" /></label><button type="button" onClick={() => setShowSource((current) => !current)} className="ml-auto rounded-lg px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-100 dark:text-blue-400 dark:hover:bg-blue-900/30">{showSource ? 'Ẩn Markdown' : 'Chỉnh sửa Markdown'}</button></div>{showSource && <textarea data-markdown-editor value={value || ''} onChange={(event) => onChange(event.target.value)} rows={14} placeholder="Viết nội dung bài viết bằng Markdown..." className="block w-full resize-y border-0 bg-transparent px-3 py-3 font-mono text-sm leading-relaxed text-slate-900 outline-none dark:text-slate-100" />}</div><div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900"><p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Xem trước</p>{value?.trim() ? <div className="prose-blog"><ReactMarkdown remarkPlugins={[remarkGfm]} urlTransform={transformPreviewUrl}>{value}</ReactMarkdown></div> : <p className="text-sm text-slate-400">Nội dung và hình ảnh sẽ hiển thị ở đây.</p>}</div><p className="mt-1 text-xs font-normal text-slate-500">Ảnh chèn trong nội dung sẽ được lưu vào <code>public/images</code> khi bấm lưu bài viết.</p></div>;
}

function ActionButton({ children, onClick, danger = false, type = 'button' }) {
  return <button type={type} onClick={onClick} className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium ${danger ? 'text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30' : 'bg-blue-600 text-white hover:bg-blue-700'}`}>{children}</button>;
}

function AboutContentEditor({ form, setForm, onSave, onUpdateEducation, onToggleTool }) {
  return <Panel title="Nội dung trang Giới thiệu"><div className="space-y-6">
    <div className="grid gap-4 md:grid-cols-2"><Input label="Ngày tháng năm sinh" value={form.birthDate} onChange={(value) => setForm({ ...form, birthDate: value })} /><Input label="Định hướng chính" value={form.focus} onChange={(value) => setForm({ ...form, focus: value })} /><div className="md:col-span-2"><Input label="Mô tả định hướng" textarea value={form.direction} onChange={(value) => setForm({ ...form, direction: value })} /></div><div className="md:col-span-2"><Input label="Mục tiêu & Định hướng (mỗi dòng một mục tiêu)" textarea value={form.goals} onChange={(value) => setForm({ ...form, goals: value })} /></div><div className="md:col-span-2"><Input label="Câu trích dẫn" textarea value={form.quote} onChange={(value) => setForm({ ...form, quote: value })} /></div></div>
    <fieldset><div className="flex items-center justify-between"><legend className="text-sm font-semibold text-slate-800 dark:text-slate-200">Công nghệ & Công cụ</legend><span className="text-xs text-slate-500">Chọn các công nghệ bạn sử dụng</span></div><div className="mt-3 grid gap-4 md:grid-cols-2">{Object.entries(toolOptions).map(([group, options]) => { const selected = (form.tools[group] || '').split(',').map((item) => item.trim()).filter(Boolean); return <div key={group}><p className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">{group}</p><div className="flex flex-wrap gap-2">{options.map((tool) => <button key={tool} type="button" onClick={() => onToggleTool(group, tool)} className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${selected.includes(tool) ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300 bg-white text-slate-600 hover:border-blue-400 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-300'}`}>{tool}</button>)}</div></div>; })}</div></fieldset>
    <fieldset><legend className="text-sm font-semibold text-slate-800 dark:text-slate-200">Học vấn</legend><div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900"><div className="grid gap-3 md:grid-cols-2"><Input label="Trường / cơ sở đào tạo" value={form.education.organization} onChange={(value) => onUpdateEducation('organization', value)} /><Input label="Chuyên ngành / vai trò" value={form.education.role} onChange={(value) => onUpdateEducation('role', value)} /><Input label="Thời gian" value={form.education.period} onChange={(value) => onUpdateEducation('period', value)} /><div className="md:col-span-2"><Input label="Mô tả học vấn" textarea value={form.education.description} onChange={(value) => onUpdateEducation('description', value)} /></div></div></div></fieldset>
    <ActionButton onClick={onSave}><Save size={16} /> Lưu nội dung Giới thiệu</ActionButton>
  </div></Panel>;
}

export default function AdminPage() {
  const config = useConfig();
  const [tab, setTab] = useState('dashboard');
  const [posts, setPosts] = useState(() => getManageablePosts());
  const [adminData, setAdminData] = useState(() => getAdminData());
  const [editingPost, setEditingPost] = useState(null);
  const [isPostFormOpen, setIsPostFormOpen] = useState(false);
  const [postForm, setPostForm] = useState(emptyPost);
  const [editingProject, setEditingProject] = useState(null);
  const [projectForm, setProjectForm] = useState(emptyProject);
  const [editingExperience, setEditingExperience] = useState(null);
  const [experienceForm, setExperienceForm] = useState(emptyExperience);
  const [categoryForm, setCategoryForm] = useState(emptyCategory);
  const [editingCategory, setEditingCategory] = useState(null);
  const [profileForm, setProfileForm] = useState(() => ({ ...config.owner }));
  const [skillsForm, setSkillsForm] = useState(() => ({
    technical: (config.skills?.technical || []).map((skill) => ({ ...skill })),
    soft: (config.skills?.soft || []).join(', '),
  }));
  const [aboutForm, setAboutForm] = useState(() => ({
    birthDate: config.about?.birthDate || '',
    focus: config.about?.focus || '',
    direction: config.about?.direction || '',
    quote: config.about?.quote || '',
    goals: (config.about?.goals || []).join('\n'),
    tools: Object.fromEntries(Object.entries(config.about?.tools || {}).map(([group, items]) => [group, (items || []).join(', ')])),
    education: Array.isArray(config.about?.education) ? { ...(config.about.education[0] || {}) } : { ...(config.about?.education || {}) },
  }));
  const [notice, setNotice] = useState('');
  const overrides = getConfigOverrides();

  function handleLogout() {
    logoutAdmin();
    window.location.hash = '#/admin/login';
  }

  const projects = config.projects || [];
  const experiences = config.experiences || [];
  const availableTechnologies = [...new Set(projects.flatMap((project) => project.technologies || []))].sort((a, b) => a.localeCompare(b));
  const availableTags = [...new Set(posts.flatMap((post) => post.tags || []))].sort((a, b) => a.localeCompare(b));
  const stats = useMemo(() => ({ posts: posts.length, projects: projects.length, experiences: experiences.length }), [posts.length, projects.length, experiences.length]);

  function notify(message) { setNotice(message); window.setTimeout(() => setNotice(''), 2600); }

  async function persistImage(value, prefix) {
    if (!value?.startsWith('data:image/')) return value;
    const match = value.match(/^data:image\/([a-zA-Z0-9.+-]+);base64,/);
    const extension = match?.[1] === 'jpeg' ? 'jpg' : (match?.[1] || 'png');
    const name = `${prefix}-${Date.now()}.${extension}`;
    try {
      const response = await fetch('/__save-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, data: value }),
      });
      if (response.ok) return (await response.json()).path;
    } catch {
      // Static hosting keeps the data URL as a local fallback.
    }
    return value;
  }

  async function persistMarkdownImages(content, prefix) {
    const imagePattern = /!\[([^\]]*)\]\((data:image\/[^)]+)\)/g;
    let index = 0;
    const matches = [...content.matchAll(imagePattern)];
    let result = content;
    for (const match of matches) {
      const path = await persistImage(match[2], `${prefix}-${index}`);
      result = result.replace(match[2], path);
      index += 1;
    }
    return result;
  }

  function openPost(post = emptyPost) {
    setIsPostFormOpen(true);
    setEditingPost(post === emptyPost ? null : post.slug);
    setPostForm(post === emptyPost ? { ...emptyPost, tags: [] } : { ...post, tags: [...(post.tags || [])] });
  }

  function closePostForm() {
    setIsPostFormOpen(false);
    setEditingPost(null);
    setPostForm(emptyPost);
  }

  async function savePost(event) {
    event.preventDefault();
    const slug = slugify(postForm.slug || postForm.title);
    if (!postForm.title.trim() || !slug || !postForm.content.trim()) { notify('Bài viết cần có tiêu đề, slug và nội dung.'); return; }
    const thumbnail = await persistImage(postForm.thumbnail, `post-${slug}`);
    const content = await persistMarkdownImages(postForm.content, `post-${slug}-content`);
    const item = { ...postForm, thumbnail, content, slug, tags: postForm.tags.filter(Boolean), excerpt: postForm.excerpt.slice(0, 150), published: Boolean(postForm.published), readingTime: Math.max(1, Math.ceil(content.trim().split(/\s+/).length / 200)) };
    const nextPosts = [...adminData.posts];
    const index = nextPosts.findIndex((post) => post.slug === editingPost);
    if (index >= 0) nextPosts[index] = item; else nextPosts.push(item);
    const nextData = { ...adminData, posts: nextPosts, deletedPosts: (adminData.deletedPosts || []).filter((slugValue) => slugValue !== item.slug) };
    saveAdminData(nextData); setAdminData(nextData); setPosts(getManageablePosts()); closePostForm(); notify('Đã lưu bài viết.');
  }

  function deletePost(post) {
    if (!window.confirm(`Xóa bài viết “${post.title}”?`)) return;
    const custom = adminData.posts.filter((item) => item.slug !== post.slug);
    const deleted = adminData.posts.some((item) => item.slug === post.slug) ? adminData.deletedPosts : [...adminData.deletedPosts, post.slug];
    const nextData = { ...adminData, posts: custom, deletedPosts: deleted };
    saveAdminData(nextData); setAdminData(nextData); setPosts(getManageablePosts()); notify('Đã xóa bài viết.');
  }

  function downloadPost(post) {
    const frontmatter = { title: post.title, slug: post.slug, date: post.date, category: post.category, tags: post.tags, excerpt: post.excerpt, thumbnail: post.thumbnail || null, published: post.published };
    const markdown = `---\n${Object.entries(frontmatter).map(([key, value]) => `${key}: ${JSON.stringify(value)}`).join('\n')}\n---\n\n${post.content}`;
    const url = URL.createObjectURL(new Blob([markdown], { type: 'text/markdown' }));
    const link = document.createElement('a'); link.href = url; link.download = `${post.date}-${post.slug}.md`; link.click(); URL.revokeObjectURL(url);
  }

  function saveCollection(collection, form, editing, setEditing, empty) {
    const list = [...(config[collection] || [])];
    const index = editing === null ? -1 : Number(editing);
    const options = { ...overrides, [collection]: list };
    if (index >= 0) list[index] = form; else list.push(form);
    const nextOverrides = { ...overrides, [collection]: list };
    saveConfigOverrides(nextOverrides); setEditing(null); notify(`Đã lưu ${collection === 'projects' ? 'dự án' : 'kinh nghiệm'}.`);
    if (empty === emptyProject) setProjectForm(emptyProject); else setExperienceForm(emptyExperience);
  }
  async function saveProject() {
    const image = await persistImage(projectForm.image, `project-${slugify(projectForm.name || 'image')}`);
    const project = {
      ...projectForm,
      image,
      technologies: [...(projectForm.technologies || [])],
      sortOrder: Math.max(1, Number(projectForm.sortOrder) || 1),
    };
    const remaining = [...projects]
      .sort((a, b) => (a.sortOrder || 999) - (b.sortOrder || 999))
      .filter((_, index) => editingProject === 'new' || editingProject === null || index !== Number(editingProject));
    const targetIndex = Math.min(project.sortOrder - 1, remaining.length);
    remaining.splice(targetIndex, 0, project);
    const orderedProjects = remaining.map((item, index) => ({ ...item, sortOrder: index + 1 }));
    saveConfigOverrides({ ...overrides, projects: orderedProjects });
    setEditingProject(null);
    setProjectForm({ ...emptyProject, technologies: [] });
    notify('Đã lưu dự án và cập nhật thứ tự.');
  }

  function removeCollection(collection, index) {
    if (!window.confirm('Xóa mục này?')) return;
    const list = [...(config[collection] || [])]; list.splice(index, 1); saveConfigOverrides({ ...overrides, [collection]: list }); notify('Đã xóa mục.');
  }

  async function saveProfile(event) {
    event.preventDefault();
    const technical = skillsForm.technical
      .map((skill) => ({ name: skill.name.trim(), level: Math.min(100, Math.max(0, Number(skill.level) || 0)) }))
      .filter((skill) => skill.name);
    const avatar = await persistImage(profileForm.avatar, 'avatar');
    const owner = { ...config.owner, ...profileForm, avatar };
    const skills = { ...config.skills, technical, soft: skillsForm.soft.split(/[,\n]/).map((item) => item.trim()).filter(Boolean) };
    const about = { ...config.about, ...aboutForm, goals: aboutForm.goals.split(/\n/).map((item) => item.trim()).filter(Boolean), tools: Object.fromEntries(Object.entries(aboutForm.tools || {}).map(([group, items]) => [group, items.split(/[,\n]/).map((item) => item.trim()).filter(Boolean)])) };
    saveConfigOverrides({ ...overrides, owner, skills, about }); notify('Lưu tất cả thành công.');
  }

  function updateTechnicalSkill(index, field, value) {
    setSkillsForm((current) => ({
      ...current,
      technical: current.technical.map((skill, skillIndex) => skillIndex === index ? { ...skill, [field]: field === 'level' ? Number(value) : value } : skill),
    }));
  }

  function addTechnicalSkill() {
    setSkillsForm((current) => ({ ...current, technical: [...current.technical, { name: '', level: 50 }] }));
  }

  function removeTechnicalSkill(index) {
    setSkillsForm((current) => ({ ...current, technical: current.technical.filter((_, skillIndex) => skillIndex !== index) }));
  }

  function updateEducation(field, value) {
    setAboutForm((current) => ({ ...current, education: { ...current.education, [field]: value } }));
  }

  function toggleTool(group, tool) {
    setAboutForm((current) => {
      const selected = (current.tools[group] || '').split(',').map((item) => item.trim()).filter(Boolean);
      const next = selected.includes(tool) ? selected.filter((item) => item !== tool) : [...selected, tool];
      return { ...current, tools: { ...current.tools, [group]: next.join(', ') } };
    });
  }

  function saveAboutContent() {
    const about = {
      ...config.about,
      ...aboutForm,
      goals: aboutForm.goals.split(/\n/).map((item) => item.trim()).filter(Boolean),
      tools: Object.fromEntries(Object.entries(aboutForm.tools || {}).map(([group, items]) => [group, items.split(/[,\n]/).map((item) => item.trim()).filter(Boolean)])),
      education: { ...aboutForm.education, organization: aboutForm.education.organization.trim(), role: aboutForm.education.role.trim(), period: aboutForm.education.period.trim(), description: aboutForm.education.description.trim() },
    };
    saveConfigOverrides({ ...overrides, about });
    setAboutForm((current) => ({ ...current, education: about.education }));
    notify('Đã lưu nội dung trang Giới thiệu.');
  }

  function exportConfig() {
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = '_config.json'; link.click(); URL.revokeObjectURL(url);
  }

  return <>
    <Helmet><title>{`Admin | ${config.site.name}`}</title><meta name="description" content="Quản lý nội dung blog." /></Helmet>
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">Admin panel</p><h1 className="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-100">Quản lý blog</h1><p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Dữ liệu quản lý được lưu trên trình duyệt này.</p></div><div className="flex gap-2"><ActionButton onClick={exportConfig}><Download size={16} /> Xuất config</ActionButton><button type="button" onClick={handleLogout} className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800">Đăng xuất</button></div></header>
      {notice && <p role="status" aria-live="polite" className="fixed bottom-5 right-5 z-[60] rounded-xl border border-emerald-200 bg-emerald-600 px-4 py-3 text-sm font-medium text-white shadow-xl shadow-emerald-900/20">{notice}</p>}
      <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
        <nav className="h-fit rounded-2xl border border-slate-200 bg-white p-2 shadow-sm dark:border-slate-700 dark:bg-slate-800 lg:sticky lg:top-24">{tabs.map(([key, label, Icon]) => <button key={key} type="button" onClick={() => setTab(key)} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium ${tab === key ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700'}`}><Icon size={17} />{label}</button>)}</nav>
        <div className="min-w-0 space-y-6">
          {tab === 'dashboard' && <div className="grid gap-5 sm:grid-cols-3">{[['Bài viết', stats.posts], ['Dự án', stats.projects], ['Kinh nghiệm', stats.experiences]].map(([label, value]) => <div key={label} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800"><p className="text-sm text-slate-500">{label}</p><p className="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-100">{value}</p></div>)}</div>}

          {tab === 'posts' && <div className="space-y-5"><div className="flex justify-end"><ActionButton onClick={() => openPost()}><Plus size={16} /> Bài viết mới</ActionButton></div>{isPostFormOpen ? <Panel title={editingPost ? 'Sửa bài viết' : 'Tạo bài viết'} onClose={closePostForm}><form onSubmit={savePost} className="grid gap-4 md:grid-cols-2"><Input label="Tiêu đề" value={postForm.title} onChange={(value) => setPostForm({ ...postForm, title: value, slug: postForm.slug || slugify(value) })} /><Input label="Slug" value={postForm.slug} onChange={(value) => setPostForm({ ...postForm, slug: value })} /><Input label="Ngày đăng" type="date" value={postForm.date} onChange={(value) => setPostForm({ ...postForm, date: value })} /><label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Danh mục<select required value={postForm.category} onChange={(event) => setPostForm({ ...postForm, category: event.target.value })} className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-normal text-slate-900 outline-none focus:border-blue-500 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"><option value="">Chọn danh mục</option>{(config.categories || []).map((category) => <option key={category.name} value={category.name}>{category.name}</option>)}</select></label><fieldset className="md:col-span-2"><legend className="text-sm font-medium text-slate-700 dark:text-slate-300">Tags</legend><div className="mt-2 flex flex-wrap gap-2">{availableTags.length > 0 ? availableTags.map((tag) => { const selected = postForm.tags.includes(tag); return <label key={tag} className={`inline-flex cursor-pointer items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition-colors ${selected ? 'border-blue-500 bg-blue-600 text-white' : 'border-slate-300 bg-white text-slate-700 hover:border-blue-400 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-300'}`}><input type="checkbox" checked={selected} onChange={() => setPostForm({ ...postForm, tags: selected ? postForm.tags.filter((item) => item !== tag) : [...postForm.tags, tag] })} className="sr-only" />#{tag}</label>; }) : <p className="text-sm text-slate-500">Chưa có tag nào. Hãy tạo tag từ một bài viết trước.</p>}</div></fieldset><Input label="Image URL" value={postForm.thumbnail} onChange={(value) => setPostForm({ ...postForm, thumbnail: value })} /><Input label="Mô tả ngắn" value={postForm.excerpt} onChange={(value) => setPostForm({ ...postForm, excerpt: value })} /><label className="flex items-center gap-2 pt-6 text-sm"><input type="checkbox" checked={postForm.published} onChange={(event) => setPostForm({ ...postForm, published: event.target.checked })} /> Xuất bản</label><div className="md:col-span-2"><Input label="Nội dung Markdown" textarea value={postForm.content} onChange={(value) => setPostForm({ ...postForm, content: value })} /></div><div><ActionButton type="submit"><Save size={16} /> Lưu bài viết</ActionButton></div></form></Panel> : null}<div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800"><table className="w-full min-w-[680px] text-left text-sm"><thead className="border-b border-slate-200 text-xs uppercase text-slate-500 dark:border-slate-700"><tr><th className="px-4 py-3">Tiêu đề</th><th className="px-4 py-3">Danh mục</th><th className="px-4 py-3">Trạng thái</th><th className="px-4 py-3">Thao tác</th></tr></thead><tbody>{posts.map((post) => <tr key={post.slug} className="border-b border-slate-100 last:border-0 dark:border-slate-700"><td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-100">{post.title}</td><td className="px-4 py-3 text-slate-500">{post.category}</td><td className="px-4 py-3">{post.published ? 'Đã đăng' : 'Bản nháp'}</td><td className="px-4 py-3"><div className="flex gap-2"><button type="button" onClick={() => openPost(post)} className="text-blue-600">Sửa</button><button type="button" onClick={() => downloadPost(post)} className="text-slate-500">Xuất</button><button type="button" onClick={() => deletePost(post)} className="text-red-600">Xóa</button></div></td></tr>)}</tbody></table></div></div>}

          {tab === 'projects' && <CollectionManager title="Dự án" items={projects} form={projectForm} setForm={setProjectForm} editing={editingProject} setEditing={setEditingProject} empty={emptyProject} fields={['name', 'description', 'image', 'technologies', 'github', 'demo', 'sortOrder']} options={{ technologies: availableTechnologies }} onSave={saveProject} onDelete={(index) => removeCollection('projects', index)} />}
          {tab === 'experiences' && <CollectionManager title="Kinh nghiệm" items={experiences} form={experienceForm} setForm={setExperienceForm} editing={editingExperience} setEditing={setEditingExperience} empty={emptyExperience} fields={['organization', 'role', 'type', 'startDate', 'endDate', 'description']} onSave={() => saveCollection('experiences', experienceForm, editingExperience, setEditingExperience, emptyExperience)} onDelete={(index) => removeCollection('experiences', index)} />}
          {tab === 'categories' && <CollectionManager title="Danh mục" items={config.categories || []} form={categoryForm} setForm={setCategoryForm} editing={editingCategory} setEditing={setEditingCategory} empty={emptyCategory} fields={['name', 'color']} onSave={() => saveCollection('categories', categoryForm, editingCategory, setEditingCategory, emptyCategory)} onDelete={(index) => removeCollection('categories', index)} />}
          {tab === 'aboutContent' && <AboutContentEditor form={aboutForm} setForm={setAboutForm} onSave={saveAboutContent} onUpdateEducation={updateEducation} onToggleTool={toggleTool} />}
          {tab === 'profile' && <Panel title="Thông tin giới thiệu"><form onSubmit={saveProfile} className="grid gap-4 md:grid-cols-2">{[['name', 'Tên'], ['title', 'Chức danh'], ['motto', 'Motto'], ['location', 'Địa điểm'], ['education', 'Học vấn'], ['email', 'Email'], ['avatar', 'Avatar URL']].map(([name, label]) => <Input key={name} label={label} value={profileForm[name]} onChange={(value) => setProfileForm({ ...profileForm, [name]: value })} />)}<div className="md:col-span-2"><Input label="Tiểu sử" textarea value={profileForm.bio} onChange={(value) => setProfileForm({ ...profileForm, bio: value })} /></div>{['github', 'linkedin', 'facebook'].map((name) => <Input key={name} label={`${name} URL`} value={profileForm.social?.[name] || ''} onChange={(value) => setProfileForm({ ...profileForm, social: { ...profileForm.social, [name]: value } })} />)}<fieldset className="md:col-span-2"><div className="flex items-center justify-between"><legend className="text-sm font-medium text-slate-700 dark:text-slate-300">Kỹ năng kỹ thuật</legend><button type="button" onClick={addTechnicalSkill} className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700"><Plus size={14} /> Thêm kỹ năng</button></div><div className="mt-3 space-y-3">{skillsForm.technical.map((skill, index) => <div key={`${skill.name}-${index}`} className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900"><div className="flex items-end gap-3"><label className="min-w-0 flex-1 text-xs font-medium text-slate-500 dark:text-slate-400">Tên kỹ năng<input value={skill.name} onChange={(event) => updateTechnicalSkill(index, 'name', event.target.value)} className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-normal text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100" /></label><button type="button" onClick={() => removeTechnicalSkill(index)} aria-label={`Xóa ${skill.name || 'kỹ năng'}`} className="rounded-lg p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"><Trash2 size={17} /></button></div><div className="mt-3 flex items-center gap-3"><input type="range" min="0" max="100" value={skill.level} onChange={(event) => updateTechnicalSkill(index, 'level', event.target.value)} className="h-2 flex-1 accent-blue-600" /><output className="w-12 text-right text-sm font-semibold text-blue-600">{skill.level}%</output></div></div>)}{skillsForm.technical.length === 0 && <p className="text-sm text-slate-500">Chưa có kỹ năng. Hãy thêm kỹ năng đầu tiên.</p>}</div></fieldset><div className="md:col-span-2"><Input textarea label="Kỹ năng mềm (mỗi dòng một kỹ năng)" value={skillsForm.soft} onChange={(value) => setSkillsForm({ ...skillsForm, soft: value })} /></div><fieldset className="md:col-span-2 rounded-xl border border-blue-200 bg-blue-50/50 p-4 dark:border-blue-900 dark:bg-blue-950/20"><legend className="px-1 text-sm font-semibold text-blue-700 dark:text-blue-300">Nội dung trang Giới thiệu</legend><div className="mt-3 grid gap-4 md:grid-cols-2"><Input label="Ngày sinh" value={aboutForm.birthDate} onChange={(value) => setAboutForm({ ...aboutForm, birthDate: value })} /><Input label="Định hướng chính" value={aboutForm.focus} onChange={(value) => setAboutForm({ ...aboutForm, focus: value })} /><div className="md:col-span-2"><Input textarea label="Mô tả định hướng" value={aboutForm.direction} onChange={(value) => setAboutForm({ ...aboutForm, direction: value })} /></div><div className="md:col-span-2"><Input textarea label="Mục tiêu (mỗi dòng một mục tiêu)" value={aboutForm.goals} onChange={(value) => setAboutForm({ ...aboutForm, goals: value })} /></div><div className="md:col-span-2"><Input textarea label="Câu trích dẫn" value={aboutForm.quote} onChange={(value) => setAboutForm({ ...aboutForm, quote: value })} /></div>{Object.entries(aboutForm.tools).map(([group, value]) => <Input key={group} label={`${group} (phân cách bằng dấu phẩy)`} value={value} onChange={(nextValue) => setAboutForm({ ...aboutForm, tools: { ...aboutForm.tools, [group]: nextValue } })} />)}</div></fieldset><ActionButton type="submit"><Save size={16} /> Lưu tất cả</ActionButton></form></Panel>}
        </div>
      </div>
    </main>
  </>;
}

function CollectionManager({ title, items, form, setForm, editing, setEditing, empty, fields, options = {}, onSave, onDelete }) {
  const labels = { name: 'Tên', description: 'Mô tả', image: 'Image URL', github: 'GitHub URL', demo: 'Demo URL', sortOrder: 'Thứ tự hiển thị', organization: 'Tổ chức', role: 'Vai trò', type: 'Loại', startDate: 'Ngày bắt đầu', endDate: 'Ngày kết thúc' };
  return <div className="space-y-5"><div className="flex justify-end"><ActionButton onClick={() => { setForm({ ...empty, technologies: empty.technologies ? [...empty.technologies] : empty.technologies }); setEditing('new'); }}><Plus size={16} /> Thêm {title.toLowerCase()}</ActionButton></div>{editing !== null && <Panel title={editing === 'new' ? `Thêm ${title.toLowerCase()}` : `Sửa ${title.toLowerCase()}`} onClose={() => setEditing(null)}><div className="grid gap-4 md:grid-cols-2">{fields.map((field) => options[field] ? <fieldset key={field} className="md:col-span-2"><legend className="text-sm font-medium text-slate-700 dark:text-slate-300">Công nghệ sử dụng</legend><p className="mt-1 text-xs text-slate-500">Chọn một hoặc nhiều công nghệ cho dự án.</p><div className="mt-2 flex flex-wrap gap-2">{options[field].map((option) => { const selected = (form[field] || []).includes(option); return <label key={option} className={`inline-flex cursor-pointer items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition-colors ${selected ? 'border-blue-500 bg-blue-600 text-white' : 'border-slate-300 bg-white text-slate-700 hover:border-blue-400 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-300'}`}><input type="checkbox" checked={selected} onChange={() => setForm({ ...form, [field]: selected ? form[field].filter((item) => item !== option) : [...(form[field] || []), option] })} className="sr-only" />{option}</label>; })}</div></fieldset> : field === 'color' ? <label key={field} className="block text-sm font-medium text-slate-700 dark:text-slate-300">Màu danh mục<div className="mt-1 flex items-center gap-3"><input type="color" value={form[field] || '#3B82F6'} onChange={(event) => setForm({ ...form, [field]: event.target.value })} className="h-10 w-16 cursor-pointer rounded-lg border border-slate-300 bg-white p-1 dark:border-slate-600 dark:bg-slate-900" /><span className="font-mono text-sm uppercase text-slate-600 dark:text-slate-300">{form[field] || '#3B82F6'}</span></div></label> : <Input key={field} label={labels[field] || field} textarea={field === 'description'} type={field === 'sortOrder' ? 'number' : 'text'} value={form[field]} onChange={(value) => setForm({ ...form, [field]: field === 'sortOrder' ? Number(value) : value })} />)}</div><div className="mt-5"><ActionButton onClick={onSave}><Save size={16} /> Lưu</ActionButton></div></Panel>}<div className="grid gap-4 md:grid-cols-2">{items.map((item, index) => <article key={`${item.name || item.organization}-${index}`} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800"><h2 className="font-semibold text-slate-900 dark:text-slate-100">{item.name || item.role}</h2><p className="mt-1 text-sm text-slate-500">{item.organization || item.description}</p><div className="mt-4 flex gap-3"><button type="button" onClick={() => { setEditing(index); setForm({ ...item, technologies: Array.isArray(item.technologies) ? [...item.technologies] : [] }); }} className="text-sm text-blue-600">Sửa</button><button type="button" onClick={() => onDelete(index)} className="inline-flex items-center gap-1 text-sm text-red-600"><Trash2 size={14} /> Xóa</button></div></article>)}</div></div>;
}
