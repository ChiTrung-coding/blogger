export default function Toast({ message, tone = 'success' }) {
  if (!message) return null;

  const toneClasses = tone === 'error'
    ? 'border-red-200 bg-red-600 shadow-red-900/20'
    : tone === 'warning'
      ? 'border-amber-200 bg-amber-500 shadow-amber-900/20'
      : 'border-emerald-200 bg-emerald-600 shadow-emerald-900/20';

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed bottom-5 right-5 z-[60] max-w-[calc(100vw-2rem)] rounded-xl border px-4 py-3 text-sm font-medium text-white shadow-xl ${toneClasses}`}
    >
      {message}
    </div>
  );
}
