import { Link } from "@tanstack/react-router";
import { IMG, type Media } from "@/lib/tmdb";
import { Play, Info } from "lucide-react";

export function Hero({ item }: { item: Media }) {
  const type = item.media_type ?? (item.title ? "movie" : "tv");
  const title = item.title ?? item.name ?? "";
  return (
    <div className="relative h-[85vh] min-h-[600px] w-full overflow-hidden">
      {item.backdrop_path && (
        <img
          src={IMG(item.backdrop_path, "original")}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/20" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/40 to-transparent" />

      <div className="relative h-full flex items-end sm:items-center px-6 sm:px-12 pb-20">
        <div className="max-w-2xl space-y-5">
          <h1 className="text-5xl sm:text-7xl font-black tracking-tight leading-none">
            {title}
          </h1>
          <p className="text-base sm:text-lg text-white/80 line-clamp-3 max-w-xl">{item.overview}</p>
          <div className="flex gap-3 pt-2">
            <Link
              to="/watch/$type/$id"
              params={{ type, id: String(item.id) }}
              className="inline-flex items-center gap-2 bg-white text-black px-7 py-3 rounded-full font-semibold hover:bg-white/90 transition"
            >
              <Play className="w-5 h-5 fill-black" /> Play
            </Link>
            <Link
              to="/watch/$type/$id"
              params={{ type, id: String(item.id) }}
              className="inline-flex items-center gap-2 glass-pill px-7 py-3 rounded-full font-semibold hover:bg-white/10 transition"
            >
              <Info className="w-5 h-5" /> Info
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
