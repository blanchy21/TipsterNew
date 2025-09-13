import { Suspense } from 'react';
import App from '@/components/App';

export default function Home() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-white/70">Loading...</p>
      </div>
    </div>}>
      <App />
    </Suspense>
  );
}
