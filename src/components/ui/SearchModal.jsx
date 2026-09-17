import { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate, Link } from 'react-router-dom';
import { Search, Clock, X, ArrowRight } from 'lucide-react';
import { searchPosts } from '../../lib/search.js';

const RECENT_SEARCHES_KEY = 'recentSearches';
const MAX_RECENT = 5;
const MAX_LIVE_RESULTS = 5;
const MIN_QUERY_LENGTH = 2;

/**
 * Read recent searches from localStorage.
 * @returns {string[]}
 */
function getRecentSearches() {
  try {
    const raw = localStorage.getItem(RECENT_SEARCHES_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Persist a new search term to localStorage (deduplicated, max 5).
 * @param {string} term
 */
function addRecentSearch(term) {
  if (!term || term.trim().length < MIN_QUERY_LENGTH) return;
  const trimmed = term.trim();
  const current = getRecentSearches();
  const updated = [trimmed, ...current.filter(s => s !== trimmed)].slice(0, MAX_RECENT);
  try {
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
  } catch {
    // localStorage unavailable — silently ignore
  }
}

/**
 * SearchModal — full-screen overlay with live search + recent searches.
 *
 * Props:
 *   isOpen  {boolean}  — whether the modal is visible
 *   onClose {Function} — called when the modal should close
 */
export default function SearchModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const inputRef = useRef(null);

  // Load recent searches when modal opens; reset query
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setResults([]);
      setRecentSearches(getRecentSearches());
      // Auto-focus input after a brief paint delay
      requestAnimationFrame(() => {
        inputRef.current?.focus();
      });
    }
  }, [isOpen]);

  // Prevent body scroll while modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        onClose();
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Live search as the user types
  useEffect(() => {
    if (query.trim().length >= MIN_QUERY_LENGTH) {
      const hits = searchPosts(query);
      setResults(hits.slice(0, MAX_LIVE_RESULTS));
    } else {
      setResults([]);
    }
  }, [query]);

  /** Navigate to /search?q=term and close the modal */
  const navigateToSearch = useCallback(
    (term) => {
      const trimmed = (term || query).trim();
      if (!trimmed) return;
      addRecentSearch(trimmed);
      onClose();
      navigate(`/search?q=${encodeURIComponent(trimmed)}`);
    },
    [query, navigate, onClose]
  );

  /** Handle Enter key in the search input */
  function handleKeyDown(e) {
    if (e.key === 'Enter') {
      navigateToSearch(query);
    }
  }

  /** Click on backdrop → close */
  function handleBackdropClick(e) {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }

  if (!isOpen) return null;

  const showLiveResults = query.trim().length >= MIN_QUERY_LENGTH && results.length > 0;
  const showNoResults = query.trim().length >= MIN_QUERY_LENGTH && results.length === 0;
  const showRecent = query.trim().length < MIN_QUERY_LENGTH && recentSearches.length > 0;

  return createPortal(
    /* Backdrop */
    <div
      className="fixed inset-0 z-[9999] flex items-start justify-center px-4 pt-[15vh] bg-black/60 backdrop-blur-sm"
      onClick={handleBackdropClick}
      aria-modal="true"
      role="dialog"
      aria-label="Tìm kiếm bài viết"
    >
      {/* Modal panel */}
      <div
        className="w-full max-w-xl bg-white dark:bg-slate-800 rounded-xl shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Input row */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-200 dark:border-slate-700">
          <Search
            size={20}
            className="flex-shrink-0 text-slate-400 dark:text-slate-500"
          />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Tìm kiếm bài viết..."
            className="flex-1 bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 outline-none text-base"
            aria-label="Từ khoá tìm kiếm"
            autoComplete="off"
            spellCheck={false}
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              aria-label="Xóa từ khoá"
              className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            >
              <X size={16} />
            </button>
          )}
          <button
            onClick={onClose}
            aria-label="Đóng tìm kiếm"
            className="hidden sm:flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500 border border-slate-300 dark:border-slate-600 rounded px-2 py-1 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            Esc
          </button>
        </div>

        {/* Results / recent searches */}
        <div className="max-h-80 overflow-y-auto">
          {/* Live results */}
          {showLiveResults && (
            <ul role="listbox" aria-label="Kết quả tìm kiếm">
              {results.map(post => (
                <li key={post.slug}>
                  <Link
                    to={`/blog/${post.slug}`}
                    onClick={onClose}
                    className="flex items-start gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                  >
                    <Search
                      size={16}
                      className="flex-shrink-0 mt-0.5 text-blue-500"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                        {post.title}
                      </p>
                      {post.excerpt && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                          {post.excerpt.slice(0, 100)}
                        </p>
                      )}
                    </div>
                    <ArrowRight
                      size={14}
                      className="flex-shrink-0 mt-0.5 text-slate-400"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          )}

          {/* "No results" feedback */}
          {showNoResults && (
            <p className="px-4 py-6 text-center text-sm text-slate-500 dark:text-slate-400">
              Không tìm thấy kết quả nào cho{' '}
              <span className="font-medium text-slate-700 dark:text-slate-200">
                &ldquo;{query}&rdquo;
              </span>
            </p>
          )}

          {/* Recent searches */}
          {showRecent && (
            <div className="px-4 pt-3 pb-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500 mb-2">
                Tìm kiếm gần đây
              </p>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map(term => (
                  <button
                    key={term}
                    onClick={() => navigateToSearch(term)}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-900/40 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    <Clock size={12} />
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Empty state — nothing to show */}
          {!showLiveResults && !showNoResults && !showRecent && (
            <p className="px-4 py-6 text-center text-sm text-slate-400 dark:text-slate-500">
              Nhập từ khoá để tìm kiếm bài viết
            </p>
          )}
        </div>

        {/* Footer hint */}
        {(showLiveResults || (query.trim().length >= MIN_QUERY_LENGTH)) && (
          <div className="px-4 py-2 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
            <button
              onClick={() => navigateToSearch(query)}
              className="flex items-center gap-1.5 text-sm text-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
            >
              <Search size={14} />
              Xem tất cả kết quả cho &ldquo;{query}&rdquo;
            </button>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
