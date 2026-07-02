import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-black text-white px-6">
      <div className="max-w-xl rounded-[2rem] border border-white/10 bg-white/5 p-10 text-center backdrop-blur-xl">
        <p className="text-sm uppercase tracking-[0.35em] text-sky-300/80">404</p>
        <h1 className="mt-4 text-5xl font-semibold text-white">Page not found</h1>
        <p className="mt-4 text-sm text-slate-300">The page you're looking for doesn't exist or may have been moved.</p>
        <Link to="/home" className="mt-8 inline-flex rounded-full border border-sky-400/30 bg-sky-500/10 px-6 py-3 text-sm font-semibold text-sky-200 transition hover:bg-sky-500/20">
          Go home
        </Link>
      </div>
    </main>
  );
}

export default NotFoundPage;
