import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
// nav now in root
import { PosterCard } from "@/components/Row";
import { ApiKeyBanner } from "@/components/ApiKeyBanner";
import { search, hasTmdbKey } from "@/lib/tmdb";

export const Route = createFileRoute("/search")({
  validateSearch: z.object({ q: z.string().optional() }),
  head: () => ({ meta: [{ title: "Search — Streamr" }] }),
  component: SearchPage,
});

function SearchPage() {
  const { q } = Route.useSearch();
  const enabled = hasTmdbKey() && !!q;
  const { data } = useQuery({
    queryKey: ["search", q],
    queryFn: () => search(q!),
    enabled,
  });

  const results = (data?.results ?? []).filter((r) => r.media_type === "movie" || r.media_type === "tv");

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 sm:px-8">
      <h1 className="text-4xl font-black mb-2">Search</h1>
      <p className="text-muted-foreground mb-8">{q ? `Results for "${q}"` : "Type a query above"}</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {results.map((r) => (
          <PosterCard key={`${r.media_type}-${r.id}`} item={r} />
        ))}
      </div>
      {q && results.length === 0 && data && <p className="text-muted-foreground">No results.</p>}
      <ApiKeyBanner />
    </div>
  );
}
