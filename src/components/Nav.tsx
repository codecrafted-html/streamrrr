import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { Home, Film, Tv, Search, CircleUser, Trophy, X, LogOut, User as UserIcon } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { motion, LayoutGroup, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";

export function Nav() {
  const loc = useLocation();
  const nav = useNavigate();
  const { user } = useAuth();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenu(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const items = [
    { to: "/", label: "Home", icon: Home },
    { to: "/movies", label: "Movies", icon: Film },
    { to: "/tv", label: "TV", icon: Tv },
    { to: "/sports", label: "Sports", icon: Trophy },
  ] as const;

  const initial = user?.email?.[0]?.toUpperCase() ?? "";

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

          <div ref={menuRef} className="relative">
            {user ? (
              <button
                onClick={() => setMenu((v) => !v)}
                className="w-8 h-8 grid place-items-center rounded-full bg-gold text-black text-xs font-bold hover:opacity-90 transition"
                aria-label="Account"
              >
                {initial}
              </button>
            ) : (
              <Link
                to="/login"
                className="p-2.5 rounded-full text-white/80 hover:text-white transition-colors block"
                aria-label="Sign in"
              >
                <CircleUser className="w-4 h-4" />
              </Link>
            )}

            <AnimatePresence>
              {menu && user && (
                <motion.div
                  initial={{ opacity: 0, y: -6, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-3 w-60 glass-pill rounded-2xl p-2 shadow-2xl"
                >
                  <div className="px-3 py-2 border-b border-white/10 mb-1">
                    <div className="flex items-center gap-2 text-xs text-white/50">
                      <UserIcon className="w-3 h-3" /> Signed in as
                    </div>
                    <div className="text-sm font-medium truncate mt-0.5">{user.email}</div>
                  </div>
                  <button
                    onClick={async () => {
                      await supabase.auth.signOut();
                      setMenu(false);
                      nav({ to: "/" });
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-white/80 hover:text-white hover:bg-white/5 transition"
                  >
                    <LogOut className="w-4 h-4" /> Sign out
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </LayoutGroup>
    </header>
  );
}
