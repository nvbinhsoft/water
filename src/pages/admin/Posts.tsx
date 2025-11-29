import { Link } from 'react-router-dom';
import { useAdminPosts, useDeletePost, usePublishPost, useUnpublishPost } from '../../hooks/adminQueries';
import { PostMeta } from '../../components/PostMeta';

const AdminPostsPage = () => {
  const { data, isLoading } = useAdminPosts();
  const deletePost = useDeletePost();
  const publish = usePublishPost();
  const unpublish = useUnpublishPost();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-wide text-indigo-600">Admin</p>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Posts</h1>
        </div>
        <Link
          to="/admin/posts/new"
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
        >
          New Post
        </Link>
      </div>

      {isLoading && <p className="text-slate-500">Loading posts...</p>}

      <div className="space-y-4">
        {data?.content.map((post) => (
          <div
            key={post.id}
            className="rounded-xl border border-slate-200 bg-white/80 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/70"
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
                    className="rounded-md border border-slate-200 px-3 py-1 text-sm text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-100"
                  >
                    Unpublish
                  </button>
                ) : (
                  <button
                    onClick={() => publish.mutate(post.id)}
                    className="rounded-md border border-slate-200 px-3 py-1 text-sm text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-100"
                  >
                    Publish
                  </button>
                )}
                <Link
                  to={`/admin/posts/${post.id}/edit`}
                  className="rounded-md border border-slate-200 px-3 py-1 text-sm text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-100"
                >
                  Edit
                </Link>
                <button
                  onClick={() => deletePost.mutate(post.id)}
                  className="rounded-md border border-red-200 px-3 py-1 text-sm text-red-600 hover:bg-red-50 dark:border-red-700 dark:text-red-200"
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
