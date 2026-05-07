import { Link } from "@tanstack/react-router";
import { IMG, type Media } from "@/lib/tmdb";
import { Star } from "lucide-react";

export function PosterCard({ item }: { item: Media }) {
  const type = item.media_type ?? (item.title ? "movie" : "tv");
  const title = item.title ?? item.name ?? "";
  const year = (item.release_date ?? item.first_air_date ?? "").slice(0, 4);

  return (
    <Link
      to="/watch/$type/$id"
      params={{ type, id: String(item.id) }}
      className="group flex-shrink-0 w-[160px] sm:w-[180px]"
    >
      <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-card">
        {item.poster_path ? (
          <img
            src={IMG(item.poster_path, "w300")}
            alt={title}
            loading="lazy"
            className="w-full h-full object-cover transition group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full grid place-items-center text-white/30 text-xs p-2 text-center">{title}</div>
        )}
        {item.vote_average > 0 && (
          <div className="absolute top-2 right-2 glass-pill rounded-full px-2 py-1 text-xs flex items-center gap-1">
            <Star className="w-3 h-3 fill-gold text-gold" />
            {item.vote_average.toFixed(1)}
          </div>
        )}
      </div>
      <div className="mt-2 px-1">
        <h3 className="text-sm font-medium line-clamp-1 group-hover:text-gold transition">{title}</h3>
        <p className="text-xs text-muted-foreground">{year}</p>
      </div>
    </Link>
  );
}

export function Row({ title, items }: { title: string; items: Media[] }) {
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-bold tracking-tight px-4 sm:px-8">{title}</h2>
      <div className="flex gap-4 overflow-x-auto px-4 sm:px-8 pb-4 scrollbar-hide">
        {items.map((item) => (
          <PosterCard key={`${item.media_type ?? ""}-${item.id}`} item={item} />
        ))}
      </div>
    </section>
  );
}
