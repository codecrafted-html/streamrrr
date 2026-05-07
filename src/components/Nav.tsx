import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { Home, Film, Tv, Search } from "lucide-react";
import { useState } from "react";

export function Nav() {
  const loc = useLocation();
  const nav = useNavigate();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);

  const items = [
    { to: "/", label: "Home", icon: Home },
    { to: "/movies", label: "Movies", icon: Film },
    { to: "/tv", label: "TV", icon: Tv },
  ] as const;

  return (
    <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 w-full max-w-3xl">
      <div className="glass-pill rounded-full flex items-center gap-1 p-1.5 shadow-2xl">
        {items.map(({ to, label, icon: Icon }) => {
          const active = loc.pathname === to || (to !== "/" && loc.pathname.startsWith(to));
          return (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition ${
                active ? "bg-white text-black" : "text-white/80 hover:text-white"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{label}</span>
            </Link>
          );
        })}
        <div className="ml-auto flex items-center">
          {open ? (
            <form
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
                onBlur={() => setOpen(false)}
                placeholder="Search…"
                className="bg-transparent outline-none text-sm px-3 py-2 w-40 sm:w-56 placeholder:text-white/50"
              />
            </form>
          ) : (
            <button
              onClick={() => setOpen(true)}
              className="p-2.5 rounded-full text-white/80 hover:text-white"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
