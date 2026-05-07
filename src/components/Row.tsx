import { Link } from "@tanstack/react-router";
import { IMG, type Media } from "@/lib/tmdb";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState, useEffect } from "react";

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
            className="w-full h-full object-cover transition duration-500 group-hover:scale-[1.04]"
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

export function BackdropCard({ item }: { item: Media }) {
  const type = item.media_type ?? (item.title ? "movie" : "tv");
  const title = item.title ?? item.name ?? "";
  return (
    <Link
      to="/watch/$type/$id"
      params={{ type, id: String(item.id) }}
      className="group relative flex-shrink-0 w-[280px] sm:w-[360px] aspect-video rounded-xl overflow-hidden bg-card"
    >
      {item.backdrop_path ? (
        <img
          src={IMG(item.backdrop_path, "w780")}
          alt={title}
          loading="lazy"
          className="w-full h-full object-cover transition duration-500 group-hover:scale-[1.04]"
        />
      ) : (
        <div className="w-full h-full grid place-items-center text-white/30 text-xs p-2 text-center">{title}</div>
      )}
      <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/85 via-black/40 to-transparent">
        <h3 className="text-sm font-semibold line-clamp-1">{title}</h3>
      </div>
    </Link>
  );
}

export function Row({ title, items, variant = "poster" }: { title: string; items: Media[]; variant?: "poster" | "backdrop" }) {
  const ref = useRef<HTMLDivElement>(null);
  const [canL, setCanL] = useState(false);
  const [canR, setCanR] = useState(true);

  const update = () => {
    const el = ref.current;
    if (!el) return;
    setCanL(el.scrollLeft > 8);
    setCanR(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
  };

  useEffect(() => {
    update();
    const el = ref.current;
    if (!el) return;
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [items.length]);

  const scroll = (dir: -1 | 1) => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: "smooth" });
  };

  const Card = variant === "backdrop" ? BackdropCard : PosterCard;

  return (
    <section className="space-y-3 group/row">
      <h2 className="text-xl sm:text-2xl font-bold tracking-tight px-4 sm:px-8">{title}</h2>
      <div className="relative">
        {canL && (
          <button
            onClick={() => scroll(-1)}
            aria-label="Scroll left"
            className="hidden sm:grid place-items-center absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full glass-pill text-white opacity-0 group-hover/row:opacity-100 transition"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}
        {canR && (
          <button
            onClick={() => scroll(1)}
            aria-label="Scroll right"
            className="hidden sm:grid place-items-center absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full glass-pill text-white opacity-0 group-hover/row:opacity-100 transition"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
        <div ref={ref} className="flex gap-4 overflow-x-auto px-4 sm:px-8 pb-4 scrollbar-hide scroll-smooth">
          {items.map((item) => (
            <Card key={`${item.media_type ?? ""}-${item.id}`} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
