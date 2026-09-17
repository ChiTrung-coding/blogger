import { useMemo } from 'react';

/**
 * Generates a URL-friendly anchor id from a heading text,
 * matching rehype-slug's behavior.
 * @param {string} text - Raw heading text
 * @returns {string} - Slugified id
 */
function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')        // spaces → hyphens
    .replace(/[^a-z0-9-]/g, ''); // remove non-[a-z0-9-] chars
}

/**
 * Extracts h2 and h3 headings from a raw Markdown string.
 * @param {string} content - Raw Markdown content
 * @returns {{ id: string, text: string, level: number }[]}
 */
function extractHeadings(content) {
  if (!content) return [];

  const headingRegex = /^(#{2,3})\s+(.+)$/gm;
  const headings = [];
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length; // 2 or 3
    const text = match[2].trim();
    const id = slugify(text);

    if (id) {
      headings.push({ id, text, level });
    }
  }

  return headings;
}

/**
 * TableOfContents component — renders a sticky TOC from Markdown headings.
 *
 * @param {{ content: string }} props
 * @returns {JSX.Element|null}
 */
export default function TableOfContents({ content }) {
  const headings = useMemo(() => extractHeadings(content), [content]);

  if (headings.length === 0) return null;

  return (
    <nav className="toc sticky top-4">
      <h3>Mục lục</h3>
      <ul>
        {headings.map((heading) => (
          <li
            key={`${heading.id}-${heading.level}`}
            className={heading.level === 3 ? 'toc-h3' : ''}
          >
            <a href={`#${heading.id}`}>{heading.text}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
