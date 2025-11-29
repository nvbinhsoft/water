import { Link, NavLink, Outlet } from 'react-router-dom';
import { ThemeToggle } from '../components/ThemeToggle';
import { usePublicSettings } from '../hooks/publicQueries';

const navClass = ({ isActive }: { isActive: boolean }) =>
  `text-sm font-medium ${isActive ? 'text-indigo-600' : 'text-slate-600 hover:text-slate-900'} dark:text-slate-200`;

export const PublicLayout = () => {
  const { data: settings } = usePublicSettings();

  return (
    <div className="min-h-screen bg-surface text-slate-900 dark:bg-slate-900 dark:text-slate-100">
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
        <div className="container-narrow flex items-center justify-between py-4">
          <Link to="/" className="font-semibold text-lg">
            {settings?.title ?? 'My Engineering Notes'}
          </Link>
          <nav className="flex items-center gap-4">
            <NavLink to="/" className={navClass} end>
              Home
            </NavLink>
            <NavLink to="/about" className={navClass}>
              About
            </NavLink>
            <NavLink to="/admin/login" className={navClass}>
              Admin
            </NavLink>
            <ThemeToggle />
          </nav>
        </div>
      </header>
      <main className="container-narrow py-10">
        <Outlet />
      </main>
      <footer className="border-t border-slate-200 bg-white/70 py-8 text-center text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900/70">
        <div className="container-narrow">{settings?.subtitle ?? 'Built for code-heavy writing.'}</div>
      </footer>
    </div>
  );
};
