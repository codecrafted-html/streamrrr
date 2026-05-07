import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { Home, Film, Tv, Search, CircleUser, Trophy, X } from "lucide-react";
import { useState } from "react";
import { motion, LayoutGroup } from "framer-motion";

export function Nav() {
  const loc = useLocation();
  const nav = useNavigate();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);

  const items = [
    { to: "/", label: "Home", icon: Home },
    { to: "/movies", label: "Movies", icon: Film },
    { to: "/tv", label: "TV", icon: Tv },
    { to: "/sports", label: "Sports", icon: Trophy },
  ] as const;

  return (
    <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 w-auto">
      <LayoutGroup id="nav">
        <div className="glass-pill rounded-full flex items-center gap-0.5 p-1.5">
          {items.map(({ to, label, icon: Icon }) => {
            const active = loc.pathname === to || (to !== "/" && loc.pathname.startsWith(to));
            return (
              <Link
                key={to}
                to={to}
                className={`relative flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                  active ? "text-black" : "text-white/80 hover:text-white"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 bg-white rounded-full"
                    transition={{ type: "spring", stiffness: 400, damping: 36 }}
                  />
                )}
                <Icon className="w-4 h-4 relative z-10 shrink-0" />
                <span className="hidden sm:inline relative z-10">{label}</span>
              </Link>
            );
          })}

          <div className="mx-1 h-6 w-px bg-white/10" />

          {open ? (
            <form
              className="flex items-center"
              onSubmit={(e) => {
                e.preventDefault();
                if (q.trim()) {
                  nav({ to: "/search", search: { q: q.trim() } });
                  setOpen(false);
                }
              }}
            >
              <input
                autoFocus
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search…"
                className="bg-transparent outline-none text-sm px-3 py-2 w-32 sm:w-48 placeholder:text-white/50"
              />
              <button
                type="button"
                onClick={() => { setOpen(false); setQ(""); }}
                className="p-2 rounded-full text-white/70 hover:text-white"
                aria-label="Close search"
              >
                <X className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <button
              onClick={() => setOpen(true)}
              className="p-2.5 rounded-full text-white/80 hover:text-white transition-colors"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </button>
          )}

          <button
            className="p-2.5 rounded-full text-white/80 hover:text-white transition-colors"
            aria-label="Account"
          >
            <CircleUser className="w-4 h-4" />
          </button>
        </div>
      </LayoutGroup>
    </header>
  );
}
