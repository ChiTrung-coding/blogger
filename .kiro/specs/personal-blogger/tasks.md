# Implementation Plan: Personal Blogger (React + Vite + GitHub Pages)

## Overview

Xây dựng trang blog cá nhân dạng static site bằng React 18 + Vite 5 + Tailwind CSS, deploy lên GitHub Pages qua GitHub Actions. Bài viết lưu dưới dạng Markdown files trong repo. Không có backend hay database.

---

## Tasks

- [x] 1. Khởi tạo dự án
  - [x] 1.1 Khởi tạo Vite + React project
    - Chạy `npm create vite@latest blogger -- --template react` trong thư mục `d:\blogger\`
    - Cài đặt dependencies: `npm install react-router-dom react-markdown react-helmet-async gray-matter fuse.js lucide-react rehype-highlight rehype-slug remark-gfm`
    - Cài đặt devDependencies: `npm install -D tailwindcss postcss autoprefixer vitest @testing-library/react @testing-library/jest-dom jsdom`
    - Xóa boilerplate mặc định của Vite (src/App.css, src/assets/react.svg, nội dung App.jsx, index.css)
    - _Yêu cầu: 1.3, 1.4_

  - [x] 1.2 Cấu hình Tailwind CSS
    - Chạy `npx tailwindcss init -p` để tạo `tailwind.config.js` và `postcss.config.js`
    - Cập nhật `tailwind.config.js`: bật `darkMode: 'class'`, cấu hình `content` paths cho `./index.html` và `./src/**/*.{js,jsx}`, mở rộng colors với dark navy/blue theme
    - Tạo `src/styles/app.css`: thêm `@tailwind base; @tailwind components; @tailwind utilities;` và custom styles cho prose, code blocks, TOC, timeline
    - Import `app.css` trong `src/main.jsx`
    - _Yêu cầu: 6.2, 11.1_

  - [x] 1.3 Cấu hình Vite và Vitest
    - Cập nhật `vite.config.js`: thêm `base: '/blogger/'` (tên repo), cấu hình `manualChunks` để tách vendor + markdown bundle, bật `assetsInclude: ['**/*.md']`
    - Tạo `vitest.config.js`: cấu hình environment `jsdom`, setupFiles cho `@testing-library/jest-dom`
    - Cập nhật `package.json` scripts: thêm `"test": "vitest"`, `"test:run": "vitest run"`, `"preview": "vite preview"`
    - _Yêu cầu: 15.1_

- [x] 2. Cấu hình dữ liệu và nội dung
  - [x] 2.1 Tạo cấu trúc thư mục `posts/` và file cấu hình
    - Tạo thư mục `posts/` ở root project
    - Tạo `posts/_config.json` với đầy đủ cấu trúc: site (name, description, url, defaultOgImage), owner (name, title, motto, location, education, bio, avatar, email, social), skills (technical array với level, soft array), categories (name + color), projects (array), experiences (array), contact (formspreeId, adminEmail), giscus (repo, repoId, category, categoryId)
    - Tạo 3-5 bài viết mẫu trong `posts/`: format `YYYY-MM-DD-slug.md` với frontmatter đầy đủ (title, slug, date, category, tags, excerpt, thumbnail, published)
    - Tạo thư mục `public/images/` với `default-og.jpg` và `avatar.jpg` placeholder
    - _Yêu cầu: 1.1, 1.2, 2.1, 9.1_

  - [x] 2.2 Tạo `src/lib/posts.js` — Post Loader
    - Dùng `import.meta.glob('/posts/*.md', { as: 'raw', eager: true })` để load tất cả Markdown files lúc build
    - Implement `parsePost(filepath, raw)`: dùng `gray-matter` parse frontmatter, extract slug từ filename (bỏ `YYYY-MM-DD-` prefix) hoặc từ frontmatter, tính `readingTime`, trim excerpt xuống ≤150 ký tự
    - Implement `getAllPosts()`: filter `published !== false`, sort theo date DESC
    - Implement `getPostBySlug(slug)`: trả về post hoặc null
    - Implement `getPostsByCategory(name)`: filter theo category (case-insensitive)
    - Implement `getRelatedPosts(post, limit=5)`: score = (tag overlap × 3) + (category match × 1), sort DESC, exclude post hiện tại
    - Implement `getAllCategories()`: unique categories với post count
    - Implement `getLatestPosts(limit=5)`: N bài mới nhất
    - _Yêu cầu: 1.5, 2.2, 2.3, 3.3_

  - [x] 2.3 Tạo `src/lib/config.js` và `src/lib/search.js`
    - Tạo `src/lib/config.js`: import `_config.json`, export `getConfig()` và helper `getSiteUrl()`
    - Tạo `src/lib/search.js`: implement `searchPosts(keyword)` dùng Fuse.js với keys `[{name:'title',weight:3},{name:'excerpt',weight:2},{name:'content',weight:1},{name:'tags',weight:2}]`, threshold 0.3, minMatchCharLength 2; return `[]` nếu keyword length < 2 hoặc chỉ whitespace; return tối đa 20 kết quả; lazy init Fuse instance
    - _Yêu cầu: 5.2, 5.3, 5.5_

- [x] 3. Hooks
  - [x] 3.1 Tạo `src/hooks/useTheme.js`
    - Implement `useTheme()` hook: init state từ `localStorage.getItem('theme')`, fallback `window.matchMedia('(prefers-color-scheme: dark)').matches`
    - useEffect: toggle class `dark` trên `document.documentElement`, ghi `localStorage.setItem('theme', ...)`
    - Export `{ isDark, toggle }`
    - _Yêu cầu: 6.1, 6.2, 6.3, 6.4, 6.5_

  - [x] 3.2 Tạo `src/hooks/usePosts.js` và `src/hooks/useConfig.js`
    - `usePosts(options)`: wrap `getAllPosts()` với optional filter (category, tag, limit)
    - `useConfig()`: return parsed config từ `src/lib/config.js`
    - _Yêu cầu: 1.7, 2.5_

- [x] 4. Layout Components
  - [x] 4.1 Tạo `src/components/layout/Navbar.jsx`
    - Logo: `</> Trung's Blog` (lấy từ config)
    - Nav links: Trang chủ, Bài viết, Dự án, Kinh nghiệm, Giới thiệu, Liên hệ (dùng `NavLink` với active style)
    - Icons bên phải: 🔍 (mở SearchModal), ThemeToggle
    - Mobile: hamburger menu (useState toggle), menu overlay đóng khi click bên ngoài
    - Responsive: desktop inline links, mobile hamburger + dropdown
    - _Yêu cầu: 1.3, 1.4, 11.2_

  - [x] 4.2 Tạo `src/components/layout/Footer.jsx`
    - Social links (GitHub, LinkedIn, Facebook, Discord) từ config, target `_blank`
    - Copyright và tên blog
    - _Yêu cầu: 1.2_

  - [x] 4.3 Tạo `src/components/layout/Sidebar.jsx`
    - Widget 1 — Giới thiệu: avatar tròn + bio ngắn từ config
    - Widget 2 — Kỹ năng chính: top 5 technical skills dạng tags
    - Widget 3 — Danh mục: list categories với post count, link đến CategoryPage
    - Widget 4 — Bài viết gần đây: 5 bài mới nhất (thumbnail + title + date)
    - _Yêu cầu: 1.7, 2.5_

  - [x] 4.4 Tạo `src/App.jsx` với Router và Layout wrapper
    - Setup `HashRouter` + `Routes`
    - `Layout` component: `<Navbar>` + `<Outlet>` + `<Footer>`
    - Lazy load tất cả Page components với `React.lazy + Suspense`
    - Wrap app trong `HelmetProvider` (react-helmet-async)
    - _Yêu cầu: 1.3, 1.4_

- [x] 5. UI Components
  - [x] 5.1 Tạo `src/components/ui/ArticleCard.jsx`
    - Props: `post` object
    - Thumbnail với `loading="lazy"` + `object-cover`, fallback nếu không có thumbnail
    - CategoryBadge với màu từ config categories
    - Title (h3), excerpt (`Str.slice(0, 150)`), date (dd/mm/yyyy), reading time
    - Link "Xem chi tiết →" đến `/blog/:slug`
    - _Yêu cầu: 2.1, 11.4_

  - [x] 5.2 Tạo `src/components/ui/CategoryBadge.jsx` và `src/components/ui/ThemeToggle.jsx`
    - `CategoryBadge`: pill badge với `backgroundColor` từ config categories (fallback #3B82F6)
    - `ThemeToggle`: dùng `useTheme()`, icon 🌙 khi light mode / ☀️ khi dark mode
    - _Yêu cầu: 2.1, 6.1_

  - [x] 5.3 Tạo `src/components/ui/SearchModal.jsx`
    - Overlay modal (Portal hoặc absolute), đóng bằng Escape hoặc click bên ngoài
    - Input search, onChange → navigate đến `/search?q=value`
    - Hiển thị recent searches (localStorage) hoặc live search results
    - _Yêu cầu: 5.1_

  - [x] 5.4 Tạo `src/components/ui/TableOfContents.jsx`
    - Extract headings h2/h3 từ Markdown content bằng regex
    - Render danh sách anchors với indent cho h3
    - Ẩn hoàn toàn nếu không có heading nào
    - Sticky positioning trên desktop
    - _Yêu cầu: 3.2_

  - [x] 5.5 Tạo `src/components/blog/ShareButtons.jsx` và `src/components/blog/CommentSection.jsx`
    - `ShareButtons`: buttons chia sẻ Facebook, Twitter/X, LinkedIn dùng `window.open()` với URL bài viết + title encode; nút Copy link
    - `CommentSection`: wrapper cho Giscus React component (`@giscus/react`), nhận config từ `useConfig()`, theme theo `useTheme()`
    - _Yêu cầu: 3.5, 4.1_

- [ ] 6. Pages — Trang chủ và Blog
  - [x] 6.1 Tạo `src/pages/HomePage.jsx`
    - Hero Section: avatar tròn, tên, chức danh, motto, location, education, social links (GitHub/LinkedIn/Facebook/Discord) target `_blank`
    - Bài viết mới nhất: `getLatestPosts(5)` → render `<ArticleCard>` grid, link "Xem tất cả →" đến `/blog`
    - Kỹ năng nổi bật: progress bars từ `skills.technical` (tối đa 6 skills)
    - Dự án nổi bật: 3 projects đầu (sort by sortOrder)
    - `<Sidebar>` bên phải trên desktop
    - Helmet: meta title, description
    - Layout 2/3 + 1/3 trên desktop, stack trên mobile
    - _Yêu cầu: 1.1, 1.2, 1.5, 1.6, 1.7_

  - [x] 6.2 Tạo `src/pages/BlogPage.jsx`
    - Load tất cả published posts, filter theo `?category=` query param
    - Filter tabs/buttons cho categories, default "Tất cả"
    - Grid `<ArticleCard>` components
    - Thông báo "Không có bài viết nào trong danh mục này." khi rỗng
    - `<Sidebar>` bên phải trên desktop
    - Helmet: meta tags
    - _Yêu cầu: 2.2, 2.3, 2.5, 2.6_

  - [ ] 6.3 Tạo `src/pages/PostPage.jsx`
    - Load post bằng `getPostBySlug(slug)` từ URL params, redirect 404 nếu không tìm thấy
    - Thumbnail full-width, h1 tiêu đề, category badge + tags, author info + date + reading time
    - `<ShareButtons>` với URL và title
    - Layout 2 cột: content bên trái + `<TableOfContents>` sticky bên phải (ẩn trên mobile)
    - Render Markdown bằng `<ReactMarkdown>` với plugins: `remarkGfm`, `rehypeHighlight`, `rehypeSlug`
    - Bài viết liên quan: `getRelatedPosts(post, 5)` → grid cards (ẩn section nếu rỗng)
    - `<CommentSection>` dưới cùng
    - Helmet: meta title, description, OG tags đầy đủ (og:type = article)
    - _Yêu cầu: 3.1, 3.2, 3.3, 3.4, 3.5, 12.1, 12.2_

  - [ ] 6.4 Tạo `src/pages/CategoryPage.jsx` và `src/pages/SearchPage.jsx`
    - `CategoryPage`: nhận `:name` từ URL params, gọi `getPostsByCategory(name)`, render grid cards + category title, thông báo nếu rỗng
    - `SearchPage`: đọc `?q=` từ `useSearchParams()`, validate (< 2 ký tự → hiển thị lỗi), gọi `searchPosts(q)`, hiển thị tối đa 20 kết quả (title, excerpt ≤160 ký tự, date), thông báo "Không tìm thấy kết quả..." khi rỗng
    - _Yêu cầu: 2.3, 5.2, 5.3, 5.4, 5.5, 5.6_

- [ ] 7. Pages — Portfolio, About, Contact
  - [~] 7.1 Tạo `src/pages/PortfolioPage.jsx`
    - Load projects từ config, sắp xếp theo `sortOrder` ASC
    - Grid 3 cột (responsive), mỗi card: ảnh, tên, mô tả (≤200 ký tự), technology tags, links GitHub + Demo (target `_blank`)
    - _Yêu cầu: 7.1, 7.2, 7.3_

  - [~] 7.2 Tạo `src/pages/ExperiencePage.jsx`
    - Load experiences từ config, sort theo `startDate` DESC
    - Timeline dọc: phân biệt màu + icon cho type "work" (💼 màu xanh) và "education" (🎓 màu tím)
    - `endDate: null` → hiển thị "Hiện tại"
    - Format date: "MM/YYYY"
    - Thông báo "Chưa có thông tin kinh nghiệm." khi mảng rỗng
    - _Yêu cầu: 8.1, 8.2, 8.3, 8.4_

  - [~] 7.3 Tạo `src/pages/AboutPage.jsx`
    - Avatar, bio (≤1000 ký tự)
    - Technical skills: progress bars với label + level%, tối đa 20
    - Soft skills: tags, tối đa 10
    - Link đến `/contact`, social links (target `_blank`)
    - _Yêu cầu: 9.1, 9.2, 9.3_

  - [~] 7.4 Tạo `src/pages/ContactPage.jsx`
    - Cài đặt `@formspree/react`: `npm install @formspree/react`
    - Form với fields: name (max 100), email (email, max 254), subject (max 150), message (max 2000)
    - Client-side validation với inline errors
    - Dùng `useForm(formspreeId)` từ `@formspree/react`
    - State succeeded → thông báo thành công; `state.errors` → thông báo lỗi + giữ nguyên input
    - Hiển thị contact email + social links cạnh form
    - _Yêu cầu: 10.1, 10.2, 10.3, 10.4, 10.5_

  - [~] 7.5 Tạo `src/pages/NotFoundPage.jsx`
    - Thông báo 404, link về trang chủ
    - _Yêu cầu: implicit UX_

- [~] 8. Checkpoint 1 — Kiểm tra cơ bản
  Chạy `npm run dev`, kiểm tra trang chủ render đúng, navigation hoạt động, dark mode toggle, đọc Markdown files. Chạy `npm run test` — đảm bảo không có lỗi. Hỏi người dùng nếu có vấn đề.

- [ ] 9. GitHub Actions và Deploy
  - [~] 9.1 Tạo `.github/workflows/deploy.yml`
    - Trigger: push to `main` branch
    - Steps: checkout → setup Node 20 → npm ci → npm run build → upload artifact `dist/` → deploy to GitHub Pages
    - Cấu hình GitHub Pages trong repo Settings: Source = GitHub Actions
    - _Yêu cầu: 12.3 (sitemap auto-update)_

  - [~] 9.2 Tạo `public/404.html` để hỗ trợ SPA routing trên GitHub Pages
    - Script redirect từ 404 về `index.html` với hash routing
    - Đảm bảo direct URL access hoạt động
    - _Yêu cầu: 11.1_

- [ ] 10. SEO hoàn thiện
  - [~] 10.1 Thêm Helmet meta tags vào tất cả page components
    - Mỗi page: meta title (≤60 ký tự), meta description (≤160 ký tự), canonical URL
    - PostPage: OG tags đầy đủ (og:title, og:description, og:image, og:url, og:type=article)
    - Trang không có thumbnail → dùng `defaultOgImage` từ config
    - Đảm bảo mỗi page có đúng 1 thẻ h1
    - _Yêu cầu: 12.1, 12.2, 12.5, 12.6_

  - [~] 10.2 Sinh sitemap.xml lúc build
    - Tạo script `scripts/generate-sitemap.js`: đọc tất cả published posts, sinh `public/sitemap.xml` với static URLs + post URLs (lastmod = file mtime)
    - Thêm vào `package.json` scripts: `"build": "node scripts/generate-sitemap.js && vite build"`
    - _Yêu cầu: 12.3_

- [ ] 11. Responsive và Theme Toggle hoàn thiện
  - [~] 11.1 Kiểm tra Responsive Design trên tất cả breakpoints
    - Mobile (< 768px): hamburger menu, 1 cột layout, Sidebar xuống dưới content
    - Tablet (768px–1024px): 2 cột thu gọn
    - Desktop (> 1024px): 2/3 + 1/3 layout
    - Không có horizontal scrollbar ở bất kỳ breakpoint nào
    - Tất cả ảnh có `object-fit: cover`, không bị méo
    - _Yêu cầu: 11.1, 11.2, 11.3, 11.4_

  - [~] 11.2 Kiểm tra Dark/Light Mode toàn bộ ứng dụng
    - Tất cả components có Tailwind dark classes đúng
    - Giscus comment widget đổi theme theo dark/light
    - Không có flash of unstyled content (FOUC) khi load
    - _Yêu cầu: 6.2, 6.3, 6.4, 6.5_

- [ ] 12. Property-Based Tests
  - [~] 12.1 Viết property tests cho `src/lib/posts.js` (Property 1, 2, 7, 8)
    - Tạo `tests/property/postsProperty.test.js`
    - **Property 1**: Với 100 filenames ngẫu nhiên, `parsePost()` trả về slug chỉ chứa `[a-z0-9-]`
    - **Property 2**: Với mọi post có `published: false`, `getAllPosts()` không trả về post đó
    - **Property 7**: `getAllPosts()` luôn sắp xếp DESC theo date
    - **Property 8**: Excerpt của mọi post có length ≤ 150
    - _Validates: Yêu cầu 2.1, 2.2, 12.4, 13.6_

  - [~] 12.2 Viết property tests cho `src/lib/search.js` (Property 3, 4)
    - Tạo `tests/property/searchProperty.test.js`
    - **Property 3**: 100 keywords < 2 ký tự → `searchPosts()` luôn trả về `[]`
    - **Property 4**: 100 keywords hợp lệ → `searchPosts()` luôn trả về ≤ 20 items
    - _Validates: Yêu cầu 5.3, 5.5_

  - [~] 12.3 Viết property tests cho related posts và theme (Property 5, 6)
    - Tạo `tests/property/relatedProperty.test.js`
    - **Property 5**: Với 50 posts ngẫu nhiên, `getRelatedPosts(post)` không bao giờ chứa `post`
    - Tạo `tests/property/themeProperty.test.js`
    - **Property 6**: Với 100 toggle calls, `localStorage['theme']` luôn khớp với class `dark` trên html element
    - _Validates: Yêu cầu 3.3, 6.3_

- [~] 13. Checkpoint cuối — Kiểm tra toàn bộ
  Chạy `npm run test:run` — tất cả tests pass. Chạy `npm run build` — build thành công không có lỗi. Kiểm tra `dist/` có `index.html`, `sitemap.xml`. Test thủ công: trang chủ, bài viết, portfolio, search, dark mode, mobile responsive. Hỏi người dùng nếu có vấn đề.

---

## Notes

- Bài viết thêm mới bằng cách tạo file `posts/YYYY-MM-DD-slug.md` rồi push lên GitHub → GitHub Actions tự build và deploy
- Cập nhật cấu hình (skills, projects, experiences) trong `posts/_config.json` rồi push
- Comment dùng Giscus (cần bật GitHub Discussions trong repo settings)
- Form liên hệ dùng Formspree (cần tạo account free tại formspree.io)
- Property tests chạy ≥ 100 iterations với input ngẫu nhiên

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1"] },
    { "id": 1, "tasks": ["1.2", "1.3"] },
    { "id": 2, "tasks": ["2.1"] },
    { "id": 3, "tasks": ["2.2", "2.3"] },
    { "id": 4, "tasks": ["3.1", "3.2"] },
    { "id": 5, "tasks": ["4.1", "4.2", "4.3"] },
    { "id": 6, "tasks": ["4.4"] },
    { "id": 7, "tasks": ["5.1", "5.2", "5.3", "5.4", "5.5"] },
    { "id": 8, "tasks": ["6.1", "6.2", "6.3", "6.4"] },
    { "id": 9, "tasks": ["7.1", "7.2", "7.3", "7.4", "7.5"] },
    { "id": 10, "tasks": ["9.1", "9.2"] },
    { "id": 11, "tasks": ["10.1", "10.2"] },
    { "id": 12, "tasks": ["11.1", "11.2"] },
    { "id": 13, "tasks": ["12.1", "12.2", "12.3"] }
  ]
}
```
