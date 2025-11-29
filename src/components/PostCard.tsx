import { Link } from 'react-router-dom';
import { PostSummary } from '../types/api';
import { TagPill } from './TagPill';
import { PostMeta } from './PostMeta';

interface Props {
  post: PostSummary;
}

export const PostCard = ({ post }: Props) => (
  <article className="rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/70">
    <Link to={`/posts/${post.slug}`} className="block">
      <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">{post.title}</h2>
      <p className="mt-2 text-slate-600 dark:text-slate-300">{post.excerpt}</p>
    </Link>
    <div className="mt-4 flex flex-wrap gap-2">
      {post.tags?.map((tag) => (
        <TagPill key={tag.id} tag={tag} />
      ))}
    </div>
    <div className="mt-3">
      <PostMeta publishedAt={post.publishedAt} readTimeMinutes={post.readTimeMinutes} status={post.status} />
    </div>
  </article>
);
