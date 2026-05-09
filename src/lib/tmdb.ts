const API_BASE = "https://api.themoviedb.org/3";
export const IMG = (path: string | null, size: "w200" | "w300" | "w500" | "w780" | "original" = "w500") =>
  path ? `https://image.tmdb.org/t/p/${size}${path}` : "";

const KEY = (import.meta.env.VITE_TMDB_API_KEY as string | undefined) || "f54051edf8ad18a9f88754072fc4db54";

export const hasTmdbKey = () => Boolean(KEY);

async function tmdb<T>(path: string, params: Record<string, string | number> = {}): Promise<T> {
  if (!KEY) throw new Error("Missing VITE_TMDB_API_KEY");
  const url = new URL(`${API_BASE}${path}`);
  url.searchParams.set("api_key", KEY);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, String(v));
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`TMDB ${res.status}`);
  return res.json();
}

export type Media = {
  id: number;
  title?: string;
  name?: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
  media_type?: "movie" | "tv";
};

export type MediaDetails = Media & {
  runtime?: number;
  genres: { id: number; name: string }[];
  number_of_seasons?: number;
  seasons?: { season_number: number; episode_count: number; name: string }[];
  imdb_id?: string;
  external_ids?: { imdb_id?: string };
};

export type Episode = { id: number; episode_number: number; name: string; still_path: string | null; overview: string };

export const trending = (type: "movie" | "tv" = "movie") =>
  tmdb<{ results: Media[] }>(`/trending/${type}/week`);
export const popular = (type: "movie" | "tv") =>
  tmdb<{ results: Media[] }>(`/${type}/popular`);
export const topRated = (type: "movie" | "tv") =>
  tmdb<{ results: Media[] }>(`/${type}/top_rated`);
export const nowPlaying = () => tmdb<{ results: Media[] }>(`/movie/now_playing`);
export const onTheAir = () => tmdb<{ results: Media[] }>(`/tv/on_the_air`);

export const search = (query: string) =>
  tmdb<{ results: Media[] }>(`/search/multi`, { query, include_adult: "false" });

export const details = (type: "movie" | "tv", id: string | number) =>
  tmdb<MediaDetails>(`/${type}/${id}`, { append_to_response: "external_ids" });

export const seasonEpisodes = (id: string | number, season: number) =>
  tmdb<{ episodes: Episode[] }>(`/tv/${id}/season/${season}`);

export type Video = { key: string; site: string; type: string; official: boolean; name: string };
export const videos = (type: "movie" | "tv", id: string | number) =>
  tmdb<{ results: Video[] }>(`/${type}/${id}/videos`);

export const pickTrailerKey = (vids: Video[] | undefined): string | undefined => {
  if (!vids?.length) return undefined;
  const yt = vids.filter((v) => v.site === "YouTube");
  return (
    yt.find((v) => v.type === "Trailer" && v.official)?.key ??
    yt.find((v) => v.type === "Trailer")?.key ??
    yt.find((v) => v.type === "Teaser")?.key ??
    yt[0]?.key
  );
};

export const embedUrl = (type: "movie" | "tv", imdbId: string, season?: number, episode?: number) =>
  type === "movie"
    ? `https://vidvault.ru/movie/${imdbId}`
    : `https://vidvault.ru/tv/${imdbId}/${season ?? 1}/${episode ?? 1}`;
