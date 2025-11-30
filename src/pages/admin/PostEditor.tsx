import { FormEvent, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  useAdminPost,
  useAdminTags,
  useCreatePost,
  useUpdatePost,
  useUploadImage,
} from '../../hooks/adminQueries';
import { MarkdownRenderer } from '../../components/MarkdownRenderer';
import { RichMarkdownEditor } from '../../components/RichMarkdownEditor';
import { PostStatus } from '../../types/api';

const emptyForm = {
  title: '',
  slug: '',
  excerpt: '',
  coverImageUrl: '',
  status: 'DRAFT' as PostStatus,
  body: '',
  tagIds: [] as number[],
};

const AdminPostEditorPage = () => {
  const { id } = useParams();
  const postId = id ? Number(id) : undefined;
  const navigate = useNavigate();
  const { data: post } = useAdminPost(postId);
  const { data: tags } = useAdminTags();
  const createPost = useCreatePost();
  const updatePost = useUpdatePost(postId ?? 0);
  const uploadImage = useUploadImage();
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (post) {
      setForm({
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        coverImageUrl: post.coverImageUrl ?? '',
        status: post.status,
        body: post.body,
        tagIds: post.tags?.map((t) => t.id) ?? [],
      });
    }
  }, [post]);

  const updateField = (key: keyof typeof form, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const toggleTag = (tagId: number) => {
    setForm((prev) => ({
      ...prev,
      tagIds: prev.tagIds.includes(tagId)
        ? prev.tagIds.filter((id) => id !== tagId)
        : [...prev.tagIds, tagId],
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (postId) {
      await updatePost.mutateAsync(form);
    } else {
      await createPost.mutateAsync(form);
    }
    navigate('/admin/posts');
  };

  const handleEditorUpload = async (file: File) => {
    const res = await uploadImage.mutateAsync(file);
    if (!form.coverImageUrl) {
      updateField('coverImageUrl', res.url);
    }
    return res.url;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between rounded-2xl border border-slate-200/80 bg-white/90 px-4 py-3 shadow-sm backdrop-blur dark:border-slate-800/80 dark:bg-slate-900/80">
        <div className="flex items-center gap-3">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_0_6px_rgba(16,185,129,0.15)]"></span>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-indigo-500">{postId ? 'Editing' : 'Draft'}</p>
            <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Compose post</h1>
          </div>
        </div>
        <button
          type="submit"
          form="post-editor-form"
          className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-indigo-700"
          disabled={createPost.isPending || updatePost.isPending}
        >
          {postId ? 'Save changes' : 'Publish draft'}
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        id="post-editor-form"
        className="grid gap-6 lg:grid-cols-[65%_35%] xl:grid-cols-[68%_32%] 2xl:grid-cols-[70%_30%]"
      >
        <div className="space-y-4 rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-sm backdrop-blur dark:border-slate-800/80 dark:bg-slate-900/80">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Title</label>
            <input
              value={form.title}
              onChange={(e) => updateField('title', e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-base shadow-sm focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              required
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Slug</label>
              <input
                value={form.slug}
                onChange={(e) => updateField('slug', e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Status</label>
              <select
                value={form.status}
                onChange={(e) => updateField('status', e.target.value as PostStatus)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              >
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Excerpt</label>
            <textarea
              value={form.excerpt}
              onChange={(e) => updateField('excerpt', e.target.value)}
              className="min-h-[80px] w-full rounded-xl border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Cover image URL</label>
            <input
              value={form.coverImageUrl}
              onChange={(e) => updateField('coverImageUrl', e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              placeholder="https://..."
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Tags</label>
            <div className="flex flex-wrap gap-2">
              {tags?.map((tag) => (
                <label
                  key={tag.id}
                  className="flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1 text-xs shadow-sm dark:border-slate-700"
                >
                  <input type="checkbox" checked={form.tagIds.includes(tag.id)} onChange={() => toggleTag(tag.id)} />
                  {tag.name}
                </label>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Markdown Body</label>
            <RichMarkdownEditor
              value={form.body}
              onChange={(next) => updateField('body', next)}
              onUploadImage={handleEditorUpload}
            />
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200/80 bg-white/90 p-5 shadow-sm backdrop-blur dark:border-slate-800/80 dark:bg-slate-900/80">
          <MarkdownRenderer content={form.body} />
        </div>
      </form>
    </div>
  );
};

export default AdminPostEditorPage;
