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
  const [ended, setEnded] = useState(false);
  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!trailerKey) return;
    const t = setTimeout(() => setShowVideo(true), 600);
    return () => clearTimeout(t);
  }, [trailerKey]);

  // Load YouTube IFrame API and instantiate a chromeless player
  useEffect(() => {
    if (!showVideo || !trailerKey || !containerRef.current) return;

    let cancelled = false;

    const init = () => {
      if (cancelled || !containerRef.current) return;
      // @ts-ignore
      const YT = window.YT;
      if (!YT || !YT.Player) return;
      playerRef.current = new YT.Player(containerRef.current, {
        videoId: trailerKey,
        playerVars: {
          autoplay: 1,
          mute: 1,
          controls: 0,
          modestbranding: 1,
          rel: 0,
          showinfo: 0,
          iv_load_policy: 3,
          disablekb: 1,
          fs: 0,
          playsinline: 1,
          loop: 1,
          playlist: trailerKey,
        },
        events: {
          onReady: (e: any) => {
            e.target.mute();
            e.target.playVideo();
          },
          onStateChange: (e: any) => {
            // 0 = ended
            if (e.data === 0) setEnded(true);
          },
        },
      });
    };

    // @ts-ignore
    if (window.YT && window.YT.Player) {
      init();
    } else {
      const existing = document.querySelector('script[src="https://www.youtube.com/iframe_api"]');
      if (!existing) {
        const tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        document.body.appendChild(tag);
      }
      // @ts-ignore
      const prev = window.onYouTubeIframeAPIReady;
      // @ts-ignore
      window.onYouTubeIframeAPIReady = () => {
        if (typeof prev === "function") prev();
        init();
      };
    }

    return () => {
      cancelled = true;
      try {
        playerRef.current?.destroy?.();
      } catch {}
    };
  }, [showVideo, trailerKey]);

  // Toggle mute via API
  useEffect(() => {
    const p = playerRef.current;
    if (!p) return;
    try {
      if (muted) p.mute?.();
      else p.unMute?.();
    } catch {}
  }, [muted]);

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

      {/* Trailer video layer — chromeless, scaled to crop any residual UI */}
      {trailerKey && showVideo && !ended && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[177.78vh] min-w-full h-[56.25vw] min-h-full scale-125">
            <div ref={containerRef} className="w-full h-full" />
          </div>
          {/* Block any accidental player UI from showing through */}
          <div className="absolute inset-0" />
        </div>
      )}

      {/* Gradients */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/20 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/40 to-transparent pointer-events-none" />

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
            {trailerKey && (
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
