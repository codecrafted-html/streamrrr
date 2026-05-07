import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { useState } from "react";
import { Nav } from "@/components/Nav";
import { ApiKeyBanner } from "@/components/ApiKeyBanner";
import { details, seasonEpisodes, embedUrl, IMG, hasTmdbKey } from "@/lib/tmdb";
import { Star, Calendar, Clock, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/watch/$type/$id")({
  validateSearch: z.object({ s: z.number().optional(), e: z.number().optional() }),
  head: () => ({ meta: [{ title: "Watch — Streamr" }] }),
  component: Watch,
});

function Watch() {
  const { type, id } = Route.useParams();
  const { s, e } = Route.useSearch();
  const mediaType = type === "tv" ? "tv" : "movie";
  const enabled = hasTmdbKey();

  const [season, setSeason] = useState(s ?? 1);
  const [episode, setEpisode] = useState(e ?? 1);

  const { data: info } = useQuery({
    queryKey: ["details", mediaType, id],
    queryFn: () => details(mediaType, id),
    enabled,
  });

  const { data: epData } = useQuery({
    queryKey: ["season", id, season],
    queryFn: () => seasonEpisodes(id, season),
    enabled: enabled && mediaType === "tv",
  });

  const src = embedUrl(mediaType, id, season, episode);
  const title = info?.title ?? info?.name ?? "Loading…";
  const year = (info?.release_date ?? info?.first_air_date ?? "").slice(0, 4);

  return (
    <div className="min-h-screen pb-20">
      <div className="relative">
        {info?.backdrop_path && (
          <div className="absolute inset-0 h-[60vh] overflow-hidden">
            <img src={IMG(info.backdrop_path, "original")} alt="" className="w-full h-full object-cover opacity-30" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background" />
          </div>
        )}

        <div className="relative pt-28 px-4 sm:px-8 max-w-7xl mx-auto">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white mb-6">
            <ArrowLeft className="w-4 h-4" /> Back
          </Link>

          <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-2xl border border-white/10">
            <iframe
              key={src}
              src={src}
              title={title}
              allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          </div>

          <div className="mt-8 grid md:grid-cols-[200px_1fr] gap-8">
            {info?.poster_path && (
              <img src={IMG(info.poster_path, "w300")} alt={title} className="rounded-xl hidden md:block" />
            )}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl font-black">{title}</h1>
              <div className="flex flex-wrap items-center gap-3 text-sm text-white/70">
                {year && <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{year}</span>}
                {info?.runtime ? <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{info.runtime}m</span> : null}
                {info?.vote_average ? (
                  <span className="flex items-center gap-1"><Star className="w-4 h-4 fill-gold text-gold" />{info.vote_average.toFixed(1)}</span>
                ) : null}
                {info?.genres?.map((g) => (
                  <span key={g.id} className="px-2 py-0.5 rounded-full border border-white/15">{g.name}</span>
                ))}
              </div>
              <p className="text-white/80 max-w-3xl">{info?.overview}</p>
            </div>
          </div>

          {mediaType === "tv" && info?.seasons && (
            <div className="mt-10 space-y-4">
              <div className="flex items-center gap-3 flex-wrap">
                <h2 className="text-2xl font-bold">Episodes</h2>
                <select
                  value={season}
                  onChange={(ev) => { setSeason(Number(ev.target.value)); setEpisode(1); }}
                  className="bg-card border border-white/10 rounded-full px-4 py-2 text-sm"
                >
                  {info.seasons.filter((s) => s.season_number > 0).map((s) => (
                    <option key={s.season_number} value={s.season_number}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {epData?.episodes?.map((ep) => {
                  const active = ep.episode_number === episode;
                  return (
                    <button
                      key={ep.id}
                      onClick={() => setEpisode(ep.episode_number)}
                      className={`text-left rounded-xl overflow-hidden border transition ${
                        active ? "border-gold bg-white/5" : "border-white/10 hover:border-white/30"
                      }`}
                    >
                      <div className="aspect-video bg-card">
                        {ep.still_path && <img src={IMG(ep.still_path, "w300")} alt="" className="w-full h-full object-cover" />}
                      </div>
                      <div className="p-3">
                        <p className="text-sm font-semibold line-clamp-1">{ep.episode_number}. {ep.name}</p>
                        <p className="text-xs text-white/60 line-clamp-2 mt-1">{ep.overview}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
      <ApiKeyBanner />
    </div>
  );
}
