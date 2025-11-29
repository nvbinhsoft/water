import { useParams } from 'react-router-dom';
import { MarkdownRenderer } from '../components/MarkdownRenderer';
import { TagPill } from '../components/TagPill';
import { PostMeta } from '../components/PostMeta';
import { usePost } from '../hooks/publicQueries';

const PostDetailPage = () => {
  const { slug } = useParams();
  const { data, isLoading } = usePost(slug ?? '');

  if (isLoading) return <p className="text-slate-500">Loading post...</p>;
  if (!data) return <p className="text-slate-500">Post not found.</p>;

  return (
    <article className="prose prose-lg max-w-3xl px-2 py-4 dark:prose-invert md:px-0">
      <h1 className="mb-2 text-4xl font-bold leading-tight text-slate-900 dark:text-white">{data.title}</h1>
      <PostMeta publishedAt={data.publishedAt} readTimeMinutes={data.readTimeMinutes} />
      <div className="mt-3 flex flex-wrap gap-2">
        {data.tags?.map((tag) => (
          <TagPill key={tag.id} tag={tag} />
        ))}
      </div>
      {data.coverImageUrl && (
        <img src={data.coverImageUrl} alt={data.title} className="my-6 w-full rounded-2xl" />
      )}
      <MarkdownRenderer content={data.body} />
    </article>
  );
};

export default PostDetailPage;
