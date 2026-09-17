import { useState } from 'react';
import { MessageCircle, Phone, X } from 'lucide-react';
import { useConfig } from '../../hooks/useConfig';

function getZaloUrl(value) {
  const input = String(value || '').trim();
  if (!input) return '';
  if (/^https?:\/\//i.test(input)) return input;
  const phone = input.replace(/\D/g, '');
  return phone ? `https://zalo.me/${phone}` : '';
}

export default function ContactWidget() {
  const { owner } = useConfig();
  const contact = owner.contact || {};
  const links = [
    getZaloUrl(contact.zalo) && { label: 'Zalo', href: getZaloUrl(contact.zalo), icon: 'Z', className: 'bg-blue-600 hover:bg-blue-700' },
    contact.messenger && { label: 'Messenger', href: contact.messenger, icon: <MessageCircle size={20} />, className: 'bg-sky-500 hover:bg-sky-600' },
    contact.phone && { label: contact.phone, href: `tel:${contact.phone.replace(/\s+/g, '')}`, icon: <Phone size={20} />, className: 'bg-emerald-600 hover:bg-emerald-700' },
  ].filter(Boolean);
  const [isOpen, setIsOpen] = useState(false);

  if (links.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-3 z-50 flex max-w-[calc(100vw-1.5rem)] flex-col items-end gap-3 sm:bottom-5 sm:right-5">
      {isOpen && (
        <div className="flex flex-col items-end gap-2" aria-label="Contact options">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.href.startsWith('tel:') ? undefined : '_blank'}
              rel={link.href.startsWith('tel:') ? undefined : 'noopener noreferrer'}
              className={`inline-flex max-w-[calc(100vw-2.5rem)] items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition-transform hover:-translate-y-0.5 ${link.className}`}
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 font-bold">{link.icon}</span>
              <span className="max-w-48 truncate">{link.label}</span>
            </a>
          ))}
        </div>
      )}
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        aria-label={isOpen ? 'Close contact options' : 'Open contact options'}
        className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-slate-900 shadow-xl ring-1 ring-slate-200 transition-transform hover:scale-105 dark:bg-slate-800 dark:text-white dark:ring-slate-700"
      >
        {isOpen ? <X size={32} /> : <MessageCircle size={30} className="text-blue-600" />}
      </button>
    </div>
  );
}
