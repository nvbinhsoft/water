import { usePublicSettings } from '../hooks/publicQueries';

const AboutPage = () => {
  const { data, isLoading } = usePublicSettings();

  if (isLoading) return <p className="text-slate-500">Loading...</p>;

  return (
    <section className="rounded-2xl bg-white/80 p-8 shadow-sm dark:bg-slate-900/70">
      <p className="text-sm uppercase tracking-wide text-indigo-600">About</p>
      <h1 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">{data?.title ?? 'My personal blog'}</h1>
      <p className="mt-2 text-slate-600 dark:text-slate-300">{data?.subtitle}</p>
      <div className="mt-6 flex flex-col gap-6 md:flex-row">
        {data?.profileImageUrl && (
          <img
            src={data.profileImageUrl}
            alt={data.authorName}
            className="h-36 w-36 rounded-full border border-slate-200 object-cover shadow-sm dark:border-slate-800"
          />
        )}
        <div className="prose max-w-none dark:prose-invert">
          <p className="text-lg leading-relaxed text-slate-700 dark:text-slate-200">{data?.authorBio}</p>
          {data?.socialLinks && (
            <ul className="flex flex-wrap gap-3">
              {Object.entries(data.socialLinks).map(([key, value]) => (
                <li key={key}>
                  <a className="text-indigo-600 hover:underline" href={value} target="_blank" rel="noreferrer">
                    {key}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
};

export default AboutPage;
