import React, { Suspense } from 'react';
import { HashRouter, Routes, Route, Outlet } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ProtectedAdminRoute from './components/auth/ProtectedAdminRoute';

// Lazy load all page components for code splitting
const HomePage       = React.lazy(() => import('./pages/HomePage'));
const BlogPage       = React.lazy(() => import('./pages/BlogPage'));
const PostPage       = React.lazy(() => import('./pages/PostPage'));
const CategoryPage   = React.lazy(() => import('./pages/CategoryPage'));
const SearchPage     = React.lazy(() => import('./pages/SearchPage'));
const PortfolioPage  = React.lazy(() => import('./pages/PortfolioPage'));
const ExperiencePage = React.lazy(() => import('./pages/ExperiencePage'));
const AboutPage      = React.lazy(() => import('./pages/AboutPage'));
const ContactPage    = React.lazy(() => import('./pages/ContactPage'));
const NotFoundPage   = React.lazy(() => import('./pages/NotFoundPage'));
const EditorPage     = React.lazy(() => import('./pages/EditorPage'));
const AdminPage      = React.lazy(() => import('./pages/AdminPage'));
const LoginPage      = React.lazy(() => import('./pages/LoginPage'));

const SuspenseFallback = (
  <div className="min-h-screen flex items-center justify-center">
    Đang tải...
  </div>
);

function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
      <Navbar />
      <main className="flex-1">
        <Suspense fallback={SuspenseFallback}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <HelmetProvider>
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
            <Route path="editor" element={<EditorPage />} />
            <Route path="admin/login" element={<LoginPage />} />
            <Route path="admin" element={<ProtectedAdminRoute><AdminPage /></ProtectedAdminRoute>} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </HashRouter>
    </HelmetProvider>
  );
}
