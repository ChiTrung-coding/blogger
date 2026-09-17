import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return <><Helmet><title>Không tìm thấy trang</title><meta name="description" content="Trang bạn đang tìm kiếm không tồn tại." /></Helmet><main className="mx-auto max-w-2xl px-4 py-24 text-center"><p className="text-6xl font-bold text-blue-600">404</p><h1 className="mt-4 text-2xl font-bold text-slate-900 dark:text-slate-100">Không tìm thấy trang</h1><p className="mt-2 text-slate-600 dark:text-slate-400">Đường dẫn này không tồn tại hoặc đã được thay đổi.</p><Link to="/" className="mt-6 inline-flex rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">Về trang chủ</Link></main></>;
}
