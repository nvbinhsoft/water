import { Link } from 'react-router-dom';
import { useAdminPosts, useDeletePost, usePublishPost, useUnpublishPost } from '../../hooks/adminQueries';
import { PostMeta } from '../../components/PostMeta';

const AdminPostsPage = () => {
  const { data, isLoading } = useAdminPosts();
  const deletePost = useDeletePost();
  const publish = usePublishPost();
  const unpublish = useUnpublishPost();
  const total = data?.content.length ?? 0;
  const published = data?.content.filter((p) => p.status === 'PUBLISHED').length ?? 0;
  const drafts = total - published;

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-sm backdrop-blur dark:border-slate-800/80 dark:bg-slate-900/80">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-indigo-500">Dashboard</p>
            <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">Posts</h1>
            <p className="text-sm text-slate-500">Track drafts, publish quickly, and keep your feed tidy.</p>
          </div>
          <Link
            to="/admin/posts/new"
            className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-indigo-700"
          >
            New Post
          </Link>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-4 shadow-sm dark:border-slate-800/80 dark:bg-slate-900/70">
            <p className="text-xs uppercase tracking-wide text-slate-500">Total</p>
            <p className="text-2xl font-semibold text-slate-900 dark:text-white">{total}</p>
          </div>
          <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-4 shadow-sm dark:border-slate-800/80 dark:bg-slate-900/70">
            <p className="text-xs uppercase tracking-wide text-slate-500">Published</p>
            <p className="text-2xl font-semibold text-emerald-600 dark:text-emerald-400">{published}</p>
          </div>
          <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-4 shadow-sm dark:border-slate-800/80 dark:bg-slate-900/70">
            <p className="text-xs uppercase tracking-wide text-slate-500">Drafts</p>
            <p className="text-2xl font-semibold text-amber-600 dark:text-amber-400">{drafts}</p>
          </div>
        </div>
      </div>

      {isLoading && <p className="text-slate-500">Loading posts...</p>}

      <div className="space-y-4">
        {data?.content.map((post) => (
          <div
            key={post.id}
            className="rounded-3xl border border-slate-200/80 bg-white/90 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800/80 dark:bg-slate-900/80"
          >
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white">{post.title}</h3>
                <PostMeta publishedAt={post.publishedAt} readTimeMinutes={post.readTimeMinutes} status={post.status} />
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {post.status === 'PUBLISHED' ? (
                  <button
                    onClick={() => unpublish.mutate(post.id)}
                    className="rounded-full border border-slate-200 px-3 py-1 text-sm text-slate-700 transition hover:-translate-y-0.5 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-100"
                  >
                    Unpublish
                  </button>
                ) : (
                  <button
                    onClick={() => publish.mutate(post.id)}
                    className="rounded-full border border-slate-200 px-3 py-1 text-sm text-slate-700 transition hover:-translate-y-0.5 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-100"
                  >
                    Publish
                  </button>
                )}
                <Link
                  to={`/admin/posts/${post.id}/edit`}
                  className="rounded-full border border-slate-200 px-3 py-1 text-sm text-slate-700 transition hover:-translate-y-0.5 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-100"
                >
                  Edit
                </Link>
                <button
                  onClick={() => deletePost.mutate(post.id)}
                  className="rounded-full border border-red-200 px-3 py-1 text-sm text-red-600 transition hover:-translate-y-0.5 hover:bg-red-50 dark:border-red-700 dark:text-red-200"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPostsPage;
