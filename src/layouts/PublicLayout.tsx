import { Link, NavLink, Outlet } from 'react-router-dom';
import { ThemeToggle } from '../components/ThemeToggle';
import { usePublicSettings } from '../hooks/publicQueries';

const navClass = ({ isActive }: { isActive: boolean }) =>
  `text-sm font-medium transition-colors ${isActive ? 'text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
  }`;

export const PublicLayout = () => {
  const { data: settings } = usePublicSettings();

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 border-b border-slate-100 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
        <div className="container-narrow flex h-16 items-center justify-between">
          <Link to="/" className="font-serif text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            {settings?.title ?? 'My Engineering Notes'}
          </Link>
          <nav className="flex items-center gap-6">
            <NavLink to="/" className={navClass} end>
              Home
            </NavLink>
            <NavLink to="/about" className={navClass}>
              About
            </NavLink>
            <div className="h-4 w-px bg-slate-200 dark:bg-slate-800" />
            <NavLink to="/admin/login" className={navClass}>
              Sign in
            </NavLink>
            <ThemeToggle />
          </nav>
        </div>
      </header>
      <main className="container-narrow py-12">
        <Outlet />
      </main>
      <footer className="mt-auto border-t border-slate-100 bg-slate-50 py-12 text-center text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
        <div className="container-narrow">
          <p>{settings?.subtitle ?? 'Built for code-heavy writing.'}</p>
          <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
            &copy; {new Date().getFullYear()} {settings?.authorName ?? 'Author'}. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};
