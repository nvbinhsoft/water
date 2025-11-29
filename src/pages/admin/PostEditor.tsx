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

  const insertCodeBlock = () => {
    updateField('body', `${form.body}\n\n\`\`\`ts\n// code here\n\`\`\`\n`);
  };

  const handleUpload = async (file?: File) => {
    if (!file) return;
    const res = await uploadImage.mutateAsync(file);
    updateField('body', `${form.body}\n\n![image](${res.url})\n`);
    updateField('coverImageUrl', res.url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-wide text-indigo-600">{postId ? 'Edit Post' : 'New Post'}</p>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Markdown Editor</h1>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={insertCodeBlock}
            className="rounded-md border border-slate-200 px-3 py-1 text-sm text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-100"
          >
            Insert code block
          </button>
          <label className="cursor-pointer rounded-md border border-slate-200 px-3 py-1 text-sm text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-100">
            Upload image
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleUpload(e.target.files?.[0])}
            />
          </label>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Title</label>
            <input
              value={form.title}
              onChange={(e) => updateField('title', e.target.value)}
              className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              required
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Slug</label>
              <input
                value={form.slug}
                onChange={(e) => updateField('slug', e.target.value)}
                className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Status</label>
              <select
                value={form.status}
                onChange={(e) => updateField('status', e.target.value as PostStatus)}
                className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
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
              className="min-h-[80px] w-full rounded-md border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Cover image URL</label>
            <input
              value={form.coverImageUrl}
              onChange={(e) => updateField('coverImageUrl', e.target.value)}
              className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              placeholder="https://..."
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Tags</label>
            <div className="flex flex-wrap gap-2">
              {tags?.map((tag) => (
                <label key={tag.id} className="flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1 text-xs dark:border-slate-700">
                  <input type="checkbox" checked={form.tagIds.includes(tag.id)} onChange={() => toggleTag(tag.id)} />
                  {tag.name}
                </label>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Markdown Body</label>
            <textarea
              value={form.body}
              onChange={(e) => updateField('body', e.target.value)}
              className="min-h-[420px] w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-mono shadow-sm focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              required
            />
          </div>
          <button
            type="submit"
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
            disabled={createPost.isPending || updatePost.isPending}
          >
            {postId ? 'Save changes' : 'Create post'}
          </button>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
          <p className="text-sm uppercase tracking-wide text-indigo-600">Live preview</p>
          <MarkdownRenderer content={form.body} />
        </div>
      </form>
    </div>
  );
};

export default AdminPostEditorPage;
