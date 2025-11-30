import { useSearchParams, Link } from 'react-router-dom';
import { usePosts, useTags, usePublicSettings } from '../hooks/publicQueries';
import { PostCard } from '../components/PostCard';
import { Pagination } from '../components/Pagination';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';

const HomePage = () => {
  const [params, setParams] = useSearchParams({ page: '1', size: '10' });
  const page = Number(params.get('page') ?? '1');
  const q = params.get('q') ?? undefined;
  const tag = params.get('tag') ?? undefined;
  const { data, isLoading } = usePosts({ page: page - 1, size: Number(params.get('size') ?? 10), q, tag });
  const { data: tags } = useTags();
  const { data: settings } = usePublicSettings();

  const onPageChange = (next: number) => {
    params.set('page', String(next));
    setParams(params);
  };

  return (
    <div className="space-y-10">
      <section className="rounded-3xl border border-slate-200/80 bg-white/80 p-8 shadow-sm backdrop-blur dark:border-slate-800/80 dark:bg-slate-900/80">
        <div className="flex flex-col gap-4">
          <p className="text-xs uppercase tracking-[0.2em] text-indigo-500">For developers</p>
          <h1 className="text-4xl font-semibold text-slate-900 dark:text-white sm:text-5xl">
            {settings?.title ?? 'Engineering Notes'} — clean, code-heavy stories.
          </h1>
          <p className="max-w-3xl text-lg text-slate-600 dark:text-slate-300">
            {settings?.subtitle ??
              'Readable walkthroughs, architecture notes, and code samples, crafted to feel like a Substack feed.'}
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/about"
              className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg dark:bg-white dark:text-slate-900"
            >
              About the author
            </Link>
            <Link
              to="/admin/login"
              className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-800 transition hover:-translate-y-0.5 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-800"
            >
              Write a post
            </Link>
          </div>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-[2fr_1fr] lg:items-center">
          <div className="relative">
            <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-3 h-5 w-5 text-slate-400" />
            <input
              type="search"
              placeholder="Search posts, topics, or snippets..."
              defaultValue={q}
              onChange={(e) => {
                params.set('q', e.target.value);
                params.set('page', '1');
                setParams(params);
              }}
              className="w-full rounded-xl border border-slate-200 bg-white/60 px-10 py-3 text-sm shadow-sm ring-0 transition focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              aria-label="Search posts"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {tags?.map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  params.set('tag', t.slug);
                  params.set('page', '1');
                  setParams(params);
                }}
                className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                  t.slug === tag
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:-translate-y-0.5 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                #{t.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {isLoading && <p className="text-slate-500">Loading posts...</p>}

      <div className="space-y-6">
        {data?.content.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
      {data && (
        <Pagination page={data.page + 1} totalPages={data.totalPages} onPageChange={onPageChange} />
      )}
      {data?.content.length === 0 && <p className="text-slate-500">No posts found.</p>}
    </div>
  );
};

export default HomePage;
