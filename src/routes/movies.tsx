import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
// nav now in root
import { Row } from "@/components/Row";
import { ApiKeyBanner } from "@/components/ApiKeyBanner";
import { popular, topRated, nowPlaying, trending, hasTmdbKey } from "@/lib/tmdb";

export const Route = createFileRoute("/movies")({
  head: () => ({ meta: [{ title: "Movies — Streamr" }, { name: "description", content: "Browse movies." }] }),
  component: Movies,
});

function Movies() {
  const enabled = hasTmdbKey();
  const t = useQuery({ queryKey: ["m-trend"], queryFn: () => trending("movie"), enabled });
  const p = useQuery({ queryKey: ["m-pop"], queryFn: () => popular("movie"), enabled });
  const tr = useQuery({ queryKey: ["m-top"], queryFn: () => topRated("movie"), enabled });
  const np = useQuery({ queryKey: ["m-now"], queryFn: nowPlaying, enabled });
  const tag = (r: any[]) => r.map((x) => ({ ...x, media_type: "movie" as const }));

  return (
    <div className="min-h-screen pt-28 pb-20">
      <h1 className="text-5xl font-black px-4 sm:px-8 mb-8">Movies</h1>
      <div className="space-y-12">
        {t.data && <Row title="Trending" items={tag(t.data.results)} />}
        {np.data && <Row title="Now Playing" items={tag(np.data.results)} />}
        {p.data && <Row title="Popular" items={tag(p.data.results)} />}
        {tr.data && <Row title="Top Rated" items={tag(tr.data.results)} />}
      </div>
      <ApiKeyBanner />
    </div>
  );
}
