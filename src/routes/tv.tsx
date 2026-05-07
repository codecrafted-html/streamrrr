import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
// nav now in root
import { Row } from "@/components/Row";
import { ApiKeyBanner } from "@/components/ApiKeyBanner";
import { popular, topRated, onTheAir, trending, hasTmdbKey } from "@/lib/tmdb";

export const Route = createFileRoute("/tv")({
  head: () => ({ meta: [{ title: "TV Shows — Streamr" }, { name: "description", content: "Browse TV shows." }] }),
  component: TV,
});

function TV() {
  const enabled = hasTmdbKey();
  const t = useQuery({ queryKey: ["t-trend"], queryFn: () => trending("tv"), enabled });
  const p = useQuery({ queryKey: ["t-pop"], queryFn: () => popular("tv"), enabled });
  const tr = useQuery({ queryKey: ["t-top"], queryFn: () => topRated("tv"), enabled });
  const air = useQuery({ queryKey: ["t-air"], queryFn: onTheAir, enabled });
  const tag = (r: any[]) => r.map((x) => ({ ...x, media_type: "tv" as const }));

  return (
    <div className="min-h-screen pt-28 pb-20">
      <h1 className="text-5xl font-black px-4 sm:px-8 mb-8">TV Shows</h1>
      <div className="space-y-12">
        {t.data && <Row title="Trending" items={tag(t.data.results)} />}
        {air.data && <Row title="On The Air" items={tag(air.data.results)} />}
        {p.data && <Row title="Popular" items={tag(p.data.results)} />}
        {tr.data && <Row title="Top Rated" items={tag(tr.data.results)} />}
      </div>
      <ApiKeyBanner />
    </div>
  );
}
