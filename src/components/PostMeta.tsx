interface Props {
  publishedAt?: string;
  readTimeMinutes?: number;
  status?: string;
}

export const PostMeta = ({ publishedAt, readTimeMinutes, status }: Props) => (
  <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
    {status && <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs dark:bg-slate-800">{status}</span>}
    {publishedAt && <span>{new Date(publishedAt).toLocaleDateString()}</span>}
    {readTimeMinutes ? <span>• {readTimeMinutes} min read</span> : null}
  </div>
);
