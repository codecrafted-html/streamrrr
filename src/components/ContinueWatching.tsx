import { Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Play, X } from "lucide-react";
import { IMG } from "@/lib/tmdb";
import { listWatchProgress, removeWatchProgress, type WatchRow } from "@/lib/watch-progress";
import { useAuth } from "@/hooks/use-auth";

export function ContinueWatching() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ["watch-progress", user?.id],
    queryFn: listWatchProgress,
    enabled: !!user,
  });

  if (!user || !data?.length) return null;

  const onRemove = async (e: React.MouseEvent, row: WatchRow) => {
    e.preventDefault();
    e.stopPropagation();
    await removeWatchProgress(row.tmdb_id, row.media_type);
    qc.invalidateQueries({ queryKey: ["watch-progress"] });
  };

  return (
    <section className="space-y-3">
      <h2 className="text-xl sm:text-2xl font-bold tracking-tight px-4 sm:px-8">Continue Watching</h2>
      <div className="flex gap-4 overflow-x-auto px-4 sm:px-8 pb-4 scrollbar-hide scroll-smooth">
        {data.map((row) => (
          <Link
            key={row.id}
            to="/watch/$type/$id"
            params={{ type: row.media_type, id: String(row.tmdb_id) }}
            search={row.media_type === "tv" ? { s: row.season ?? 1, e: row.episode ?? 1 } : {}}
            className="group relative flex-shrink-0 w-[280px] sm:w-[340px] aspect-video rounded-xl overflow-hidden bg-card"
          >
            {row.backdrop_path ? (
              <img
                src={IMG(row.backdrop_path, "w780")}
                alt={row.title}
                loading="lazy"
                className="w-full h-full object-cover transition duration-500 group-hover:scale-[1.04]"
              />
            ) : row.poster_path ? (
              <img src={IMG(row.poster_path, "w500")} alt={row.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full grid place-items-center text-white/30 text-xs">{row.title}</div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
            <div className="absolute inset-0 grid place-items-center opacity-0 group-hover:opacity-100 transition">
              <div className="w-14 h-14 rounded-full bg-white/95 text-black grid place-items-center">
                <Play className="w-6 h-6 fill-black ml-0.5" />
              </div>
            </div>
            <button
              onClick={(e) => onRemove(e, row)}
              className="absolute top-2 right-2 w-7 h-7 rounded-full glass-pill grid place-items-center text-white/80 hover:text-white opacity-0 group-hover:opacity-100 transition"
              aria-label="Remove"
            >
              <X className="w-3.5 h-3.5" />
            </button>
            <div className="absolute inset-x-0 bottom-0 p-3">
              <h3 className="text-sm font-semibold line-clamp-1">{row.title}</h3>
              {row.media_type === "tv" && row.season != null && (
                <p className="text-xs text-white/60 mt-0.5">S{row.season} · E{row.episode ?? 1}</p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
