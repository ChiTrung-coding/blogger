import { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { Search, Menu, Pencil, Settings, X } from 'lucide-react';
import { useConfig } from '../../hooks/useConfig';
import ThemeToggle from '../ui/ThemeToggle';
import SearchModal from '../ui/SearchModal';

const NAV_LINKS = [
  { label: 'Trang chủ', to: '/' },
  { label: 'Bài viết', to: '/blog' },
  { label: 'Dự án', to: '/portfolio' },
  { label: 'Kinh nghiệm', to: '/experience' },
  { label: 'Giới thiệu', to: '/about' },
];

export default function Navbar() {
  const config = useConfig();
  const siteName = config?.site?.name || "Trung's Blog";

  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const menuRef = useRef(null);

  // Close mobile menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }

    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

  // Close mobile menu on route change (via ESC key)
  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setMenuOpen(false);
        setSearchOpen(false);
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navLinkClass = ({ isActive }) =>
    isActive
      ? 'text-blue-500 font-semibold transition-colors duration-200'
      : 'text-slate-700 dark:text-slate-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200';

  const mobileNavLinkClass = ({ isActive }) =>
    isActive
      ? 'block px-4 py-2 rounded-md text-blue-500 font-semibold bg-blue-50 dark:bg-blue-900/30 transition-colors duration-200'
      : 'block px-4 py-2 rounded-md text-slate-700 dark:text-slate-300 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-200';

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="mx-auto max-w-6xl px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <NavLink
              to="/"
              className="min-w-0 max-w-[calc(100vw-10rem)] truncate font-bold text-lg text-slate-900 dark:text-white hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200"
              onClick={() => setMenuOpen(false)}
            >
              <span className="text-blue-500">&lt;/&gt;</span>{' '}
              {siteName}
            </NavLink>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-6">
              {NAV_LINKS.map(({ label, to }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === '/'}
                  className={navLinkClass}
                >
                  {label}
                </NavLink>
              ))}
            </div>

            {/* Right Icons */}
            <div className="flex items-center gap-2">
              {/* Search Button */}
              <button
                onClick={() => setSearchOpen(true)}
                aria-label="Mở tìm kiếm"
                className="p-2 rounded-md text-slate-600 dark:text-slate-400 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-200"
              >
                <Search size={20} />
              </button>

              {/* Theme Toggle */}
              <ThemeToggle />

              <NavLink
                to="/editor"
                aria-label="Chỉnh sửa blog"
                title="Chỉnh sửa blog"
                className="hidden rounded-md p-2 text-slate-600 transition-colors hover:bg-slate-100 hover:text-blue-500 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-blue-400 sm:block"
              >
                <Pencil size={19} />
              </NavLink>

              <NavLink
                to="/admin"
                aria-label="Quản lý blog"
                title="Quản lý blog"
                className="hidden rounded-md p-2 text-slate-600 transition-colors hover:bg-slate-100 hover:text-blue-500 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-blue-400 sm:block"
              >
                <Settings size={19} />
              </NavLink>

              {/* Hamburger Button (mobile only) */}
              <button
                onClick={() => setMenuOpen(prev => !prev)}
                aria-label={menuOpen ? 'Đóng menu' : 'Mở menu'}
                aria-expanded={menuOpen}
                className="md:hidden p-2 rounded-md text-slate-600 dark:text-slate-400 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-200"
              >
                {menuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {menuOpen && (
          <div
            ref={menuRef}
            className="md:hidden border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-md"
          >
            <div className="px-2 py-3 space-y-1">
              {NAV_LINKS.map(({ label, to }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === '/'}
                  className={mobileNavLinkClass}
                  onClick={() => setMenuOpen(false)}
                >
                  {label}
                </NavLink>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Search Modal */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
