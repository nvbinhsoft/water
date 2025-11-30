import { Link } from 'react-router-dom';
import { PostSummary } from '../types/api';
import { TagPill } from './TagPill';
import { PostMeta } from './PostMeta';

interface Props {
  post: PostSummary;
}

export const PostCard = ({ post }: Props) => (
  <article className="group rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg dark:border-slate-800/80 dark:bg-slate-900/80">
    <Link to={`/posts/${post.slug}`} className="block space-y-3">
      <div className="flex items-start justify-between gap-4">
        <h2 className="text-2xl font-semibold text-slate-900 transition group-hover:text-indigo-600 dark:text-slate-50">
          {post.title}
        </h2>
        <span className="mt-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600 dark:bg-slate-800 dark:text-slate-200">
          {post.status === 'PUBLISHED' ? 'Published' : 'Draft'}
        </span>
      </div>
      <p className="text-slate-600 dark:text-slate-300">{post.excerpt}</p>
    </Link>
    <div className="mt-4 flex flex-wrap items-center gap-2">
      {post.tags?.map((tag) => (
        <TagPill key={tag.id} tag={tag} />
      ))}
    </div>
    <div className="mt-4">
      <PostMeta publishedAt={post.publishedAt} readTimeMinutes={post.readTimeMinutes} status={post.status} />
    </div>
  </article>
);
