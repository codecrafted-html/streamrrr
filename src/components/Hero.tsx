import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { IMG, type Media, videos, pickTrailerKey } from "@/lib/tmdb";
import { Play, Info, Volume2, VolumeX } from "lucide-react";

export function Hero({ item }: { item: Media }) {
  const type = item.media_type ?? (item.title ? "movie" : "tv");
  const title = item.title ?? item.name ?? "";

  const { data } = useQuery({
    queryKey: ["videos", type, item.id],
    queryFn: () => videos(type, item.id),
  });
  const trailerKey = pickTrailerKey(data?.results);

  const [muted, setMuted] = useState(true);
  const [showVideo, setShowVideo] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Delay video mount so the backdrop shows first, then trailer fades in
  useEffect(() => {
    if (!trailerKey) return;
    const t = setTimeout(() => setShowVideo(true), 600);
    return () => clearTimeout(t);
  }, [trailerKey]);

  // Send YouTube postMessage to toggle mute without reloading
  useEffect(() => {
    const win = iframeRef.current?.contentWindow;
    if (!win) return;
    win.postMessage(
      JSON.stringify({ event: "command", func: muted ? "mute" : "unMute", args: [] }),
      "*"
    );
  }, [muted, showVideo]);

  const ytSrc = trailerKey
    ? `https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=1&controls=0&loop=1&playlist=${trailerKey}&modestbranding=1&playsinline=1&rel=0&showinfo=0&iv_load_policy=3&disablekb=1&enablejsapi=1`
    : null;

  return (
    <div className="relative h-[85vh] min-h-[600px] w-full overflow-hidden">
      {/* Backdrop */}
      {item.backdrop_path && (
        <img
          src={IMG(item.backdrop_path, "original")}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      {/* Trailer video layer */}
      {ytSrc && showVideo && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <iframe
            ref={iframeRef}
            src={ytSrc}
            title={`${title} trailer`}
            allow="autoplay; encrypted-media"
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[177.78vh] min-w-full h-[56.25vw] min-h-full border-0 animate-in fade-in duration-700"
          />
        </div>
      )}

      {/* Gradients */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/20" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/40 to-transparent" />

      {/* Content */}
      <div className="relative h-full flex items-end sm:items-center px-6 sm:px-12 pb-20">
        <div className="max-w-2xl space-y-5">
          <h1 className="text-5xl sm:text-7xl font-black tracking-tight leading-none">
            {title}
          </h1>
          <p className="text-base sm:text-lg text-white/80 line-clamp-3 max-w-xl">{item.overview}</p>
          <div className="flex gap-3 pt-2 items-center">
            <Link
              to="/watch/$type/$id"
              params={{ type, id: String(item.id) }}
              className="inline-flex items-center gap-2 bg-white text-black px-7 py-3 rounded-full font-semibold hover:bg-white/90 transition shadow-xl"
            >
              <Play className="w-5 h-5 fill-black" /> Play
            </Link>
            <Link
              to="/watch/$type/$id"
              params={{ type, id: String(item.id) }}
              className="inline-flex items-center gap-2 glass-pill px-7 py-3 rounded-full font-semibold text-white hover:bg-white/10 transition"
            >
              <Info className="w-5 h-5" /> Info
            </Link>
            {ytSrc && (
              <button
                onClick={() => setMuted((m) => !m)}
                className="glass-pill p-3 rounded-full text-white hover:bg-white/10 transition"
                aria-label={muted ? "Unmute" : "Mute"}
              >
                {muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
