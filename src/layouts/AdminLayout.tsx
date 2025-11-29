import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { clearAuthToken } from '../utils/auth';
import { ThemeToggle } from '../components/ThemeToggle';

const navClasses = ({ isActive }: { isActive: boolean }) =>
  `rounded-md px-3 py-2 text-sm font-medium ${
    isActive
      ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-100'
      : 'text-slate-600 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800'
  }`;

export const AdminLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAuthToken();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-surface text-slate-900 dark:bg-slate-900 dark:text-slate-100">
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
        <div className="flex items-center justify-between px-6 py-4">
          <Link to="/admin/posts" className="font-semibold text-lg">
            Admin Console
          </Link>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <button
              onClick={handleLogout}
              className="rounded-md border border-slate-200 px-3 py-1 text-sm text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-800"
            >
              Logout
            </button>
          </div>
        </div>
      </header>
      <div className="flex">
        <aside className="hidden w-60 border-r border-slate-200 bg-white/70 p-4 dark:border-slate-800 dark:bg-slate-900/80 md:block">
          <nav className="space-y-2">
            <NavLink to="/admin/posts" className={navClasses} end>
              Posts
            </NavLink>
            <NavLink to="/admin/posts/new" className={navClasses}>
              New Post
            </NavLink>
            <NavLink to="/admin/tags" className={navClasses}>
              Tags
            </NavLink>
            <NavLink to="/admin/settings" className={navClasses}>
              Settings
            </NavLink>
          </nav>
        </aside>
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
