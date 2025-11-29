import { useParams, useSearchParams } from 'react-router-dom';
import { usePosts } from '../hooks/publicQueries';
import { PostCard } from '../components/PostCard';
import { Pagination } from '../components/Pagination';

const TagPostsPage = () => {
  const { slug } = useParams();
  const [params, setParams] = useSearchParams({ page: '1', size: '10' });
  const page = Number(params.get('page') ?? '1');
  const { data, isLoading } = usePosts({ page: page - 1, size: Number(params.get('size') ?? 10), tag: slug });

  const onPageChange = (next: number) => {
    params.set('page', String(next));
    setParams(params);
  };

  return (
    <div className="space-y-6">
      <header className="rounded-2xl bg-white/80 p-6 shadow-sm dark:bg-slate-900/70">
        <p className="text-sm uppercase tracking-wide text-indigo-600">Tag</p>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">#{slug}</h1>
      </header>
      {isLoading && <p className="text-slate-500">Loading posts...</p>}
      {data?.content.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
      {data && <Pagination page={data.page + 1} totalPages={data.totalPages} onPageChange={onPageChange} />}
    </div>
  );
};

export default TagPostsPage;
