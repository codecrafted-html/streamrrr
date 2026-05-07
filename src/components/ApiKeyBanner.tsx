import { hasTmdbKey } from "@/lib/tmdb";

export function ApiKeyBanner() {
  if (hasTmdbKey()) return null;
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 max-w-lg w-[calc(100%-2rem)] glass-pill rounded-2xl p-4 text-sm">
      <p className="font-semibold text-gold mb-1">TMDB API key required</p>
      <p className="text-white/80">
        Get a free key at{" "}
        <a className="underline" href="https://www.themoviedb.org/settings/api" target="_blank" rel="noreferrer">
          themoviedb.org
        </a>{" "}
        and add <code className="bg-white/10 px-1.5 py-0.5 rounded">VITE_TMDB_API_KEY=your_key</code> to a{" "}
        <code className="bg-white/10 px-1.5 py-0.5 rounded">.env</code> file, then restart.
      </p>
    </div>
  );
}
