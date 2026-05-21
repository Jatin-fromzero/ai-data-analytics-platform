import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="grid min-h-[60vh] place-items-center text-center">
      <div className="space-y-6 px-4">
        <p className="text-sm uppercase tracking-[0.25em] text-brand">Page not found</p>
        <h1 className="text-4xl font-bold text-white">We could not find that page.</h1>
        <p className="max-w-xl text-slate-400">
          This app foundation is still being configured, but the platform structure is ready for your content.
        </p>
        <Button asChild>
          <Link href="/">Return home</Link>
        </Button>
      </div>
    </div>
  );
}
