import { supabase } from "@/integrations/supabase/client";

export type WatchRow = {
  id: string;
  tmdb_id: number;
  media_type: "movie" | "tv";
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  season: number | null;
  episode: number | null;
  progress_seconds: number;
  duration_seconds: number;
  updated_at: string;
};

export async function listWatchProgress(): Promise<WatchRow[]> {
  const { data, error } = await supabase
    .from("watch_progress")
    .select("*")
    .order("updated_at", { ascending: false })
    .limit(20);
  if (error) throw error;
  return (data ?? []) as WatchRow[];
}

export async function upsertWatchProgress(row: {
  tmdb_id: number;
  media_type: "movie" | "tv";
  title: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
  season?: number | null;
  episode?: number | null;
}) {
  const { data: u } = await supabase.auth.getUser();
  if (!u.user) return;
  const { error } = await supabase.from("watch_progress").upsert(
    {
      user_id: u.user.id,
      ...row,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,tmdb_id,media_type" },
  );
  if (error) console.error(error);
}

export async function removeWatchProgress(tmdb_id: number, media_type: "movie" | "tv") {
  await supabase
    .from("watch_progress")
    .delete()
    .match({ tmdb_id, media_type });
}
