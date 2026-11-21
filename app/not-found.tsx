import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4 text-center">
      <h2 className="text-3xl font-black mb-2">404 - Page Not Found</h2>
      <p className="text-sm text-slate-400 mb-6">The page you are looking for does not exist.</p>
      <Link
        href="/"
        className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs"
      >
        Return to Home
      </Link>
    </div>
  );
}
