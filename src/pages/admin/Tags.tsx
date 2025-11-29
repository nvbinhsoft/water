import { FormEvent, useState } from 'react';
import { useAdminTags, useCreateTag, useDeleteTag, useUpdateTag } from '../../hooks/adminQueries';

const AdminTagsPage = () => {
  const { data, isLoading } = useAdminTags();
  const createTag = useCreateTag();
  const deleteTag = useDeleteTag();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const updateTag = useUpdateTag(editingId ?? 0);

  const startEdit = (id: number, currentName: string, currentSlug: string) => {
    setEditingId(id);
    setName(currentName);
    setSlug(currentSlug);
  };

  const resetForm = () => {
    setEditingId(null);
    setName('');
    setSlug('');
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateTag.mutate({ name, slug });
    } else {
      createTag.mutate({ name, slug });
    }
    resetForm();
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-wide text-indigo-600">Admin</p>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Tags</h1>
      </div>

      <form onSubmit={handleSubmit} className="rounded-xl border border-slate-200 bg-white/80 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Slug</label>
            <input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              required
            />
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <button type="submit" className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700">
            {editingId ? 'Update tag' : 'Create tag'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="rounded-md border border-slate-200 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-100"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {isLoading && <p className="text-slate-500">Loading tags...</p>}

      <div className="grid gap-3 md:grid-cols-2">
        {data?.map((tag) => (
          <div key={tag.id} className="flex items-center justify-between rounded-xl border border-slate-200 bg-white/80 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
            <div>
              <p className="font-semibold text-slate-900 dark:text-white">{tag.name}</p>
              <p className="text-sm text-slate-500">Slug: {tag.slug}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => startEdit(tag.id, tag.name, tag.slug)}
                className="rounded-md border border-slate-200 px-3 py-1 text-sm text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-100"
              >
                Edit
              </button>
              <button
                onClick={() => deleteTag.mutate(tag.id)}
                className="rounded-md border border-red-200 px-3 py-1 text-sm text-red-600 hover:bg-red-50 dark:border-red-700 dark:text-red-200"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminTagsPage;
