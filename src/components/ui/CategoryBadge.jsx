/**
 * CategoryBadge — pill badge for post categories.
 * Props:
 *   name  {string} - category label
 *   color {string} - hex background color (optional, defaults to #3B82F6)
 */
export default function CategoryBadge({ name, color = '#3B82F6' }) {
  return (
    <span
      className="category-badge"
      style={{ backgroundColor: color }}
    >
      {name}
    </span>
  );
}
