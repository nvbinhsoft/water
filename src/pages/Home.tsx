import { useSearchParams, Link } from 'react-router-dom';
import { usePosts, useTags } from '../hooks/publicQueries';
import { PostCard } from '../components/PostCard';
import { Pagination } from '../components/Pagination';

const HomePage = () => {
  const [params, setParams] = useSearchParams({ page: '1', size: '10' });
  const page = Number(params.get('page') ?? '1');
  const q = params.get('q') ?? undefined;
  const tag = params.get('tag') ?? undefined;
  const { data, isLoading } = usePosts({ page: page - 1, size: Number(params.get('size') ?? 10), q, tag });
  const { data: tags } = useTags();

  const onPageChange = (next: number) => {
    params.set('page', String(next));
    setParams(params);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <input
            type="search"
            placeholder="Search posts..."
            defaultValue={q}
            onChange={(e) => {
              params.set('q', e.target.value);
              params.set('page', '1');
              setParams(params);
            }}
            className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 md:w-80"
            aria-label="Search posts"
          />
          <div className="flex flex-wrap gap-2">
            {tags?.map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  params.set('tag', t.slug);
                  params.set('page', '1');
                  setParams(params);
                }}
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  t.slug === tag
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                #{t.name}
              </button>
            ))}
          </div>
        </div>
        <Link to="/about" className="text-sm text-indigo-600 hover:underline">
          About this blog →
        </Link>
      </div>

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
