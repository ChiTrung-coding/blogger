import { GitBranch, Share2, MessageCircle } from 'lucide-react';
import { useConfig } from '../../hooks/useConfig';

/**
 * Footer component — social links + copyright
 * Social icons: GitHub, LinkedIn, Facebook, Discord (MessageCircle)
 * Reads config from useConfig() hook
 */
export default function Footer() {
  const config = useConfig();
  const { site, owner } = config;
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      label: 'GitHub',
      href: owner.social?.github,
      icon: GitBranch,
    },
    {
      label: 'Zalo',
      href: owner.social?.zalo ? `https://zalo.me/${String(owner.social.zalo).replace(/\D/g, '')}` : '',
      icon: MessageCircle,
    },
    {
      label: 'Facebook',
      href: owner.social?.facebook,
      icon: Share2,
    },
    {
      label: 'Discord',
      href: owner.social?.discord,
      icon: MessageCircle,
    },
  ].filter((link) => link.href);

  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col items-center gap-4">
          {/* Social links */}
          <div className="flex items-center gap-4">
            {socialLinks.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="text-slate-500 hover:text-blue-500 dark:text-slate-400 dark:hover:text-blue-400 transition-colors duration-200"
              >
                <Icon size={22} />
              </a>
            ))}
          </div>

          {/* Copyright */}
          <p className="text-sm text-slate-500 dark:text-slate-400">
            &copy; {currentYear}{' '}
            <span className="font-medium text-slate-700 dark:text-slate-300">
              {site.name}
            </span>
            . All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
