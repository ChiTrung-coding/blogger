import { useState } from 'react';
import { Share2 } from 'lucide-react';

/**
 * ShareButtons — Các nút chia sẻ bài viết lên mạng xã hội + copy link.
 *
 * @param {Object} props
 * @param {string} props.url   - URL đầy đủ của bài viết
 * @param {string} props.title - Tiêu đề bài viết
 */
export default function ShareButtons({ url, title }) {
  const [copied, setCopied] = useState(false);

  const windowFeatures = 'width=600,height=400,noopener,noreferrer';

  function shareToFacebook() {
    window.open(
      'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(url),
      '_blank',
      windowFeatures
    );
  }

  function shareToTwitter() {
    window.open(
      'https://twitter.com/intent/tweet?text=' +
        encodeURIComponent(title) +
        '&url=' +
        encodeURIComponent(url),
      '_blank',
      windowFeatures
    );
  }

  function shareToLinkedIn() {
    window.open(
      'https://www.linkedin.com/shareArticle?mini=true&url=' +
        encodeURIComponent(url) +
        '&title=' +
        encodeURIComponent(title),
      '_blank',
      windowFeatures
    );
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback nếu clipboard API không khả dụng
      const textarea = document.createElement('textarea');
      textarea.value = url;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  const btnBase =
    'inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-900';

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Label */}
      <span className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 dark:text-slate-400">
        <Share2 size={16} />
        Chia sẻ:
      </span>

      {/* Facebook */}
      <button
        type="button"
        onClick={shareToFacebook}
        aria-label="Chia sẻ lên Facebook"
        className={`${btnBase} bg-[#1877F2] hover:bg-[#166FE5] text-white focus:ring-[#1877F2]`}
      >
        {/* Facebook SVG icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-4 h-4"
          aria-hidden="true"
        >
          <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.235 2.686.235v2.97h-1.513c-1.491 0-1.956.93-1.956 1.883v2.273h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
        </svg>
        Facebook
      </button>

      {/* Twitter / X */}
      <button
        type="button"
        onClick={shareToTwitter}
        aria-label="Chia sẻ lên Twitter/X"
        className={`${btnBase} bg-black hover:bg-slate-800 text-white focus:ring-slate-700`}
      >
        {/* X (Twitter) SVG icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-4 h-4"
          aria-hidden="true"
        >
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
        Twitter/X
      </button>

      {/* LinkedIn */}
      <button
        type="button"
        onClick={shareToLinkedIn}
        aria-label="Chia sẻ lên LinkedIn"
        className={`${btnBase} bg-[#0A66C2] hover:bg-[#095CB5] text-white focus:ring-[#0A66C2]`}
      >
        {/* LinkedIn SVG icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-4 h-4"
          aria-hidden="true"
        >
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
        LinkedIn
      </button>

      {/* Copy link */}
      <button
        type="button"
        onClick={copyLink}
        aria-label="Sao chép liên kết bài viết"
        className={`${btnBase} ${
          copied
            ? 'bg-green-500 hover:bg-green-600 text-white focus:ring-green-500'
            : 'bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-200 focus:ring-slate-400'
        }`}
      >
        {copied ? (
          <>
            {/* Check icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              className="w-4 h-4"
              aria-hidden="true"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Đã sao chép!
          </>
        ) : (
          <>
            {/* Copy icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              className="w-4 h-4"
              aria-hidden="true"
            >
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
            Copy link
          </>
        )}
      </button>
    </div>
  );
}
