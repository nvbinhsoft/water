import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { clearAuthToken } from '../utils/auth';
import { ThemeToggle } from '../components/ThemeToggle';

const navClasses = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${isActive
    ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400'
    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200'
  }`;

export const AdminLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAuthToken();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <nav className="fixed inset-y-0 left-0 w-64 border-r border-slate-200 bg-white px-4 py-6 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-2 px-2 font-semibold text-lg text-slate-900 dark:text-white">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
              <path fillRule="evenodd" d="M2 4.25A2.25 2.25 0 014.25 2h11.5A2.25 2.25 0 0118 4.25v8.5A2.25 2.25 0 0115.75 15h-3.105a3.501 3.501 0 001.1 1.677A.75.75 0 0113.26 18H6.74a.75.75 0 01-.484-1.323A3.501 3.501 0 007.355 15H4.25A2.25 2.25 0 012 12.75v-8.5zm1.5 0a.75.75 0 01.75-.75h11.5a.75.75 0 01.75.75v7.5a.75.75 0 01-.75.75H4.25a.75.75 0 01-.75-.75v-7.5z" clipRule="evenodd" />
            </svg>
          </div>
          <span>Dashboard</span>
        </div>

        <div className="mt-8 space-y-1">
          <NavLink to="/admin/posts" className={navClasses} end>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 opacity-70">
              <path d="M10 3.75a2 2 0 10-4 0 2 2 0 004 0zM17.25 4.5a.75.75 0 00-1.5 0A2.25 2.25 0 0113.5 6.75h-7A2.25 2.25 0 014.25 4.5a.75.75 0 00-1.5 0A3.75 3.75 0 006.5 8.25h7a3.75 3.75 0 003.75-3.75z" />
              <path d="M6.5 9.75a2.25 2.25 0 00-2.25 2.25v2.5A2.25 2.25 0 006.5 16.75h7a2.25 2.25 0 002.25-2.25v-2.5a2.25 2.25 0 00-2.25-2.25h-7z" />
            </svg>
            All Posts
          </NavLink>
          <NavLink to="/admin/posts/new" className={navClasses}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 opacity-70">
              <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
            </svg>
            New Post
          </NavLink>
          <NavLink to="/admin/tags" className={navClasses}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 opacity-70">
              <path fillRule="evenodd" d="M4.5 2A1.5 1.5 0 003 3.5v13A1.5 1.5 0 004.5 18h11a1.5 1.5 0 001.5-1.5V7.621a1.5 1.5 0 00-.44-1.06l-4.12-4.122A1.5 1.5 0 0011.378 2H4.5zm2.25 8.5a.75.75 0 000 1.5h6.5a.75.75 0 000-1.5h-6.5zm0 3a.75.75 0 000 1.5h6.5a.75.75 0 000-1.5h-6.5z" clipRule="evenodd" />
            </svg>
            Tags
          </NavLink>
          <NavLink to="/admin/settings" className={navClasses}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 opacity-70">
              <path fillRule="evenodd" d="M7.84 1.804A1 1 0 018.82 1h2.36a1 1 0 01.98.804l.331 1.652a6.993 6.993 0 011.929 1.115l1.598-.54a1 1 0 011.186.447l1.18 2.044a1 1 0 01-.205 1.251l-1.267 1.113a7.047 7.047 0 010 2.228l1.267 1.113a1 1 0 01.206 1.25l-1.18 2.045a1 1 0 01-1.187.447l-1.598-.54a6.993 6.993 0 01-1.929 1.115l-.33 1.652a1 1 0 01-.98.804H8.82a1 1 0 01-.98-.804l-.331-1.652a6.993 6.993 0 01-1.929-1.115l-1.598.54a1 1 0 01-1.186-.447l-1.18-2.044a1 1 0 01.205-1.251l1.267-1.114a7.047 7.047 0 010-2.227L1.821 7.773a1 1 0 01-.206-1.25l1.18-2.045a1 1 0 011.187-.447l1.598.54A6.993 6.993 0 017.51 3.456l.33-1.652zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
            </svg>
            Settings
          </NavLink>
        </div>

        <div className="absolute bottom-6 left-4 right-4 border-t border-slate-200 pt-4 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <ThemeToggle />
            <button
              onClick={handleLogout}
              className="text-sm font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
            >
              Sign out
            </button>
          </div>
        </div>
      </nav>

      <main className="ml-64 min-h-screen p-8">
        <div className="mx-auto max-w-5xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
