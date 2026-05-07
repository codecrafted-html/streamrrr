import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { Row } from "@/components/Row";
import { ApiKeyBanner } from "@/components/ApiKeyBanner";
import { trending, popular, topRated, nowPlaying, onTheAir, hasTmdbKey } from "@/lib/tmdb";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Streamr — Watch Movies & TV" },
      { name: "description", content: "Stream trending movies and TV shows in HD." },
    ],
  }),
  component: Index,
});

function Index() {
  const enabled = hasTmdbKey();
  const t = useQuery({ queryKey: ["trending"], queryFn: () => trending("movie"), enabled });
  const pm = useQuery({ queryKey: ["pop", "movie"], queryFn: () => popular("movie"), enabled });
  const pt = useQuery({ queryKey: ["pop", "tv"], queryFn: () => popular("tv"), enabled });
  const tr = useQuery({ queryKey: ["top", "movie"], queryFn: () => topRated("movie"), enabled });
  const np = useQuery({ queryKey: ["nowplaying"], queryFn: nowPlaying, enabled });
  const air = useQuery({ queryKey: ["onair"], queryFn: onTheAir, enabled });

  const heroItem = t.data?.results?.[0];

  return (
    <div className="min-h-screen pb-20">
      <Nav />
      {heroItem ? <Hero item={heroItem} /> : <div className="h-[85vh] bg-card animate-pulse" />}
      <main className="space-y-12 -mt-32 relative z-10">
        {t.data && <Row title="Trending Movies" items={t.data.results} />}
        {pm.data && <Row title="Popular Movies" items={pm.data.results.map((r) => ({ ...r, media_type: "movie" as const }))} />}
        {pt.data && <Row title="Popular TV Shows" items={pt.data.results.map((r) => ({ ...r, media_type: "tv" as const }))} />}
        {np.data && <Row title="Now Playing" items={np.data.results.map((r) => ({ ...r, media_type: "movie" as const }))} />}
        {air.data && <Row title="On The Air" items={air.data.results.map((r) => ({ ...r, media_type: "tv" as const }))} />}
        {tr.data && <Row title="Top Rated" items={tr.data.results.map((r) => ({ ...r, media_type: "movie" as const }))} />}
      </main>
      <ApiKeyBanner />
    </div>
  );
}
