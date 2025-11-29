import { FormEvent, useEffect, useState } from 'react';
import { useAdminSettings, useUpdateSettings } from '../../hooks/adminQueries';
import { Settings } from '../../types/api';

const AdminSettingsPage = () => {
  const { data, isLoading } = useAdminSettings();
  const updateSettings = useUpdateSettings();
  const [form, setForm] = useState<Settings>({ title: '', subtitle: '', authorName: '', authorBio: '', profileImageUrl: '' });

  useEffect(() => {
    if (data) setForm(data);
  }, [data]);

  const updateField = (key: keyof Settings, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    updateSettings.mutate(form);
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-wide text-indigo-600">Admin</p>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Settings</h1>
      </div>

      {isLoading && <p className="text-slate-500">Loading settings...</p>}

      <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-slate-200 bg-white/80 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Blog title</label>
            <input
              value={form.title}
              onChange={(e) => updateField('title', e.target.value)}
              className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Subtitle</label>
            <input
              value={form.subtitle ?? ''}
              onChange={(e) => updateField('subtitle', e.target.value)}
              className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Author name</label>
            <input
              value={form.authorName ?? ''}
              onChange={(e) => updateField('authorName', e.target.value)}
              className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Profile image URL</label>
            <input
              value={form.profileImageUrl ?? ''}
              onChange={(e) => updateField('profileImageUrl', e.target.value)}
              className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Author bio</label>
          <textarea
            value={form.authorBio ?? ''}
            onChange={(e) => updateField('authorBio', e.target.value)}
            className="min-h-[120px] w-full rounded-md border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          />
        </div>
        <button
          type="submit"
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
          disabled={updateSettings.isPending}
        >
          Save settings
        </button>
      </form>
    </div>
  );
};

export default AdminSettingsPage;
