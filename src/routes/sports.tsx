import { createFileRoute } from "@tanstack/react-router";
import { Trophy } from "lucide-react";
import { ApiKeyBanner } from "@/components/ApiKeyBanner";

export const Route = createFileRoute("/sports")({
  head: () => ({ meta: [{ title: "Sports — Streamr" }] }),
  component: Sports,
});

function Sports() {
  return (
    <div className="min-h-screen pt-32 pb-20 px-4 sm:px-8 flex flex-col items-center justify-center text-center">
      <div className="glass-card rounded-3xl p-12 max-w-lg">
        <Trophy className="w-12 h-12 mx-auto mb-4 text-gold" />
        <h1 className="text-4xl font-black mb-2">Sports</h1>
        <p className="text-white/70">Live sports are coming soon to Streamr.</p>
      </div>
      <ApiKeyBanner />
    </div>
  );
}
