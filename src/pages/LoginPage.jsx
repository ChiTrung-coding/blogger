import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { LockKeyhole, LogIn } from 'lucide-react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { getConfig } from '../lib/config';
import { getLockoutRemaining, isAdminAuthenticated, loginAdmin } from '../lib/auth';
import Toast from '../components/ui/Toast';

function formatRemaining(milliseconds) {
  const minutes = Math.ceil(milliseconds / 60000);
  return `${minutes} phút`;
}

export default function LoginPage() {
  const config = getConfig();
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [remaining, setRemaining] = useState(getLockoutRemaining());

  useEffect(() => {
    const timer = window.setInterval(() => setRemaining(getLockoutRemaining()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  if (isAdminAuthenticated()) {
    return <Navigate to="/admin" replace />;
  }

  function handleSubmit(event) {
    event.preventDefault();
    const result = loginAdmin(username.trim(), password);
    if (result.ok) {
      navigate(location.state?.from || '/admin', { replace: true });
      return;
    }
    if (result.locked) {
      setRemaining(result.remaining);
      setError(`Bạn đã nhập sai quá số lần cho phép. Vui lòng thử lại sau ${formatRemaining(result.remaining)}.`);
    } else {
      setError(`Tên đăng nhập hoặc mật khẩu không đúng. Còn ${result.attemptsLeft} lần thử.`);
    }
  }

  return (
    <>
      <Helmet><title>{`Đăng nhập quản trị | ${config.site.name}`}</title></Helmet>
      <main className="flex min-h-[70vh] items-center justify-center px-4 py-12">
        <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-lg dark:border-slate-700 dark:bg-slate-800 sm:p-8">
          <div className="mb-7 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300"><LockKeyhole size={22} /></div>
            <h1 className="mt-4 text-2xl font-bold text-slate-900 dark:text-slate-100">Đăng nhập quản trị</h1>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Đăng nhập để quản lý nội dung blog.</p>
          </div>
          <Toast
            message={remaining > 0 ? `Tài khoản đang tạm khóa. Còn ${formatRemaining(remaining)}.` : error}
            tone={remaining > 0 ? 'warning' : 'error'}
          />
          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Tên đăng nhập<input required autoComplete="username" value={username} onChange={(event) => setUsername(event.target.value)} className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:border-blue-500 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100" /></label>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Mật khẩu<input required type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:border-blue-500 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100" /></label>
            <button disabled={remaining > 0} className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"><LogIn size={17} /> Đăng nhập</button>
          </form>
        </section>
      </main>
    </>
  );
}
