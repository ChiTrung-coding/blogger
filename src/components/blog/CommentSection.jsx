import Giscus from '@giscus/react';
import { useConfig } from '../../hooks/useConfig';
import { useTheme } from '../../hooks/useTheme';

/**
 * CommentSection — Wrapper cho Giscus comment widget (GitHub Discussions).
 *
 * Config Giscus được lấy từ posts/_config.json qua useConfig().
 * Theme tự động đổi theo dark/light mode của trang.
 *
 * @param {Object} props
 * @param {string} props.slug - Slug bài viết (context, không truyền trực tiếp vào Giscus)
 */
export default function CommentSection({ slug }) {
  const config = useConfig();
  const { isDark } = useTheme();

  const { repo, repoId, category, categoryId } = config.giscus || {};

  return (
    <section
      className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-700"
      aria-label="Bình luận"
    >
      <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">
        Bình luận
      </h2>

      <Giscus
        repo={repo}
        repoId={repoId}
        category={category}
        categoryId={categoryId}
        mapping="pathname"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="top"
        theme={isDark ? 'dark' : 'light'}
        lang="vi"
        loading="lazy"
      />
    </section>
  );
}
