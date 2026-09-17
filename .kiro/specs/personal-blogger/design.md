# Design Document — Personal Blogger (Static Site)

## Overview

Trang blog cá nhân được xây dựng dưới dạng **static site** bằng **React + Vite**, deploy lên **GitHub Pages**. Không có backend, không có database — tất cả nội dung được lưu dưới dạng Markdown files trong repository. Build-time processing đọc Markdown, render HTML và tạo ra static bundle.

### Ràng buộc của GitHub Pages

- Chỉ host static files (HTML/CSS/JS)
- Không hỗ trợ server-side rendering hay PHP/Node.js runtime
- URL format: `https://{username}.github.io/{repo-name}/`
- Cần dùng `HashRouter` hoặc cấu hình `404.html` redirect để SPA routing hoạt động

### Giải pháp cho các tính năng động

| Tính năng | Giải pháp static | Ghi chú |
|-----------|-----------------|---------|
| Bài viết | Markdown files trong repo | Đọc lúc build |
| Bình luận | Giscus (GitHub Discussions) | Widget JS nhúng |
| Form liên hệ | Formspree | POST đến API bên ngoài |
| Admin/CMS | Viết Markdown trực tiếp + push | Không có UI admin |
| Tìm kiếm | Fuse.js (client-side fuzzy search) | Tìm trong dữ liệu đã load |
| Sitemap | Vite plugin sinh lúc build | |

---

## Tech Stack

| Layer | Công nghệ | Phiên bản | Ghi chú |
|-------|-----------|-----------|---------|
| Framework | React | 18.x | Functional components + Hooks |
| Build Tool | Vite | 5.x | Fast HMR, rollup bundler |
| Routing | React Router | 6.x | HashRouter cho GitHub Pages |
| Styling | Tailwind CSS | 3.x | darkMode: 'class' |
| Markdown | gray-matter + react-markdown | latest | Frontmatter + render |
| Syntax highlight | rehype-highlight | latest | Code blocks |
| Search | Fuse.js | 7.x | Client-side fuzzy search |
| Icons | Lucide React | latest | SVG icons |
| SEO | react-helmet-async | latest | Meta tags động |
| Comment | Giscus | — | GitHub Discussions widget |
| Contact | Formspree | — | Free tier: 50 submissions/month |
| Deploy | GitHub Pages + GitHub Actions | — | Auto deploy khi push main |
| Testing | Vitest + React Testing Library | latest | Unit + Property tests |

### `package.json` dependencies

```json
{
  "dependencies": {
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "react-router-dom": "^6.26.0",
    "react-markdown": "^9.0.0",
    "react-helmet-async": "^2.0.0",
    "gray-matter": "^4.0.3",
    "fuse.js": "^7.0.0",
    "lucide-react": "^0.400.0",
    "rehype-highlight": "^7.0.0",
    "rehype-slug": "^6.0.0",
    "remark-gfm": "^4.0.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.0",
    "tailwindcss": "^3.4.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0",
    "vite": "^5.4.0",
    "vitest": "^2.0.0",
    "@testing-library/react": "^16.0.0",
    "@testing-library/jest-dom": "^6.0.0"
  }
}
```

---

## Architecture

```
GitHub Repository
├── src/                        # Source code React
├── posts/                      # Markdown bài viết
├── public/                     # Static assets
├── .github/workflows/          # GitHub Actions CI/CD
└── dist/                       # Build output (auto-generated)
         │
         ▼ GitHub Actions (push to main)
         │ npm run build
         ▼
    GitHub Pages
    https://username.github.io/blogger/
```

### Luồng dữ liệu

```
posts/*.md (Markdown files)
    │
    │ Vite build-time (import.meta.glob)
    ▼
src/lib/posts.js (parse frontmatter + content)
    │
    ▼
React Components (render)
    │
    ▼
Static HTML/JS/CSS (dist/)
    │
    ▼
GitHub Pages (browser)
```

---

## Cấu trúc thư mục

```
blogger/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions: build + deploy
│
├── posts/                      # Bài viết Markdown
│   ├── _config.json            # Cấu hình site (tên, bio, skills, v.v.)
│   └── 2024-01-15-ten-bai-viet.md
│
├── public/
│   ├── images/
│   │   ├── avatar.jpg          # Ảnh đại diện
│   │   └── default-og.jpg      # Ảnh OG mặc định
│   └── 404.html                # Redirect cho SPA routing
│
├── src/
│   ├── main.jsx                # Entry point
│   ├── App.jsx                 # Router setup
│   │
│   ├── lib/
│   │   ├── posts.js            # Parse + load Markdown files
│   │   ├── config.js           # Load _config.json
│   │   └── search.js           # Fuse.js search wrapper
│   │
│   ├── hooks/
│   │   ├── useTheme.js         # Dark/light mode hook
│   │   └── usePosts.js         # Load + filter posts hook
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.jsx          # Navigation + search icon + theme toggle
│   │   │   ├── Footer.jsx          # Footer với social links
│   │   │   └── Sidebar.jsx         # Sidebar: bio, skills, categories, recent posts
│   │   ├── ui/
│   │   │   ├── ArticleCard.jsx     # Card bài viết trong danh sách
│   │   │   ├── CategoryBadge.jsx   # Badge màu cho category
│   │   │   ├── ThemeToggle.jsx     # Nút chuyển dark/light
│   │   │   ├── SearchModal.jsx     # Modal tìm kiếm
│   │   │   └── TableOfContents.jsx # TOC từ headings bài viết
│   │   └── blog/
│   │       ├── CommentSection.jsx  # Giscus widget wrapper
│   │       └── ShareButtons.jsx    # Share FB/Twitter/LinkedIn
│   │
│   ├── pages/
│   │   ├── HomePage.jsx        # Trang chủ: Hero + latest posts + sidebar
│   │   ├── BlogPage.jsx        # Danh sách bài viết + filter
│   │   ├── PostPage.jsx        # Chi tiết bài viết
│   │   ├── CategoryPage.jsx    # Lọc theo category
│   │   ├── SearchPage.jsx      # Kết quả tìm kiếm
│   │   ├── PortfolioPage.jsx   # Danh sách dự án
│   │   ├── ExperiencePage.jsx  # Timeline kinh nghiệm
│   │   ├── AboutPage.jsx       # Giới thiệu bản thân
│   │   ├── ContactPage.jsx     # Form liên hệ (Formspree)
│   │   └── NotFoundPage.jsx    # 404
│   │
│   └── styles/
│       └── app.css             # Tailwind + custom styles
│
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── vitest.config.js
```

---

## Data Models

### Markdown Frontmatter (bài viết)

Mỗi file trong `posts/` có cấu trúc:

```markdown
---
title: "Tiêu đề bài viết"
slug: "ten-bai-viet"
date: "2024-01-15"
category: "Web Development"
tags: ["React", "JavaScript", "Tutorial"]
excerpt: "Mô tả ngắn gọn bài viết, tối đa 150 ký tự."
thumbnail: "/images/posts/thumbnail.jpg"
published: true
---

Nội dung bài viết viết bằng Markdown...

## Heading 2

Đoạn văn...
```

**Quy tắc file name**: `YYYY-MM-DD-slug.md` (slug là `[a-z0-9-]`)

### `posts/_config.json` — Cấu hình site

```json
{
  "site": {
    "name": "Trung's Blog",
    "description": "Blog kỹ thuật cá nhân",
    "url": "https://username.github.io/blogger",
    "defaultOgImage": "/images/default-og.jpg"
  },
  "owner": {
    "name": "Nguyễn Văn Trung",
    "title": "Full-Stack Developer",
    "motto": "Code. Learn. Grow.",
    "location": "Hà Nội, Việt Nam",
    "education": "HUST – CNTT",
    "bio": "Tiểu sử cá nhân...",
    "avatar": "/images/avatar.jpg",
    "email": "hello@example.com",
    "social": {
      "github": "https://github.com/username",
      "linkedin": "https://linkedin.com/in/username",
      "facebook": "https://facebook.com/username",
      "discord": "https://discord.gg/invite"
    }
  },
  "skills": {
    "technical": [
      { "name": "React", "level": 90 },
      { "name": "Laravel", "level": 85 },
      { "name": "MySQL", "level": 80 }
    ],
    "soft": ["Teamwork", "Problem Solving", "Communication"]
  },
  "categories": [
    { "name": "Web Development", "color": "#3B82F6" },
    { "name": "IT Support", "color": "#10B981" },
    { "name": "DevOps", "color": "#F59E0B" }
  ],
  "projects": [
    {
      "name": "Personal Blogger",
      "description": "Blog cá nhân xây dựng bằng React + Vite",
      "image": "/images/projects/blogger.jpg",
      "technologies": ["React", "Vite", "Tailwind"],
      "github": "https://github.com/username/blogger",
      "demo": "https://username.github.io/blogger",
      "sortOrder": 1
    }
  ],
  "experiences": [
    {
      "organization": "Công ty ABC",
      "role": "Full-Stack Developer",
      "type": "work",
      "startDate": "2024-01",
      "endDate": null,
      "description": "Mô tả công việc..."
    }
  ],
  "contact": {
    "formspreeId": "xyzabc123",
    "adminEmail": "admin@example.com"
  },
  "giscus": {
    "repo": "username/blogger",
    "repoId": "R_kgDO...",
    "category": "Comments",
    "categoryId": "DIC_kwDO..."
  }
}
```

### Post Object (parsed từ Markdown)

```typescript
interface Post {
  slug: string;           // từ filename hoặc frontmatter
  title: string;
  date: string;           // ISO 8601
  category: string;
  tags: string[];
  excerpt: string;        // tối đa 150 ký tự
  thumbnail: string | null;
  published: boolean;
  content: string;        // raw Markdown
  readingTime: number;    // phút đọc ước tính
}
```

---

## Routes

Dùng `HashRouter` để tương thích GitHub Pages (không cần server config):

| Hash Route | Component | Mô tả |
|------------|-----------|-------|
| `#/` | HomePage | Trang chủ |
| `#/blog` | BlogPage | Danh sách bài viết |
| `#/blog/:slug` | PostPage | Chi tiết bài viết |
| `#/blog/category/:name` | CategoryPage | Lọc theo danh mục |
| `#/search?q=keyword` | SearchPage | Kết quả tìm kiếm |
| `#/portfolio` | PortfolioPage | Dự án |
| `#/experience` | ExperiencePage | Kinh nghiệm |
| `#/about` | AboutPage | Giới thiệu |
| `#/contact` | ContactPage | Liên hệ |
| `#/*` | NotFoundPage | 404 |

```jsx
// src/App.jsx
<HashRouter>
  <Routes>
    <Route path="/" element={<Layout />}>
      <Route index element={<HomePage />} />
      <Route path="blog" element={<BlogPage />} />
      <Route path="blog/:slug" element={<PostPage />} />
      <Route path="blog/category/:name" element={<CategoryPage />} />
      <Route path="search" element={<SearchPage />} />
      <Route path="portfolio" element={<PortfolioPage />} />
      <Route path="experience" element={<ExperiencePage />} />
      <Route path="about" element={<AboutPage />} />
      <Route path="contact" element={<ContactPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Route>
  </Routes>
</HashRouter>
```

---

## Components and Interfaces

### `src/lib/posts.js` — Post Loader

```javascript
// Dùng Vite's import.meta.glob để load tất cả Markdown files lúc build
const modules = import.meta.glob('/posts/*.md', { as: 'raw', eager: true });

export function getAllPosts() {
  return Object.entries(modules)
    .map(([filepath, raw]) => parsePost(filepath, raw))
    .filter(post => post.published)
    .sort((a, b) => new Date(b.date) - new Date(a.date));
}

export function getPostBySlug(slug) {
  return getAllPosts().find(p => p.slug === slug) || null;
}

export function getPostsByCategory(categoryName) {
  return getAllPosts().filter(p =>
    p.category.toLowerCase() === categoryName.toLowerCase()
  );
}

export function getRelatedPosts(post, limit = 5) {
  const all = getAllPosts().filter(p => p.slug !== post.slug);
  const scored = all.map(p => ({
    post: p,
    score: (p.tags.filter(t => post.tags.includes(t)).length * 3)
          + (p.category === post.category ? 1 : 0)
  }));
  return scored
    .sort((a, b) => b.score - a.score || new Date(b.post.date) - new Date(a.post.date))
    .slice(0, limit)
    .map(s => s.post);
}

function parsePost(filepath, raw) {
  const { data, content } = matter(raw);
  const filename = filepath.split('/').pop().replace('.md', '');
  const slug = data.slug || filename.replace(/^\d{4}-\d{2}-\d{2}-/, '');
  return {
    slug,
    title: data.title || '',
    date: data.date || '',
    category: data.category || 'Uncategorized',
    tags: data.tags || [],
    excerpt: (data.excerpt || content.slice(0, 150)).trim(),
    thumbnail: data.thumbnail || null,
    published: data.published !== false,
    content,
    readingTime: Math.ceil(content.split(/\s+/).length / 200),
  };
}
```

### `src/hooks/useTheme.js` — Theme Hook

```javascript
export function useTheme() {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') return true;
    if (saved === 'light') return false;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const toggle = () => setIsDark(prev => !prev);

  return { isDark, toggle };
}
```

### `src/lib/search.js` — Fuse.js Search

```javascript
let fuseInstance = null;

export function getSearchIndex() {
  if (fuseInstance) return fuseInstance;
  const posts = getAllPosts();
  fuseInstance = new Fuse(posts, {
    keys: [
      { name: 'title', weight: 3 },
      { name: 'excerpt', weight: 2 },
      { name: 'content', weight: 1 },
      { name: 'tags', weight: 2 },
    ],
    threshold: 0.3,
    includeScore: true,
    minMatchCharLength: 2,
  });
  return fuseInstance;
}

export function searchPosts(keyword) {
  if (!keyword || keyword.trim().length < 2) return [];
  return getSearchIndex().search(keyword).slice(0, 20).map(r => r.item);
}
```

### `SearchPage.jsx` — Trang tìm kiếm

```jsx
export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (query.trim().length < 2) {
      setError('Vui lòng nhập ít nhất 2 ký tự.');
      setResults([]);
    } else {
      setError('');
      setResults(searchPosts(query));
    }
  }, [query]);

  // render...
}
```

### `CommentSection.jsx` — Giscus

```jsx
export default function CommentSection({ slug }) {
  const { isDark } = useTheme();
  const config = useConfig(); // load từ _config.json

  return (
    <section>
      <h2>Bình luận</h2>
      <Giscus
        repo={config.giscus.repo}
        repoId={config.giscus.repoId}
        category={config.giscus.category}
        categoryId={config.giscus.categoryId}
        mapping="pathname"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="top"
        theme={isDark ? 'dark' : 'light'}
        lang="vi"
      />
    </section>
  );
}
```

### `ContactPage.jsx` — Formspree

```jsx
export default function ContactPage() {
  const config = useConfig();
  const [state, handleSubmit] = useForm(config.contact.formspreeId);

  if (state.succeeded) {
    return <p>Cảm ơn bạn đã liên hệ! Tôi sẽ phản hồi sớm nhất có thể.</p>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" required maxLength={100} />
      <input name="email" type="email" required maxLength={254} />
      <input name="subject" required maxLength={150} />
      <textarea name="message" required maxLength={2000} />
      {state.errors && <p>Có lỗi xảy ra, vui lòng thử lại.</p>}
      <button type="submit" disabled={state.submitting}>Gửi</button>
    </form>
  );
}
```

### `TableOfContents.jsx` — Auto TOC

```jsx
// Extract headings từ rendered Markdown HTML
export default function TableOfContents({ content }) {
  const headings = useMemo(() => extractHeadings(content), [content]);
  if (headings.length === 0) return null;

  return (
    <nav className="toc sticky top-4">
      <h3>Mục lục</h3>
      <ul>
        {headings.map(h => (
          <li key={h.id} className={h.level === 3 ? 'pl-4' : ''}>
            <a href={`#${h.id}`}>{h.text}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
```

---

## UI Design

### Trang chủ (HomePage)

```
┌────────────────────────────────────────────────────────┐
│  NAVBAR: </> Trung's Blog | [Blog][Portfolio][About]   │
│          [Experience][Contact] [🔍] [🌙]               │
├────────────────────────────────────────────────────────┤
│  HERO SECTION                                          │
│  [Avatar tròn]  Nguyễn Văn Trung                      │
│                 Full-Stack Developer                   │
│                 "Code. Learn. Grow."                   │
│                 📍 Hà Nội  🎓 HUST                    │
│                 [GitHub][LinkedIn][Facebook][Discord]  │
├────────────────────────────────────┬───────────────────┤
│  BÀI VIẾT MỚI NHẤT (2/3 col)      │  SIDEBAR (1/3)    │
│  [Card 1]  [Card 2]  [Card 3]     │  📝 Giới thiệu   │
│  [Card 4]  [Card 5]               │  ⚡ Kỹ năng      │
│               Xem tất cả →        │  📂 Danh mục     │
│                                    │  🕐 Gần đây      │
│  KỸ NĂNG NỔI BẬT                  │                   │
│  [React 90%][Laravel 85%]...      │                   │
│                                    │                   │
│  DỰ ÁN NỔI BẬT (3 projects đầu)  │                   │
└────────────────────────────────────┴───────────────────┘
│  FOOTER: Social links | Copyright                      │
└────────────────────────────────────────────────────────┘
```

### Article Card Component

```
┌──────────────────────────────────────────┐
│  [Thumbnail - object-cover loading=lazy] │
│  [Web Dev Badge #3B82F6]                 │
│  Tiêu đề bài viết                       │
│  Mô tả ngắn ≤150 ký tự...              │
│  📅 15/01/2024  ⏱ 5 phút đọc           │
│                          [Xem chi tiết →]│
└──────────────────────────────────────────┘
```

### Trang chi tiết bài viết (PostPage)

```
┌────────────────────────────────────────────────────────┐
│  [Thumbnail full-width]                                │
│  h1: Tiêu đề bài viết                                  │
│  [Web Dev] #React #JavaScript                          │
│  👤 Trung  •  15/01/2024  •  5 phút đọc              │
│  [Share: FB | Twitter | LinkedIn | Copy link]          │
├────────────────────────────────┬───────────────────────┤
│  NỘI DUNG (Markdown rendered)  │  TABLE OF CONTENTS   │
│                                │  (sticky top)         │
│  ## Heading 2                  │  ▸ Heading 2          │
│  Nội dung...                   │    ▸ Heading 3        │
│                                │  ▸ Heading 2          │
├────────────────────────────────┴───────────────────────┤
│  BÀI VIẾT LIÊN QUAN (≤5 cards)                        │
├────────────────────────────────────────────────────────┤
│  BÌNH LUẬN (Giscus widget)                            │
└────────────────────────────────────────────────────────┘
```

### Dark Mode

Tailwind `darkMode: 'class'` — class `dark` trên `<html>`:
- Light: `bg-white text-slate-900`
- Dark: `bg-slate-900 text-slate-100`
- Accent: `#3B82F6` (blue-500) cho cả 2 mode

---

## GitHub Actions Deploy

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  build-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run build
      - uses: actions/deploy-pages@v4
        with:
          artifact_name: github-pages
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist/
```

### `vite.config.js`

```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/blogger/',  // Tên repo GitHub
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          markdown: ['react-markdown', 'gray-matter', 'remark-gfm'],
        }
      }
    }
  }
});
```

---

## SEO

React Helmet Async cho meta tags động:

```jsx
// Trong mỗi page component
<Helmet>
  <title>{post.title} | Trung's Blog</title>
  <meta name="description" content={post.excerpt} />
  <meta property="og:title" content={post.title} />
  <meta property="og:description" content={post.excerpt} />
  <meta property="og:image" content={post.thumbnail || config.site.defaultOgImage} />
  <meta property="og:url" content={`${config.site.url}/#/blog/${post.slug}`} />
  <meta property="og:type" content="article" />
  <link rel="canonical" href={`${config.site.url}/#/blog/${post.slug}`} />
</Helmet>
```

**Lưu ý SEO với static site + HashRouter**: Các URL dạng `#/blog/...` không được Google index tốt. Nếu SEO là ưu tiên cao, có thể chuyển sang `BrowserRouter` + cấu hình `404.html` redirect.

---

## Performance

- **Code splitting**: React Router lazy load từng page (`React.lazy + Suspense`)
- **Image lazy loading**: `loading="lazy"` trên tất cả `<img>`
- **Search index**: Fuse.js khởi tạo lazy (lần đầu search mới build index)
- **Chunk splitting**: `manualChunks` trong vite.config.js tách vendor + markdown
- **Bài viết**: Load tất cả lúc build (SWR không cần thiết với static data)

---

## Correctness Properties

### Property 1: Slug bài viết là duy nhất và hợp lệ
*Với mọi* Markdown file trong `posts/`, slug được parse SHALL chỉ chứa `[a-z0-9-]`, độ dài ≥ 1, và không có 2 posts nào có cùng slug.
**Validates: Requirements 12.4**

### Property 2: Chỉ post có `published: true` được hiển thị
*Với mọi* post có `published: false` trong frontmatter, `getAllPosts()` SHALL không trả về post đó trong collection.
**Validates: Requirements 13.6, 13.7**

### Property 3: Search không xử lý keyword < 2 ký tự
*Với mọi* keyword có length < 2 hoặc chỉ chứa whitespace, `searchPosts()` SHALL trả về mảng rỗng `[]` và không query Fuse.js.
**Validates: Requirements 5.5**

### Property 4: Search trả về tối đa 20 kết quả
*Với mọi* keyword hợp lệ và bất kỳ số lượng bài viết nào, `searchPosts()` SHALL trả về tối đa 20 items.
**Validates: Requirements 5.3**

### Property 5: Bài viết liên quan không chứa chính bài viết đang xem
*Với mọi* post P, `getRelatedPosts(P)` SHALL không bao giờ trả về array chứa P.
**Validates: Requirements 3.3**

### Property 6: Theme được persist đúng trong localStorage
*Với mọi* trạng thái theme, sau khi `toggle()` được gọi, `localStorage['theme']` SHALL khớp với class `dark` trên `<html>`.
**Validates: Requirements 6.3, 6.4**

### Property 7: Bài viết sắp xếp mới nhất trước
*Với mọi* tập hợp posts có date khác nhau, `getAllPosts()` SHALL trả về array được sắp xếp sao cho `date[i] >= date[i+1]` cho mọi i.
**Validates: Requirements 2.2**

### Property 8: Excerpt không vượt quá 150 ký tự
*Với mọi* post, `excerpt` trong parsed post object SHALL có độ dài ≤ 150 ký tự.
**Validates: Requirements 2.1**

---

## Testing Strategy

```
tests/
├── lib/
│   ├── posts.test.js        # Parse frontmatter, getAllPosts, getRelatedPosts
│   ├── search.test.js       # searchPosts, validation
│   └── config.test.js       # Load config
├── hooks/
│   └── useTheme.test.js     # Theme persistence
├── property/
│   ├── slugProperty.test.js     # Property 1
│   ├── publishedProperty.test.js # Property 2
│   ├── searchProperty.test.js   # Property 3, 4
│   ├── relatedProperty.test.js  # Property 5
│   ├── themeProperty.test.js    # Property 6
│   ├── sortingProperty.test.js  # Property 7
│   └── excerptProperty.test.js  # Property 8
└── components/
    ├── ArticleCard.test.jsx
    ├── Sidebar.test.jsx
    └── SearchModal.test.jsx
```

**Property test template (Vitest):**

```javascript
// Tối thiểu 100 iterations mỗi property
import { describe, it, expect } from 'vitest';
import { fc } from '@fast-check/vitest'; // hoặc manual random gen

describe('Property 3: Search keyword validation', () => {
  it('returns empty array for keyword shorter than 2 chars', () => {
    const shortKeywords = ['', ' ', 'a', '  '];
    shortKeywords.forEach(kw => {
      expect(searchPosts(kw)).toEqual([]);
    });
  });

  it('never returns more than 20 results for any valid keyword', () => {
    const keywords = Array.from({ length: 100 }, () =>
      Math.random().toString(36).slice(2, 8)
    );
    keywords.forEach(kw => {
      expect(searchPosts(kw).length).toBeLessThanOrEqual(20);
    });
  });
});
```
