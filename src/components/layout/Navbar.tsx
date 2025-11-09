"use client";

import Link from "next/link";
import ThemeLogo from "@/components/Logo/ThemeLogo";
import React, { useState, useEffect, useRef } from "react";
import type { AdminUser } from "@/lib/schema/zod-schemas";
import { ModeToggle } from "../Buttons/toggle-theme-button";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import authClient, { useSession } from "@/lib/client/auth-client";
import { getNavbarCategories } from "@/lib/actions/category";

type NavCategory = { id: string; name: string };

export function Navbar(): React.ReactElement {
  const router = useRouter();
  const { data: session } = useSession();
  const isAuthenticated = !!session?.user;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [categories, setCategories] = useState<NavCategory[]>([]);
  // Sök-state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement | null>(null);
  const searchButtonRef = useRef<HTMLButtonElement | null>(null);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [subscriptions, setSubscription] = useState<Array<{ status?: string }>>(
    []
  );

  // Hantera sök-submit
  function handleSearchSubmit(e?: React.FormEvent) {
    if (e) e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;
    router.push(`/sok?q=${encodeURIComponent(q)}`);
    setSearchQuery("");
    setMobileOpen(false);
  }

  useEffect(() => {
    // Close pop-out search when clicking outside
    function onDocClick(e: MouseEvent) {
      const target = e.target as Node | null;
      if (
        searchOpen &&
        searchRef.current &&
        !searchRef.current.contains(target) &&
        searchButtonRef.current &&
        !searchButtonRef.current.contains(target)
      ) {
        setSearchOpen(false);
      }
    }

    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [searchOpen]);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      if (session?.user.id) {
        const response = await authClient.subscription.list();
        setSubscription(response.data || []);
      }
    };
    fetchSubscriptions();
  }, [session?.user.id]);
  const activeSubscription = subscriptions.find(
    (sub) => sub.status === "active" || sub.status === "trialing"
  );

  async function handleLogout() {
    await authClient.signOut();
    setMobileOpen(false);
    // refresh so UI updates
    router.refresh();
    router.push("/");
  }

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const result = await getNavbarCategories();
        if (mounted && result.ok) {
          setCategories(result.categories || []);
        }
      } catch (err) {
        console.error("Could not load navbar categories", err);
      } finally {
        if (mounted) setLoadingCategories(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <>
      <header className="shadow-md sticky top-0 z-50 bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4 md:justify-start md:space-x-10">
            {/* Logo och Titel-sektion */}
            <Link href="/" className="flex items-center space-x-3">
              <span className="text-3xl font-semibold text-secondary-foreground">
                Dagens Dos
              </span>
              <ThemeLogo width={100} height={60} className="rounded" priority />
            </Link>

            {/* Huvudnavigering (Desktop) - Startsida + Kategorier-dropdown */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link
                href="/"
                className="whitespace-nowrap text-lg font-medium text-secondary-foreground"
              >
                Startsida
              </Link>

              <Link
                href="/redaktorens-val"
                className="whitespace-nowrap text-lg font-medium text-secondary-foreground"
              >
                Redaktörens val
              </Link>

              {/* Kategorier dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    id="kategorier-dropdown-trigger"
                    type="button"
                    className="whitespace-nowrap text-lg font-medium bg-transparent border-0 p-0 cursor-pointer text-secondary-foreground"
                  >
                    Kategorier
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="start">
                  <DropdownMenuGroup>
                    {loadingCategories ? (
                      <div className="px-3 py-2 text-sm text-muted-foreground">
                        Laddar...
                      </div>
                    ) : (
                      categories.map((cat) => (
                        <DropdownMenuItem key={cat.id} asChild>
                          <Link
                            href={`/kategori/${cat.id}`}
                            className="w-full block"
                          >
                            {cat.name}
                          </Link>
                        </DropdownMenuItem>
                      ))
                    )}
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>

              {(session?.user as unknown as AdminUser)?.role === "admin" && (
                <Link
                  href="/admin"
                  className="whitespace-nowrap text-lg font-medium text-secondary-foreground"
                >
                  Admin
                </Link>
              )}
              {(session?.user as unknown as AdminUser)?.role === "editor" && (
                <Link
                  href="/admin"
                  className="whitespace-nowrap text-lg font-medium text-secondary-foreground"
                >
                  Editor&apos;s page
                </Link>
              )}
            </nav>

            <div className="hidden md:flex items-center justify-end md:flex-1 gap-4">
              {/* Desktop-sök: visa endast ikon, öppnar pop-out sökfält */}
              <div className="hidden md:flex items-center gap-2 relative">
                <Button variant="outline" size="icon" asChild>
                  <button
                    ref={searchButtonRef}
                    type="button"
                    onClick={() => setSearchOpen((s) => !s)}
                    aria-expanded={searchOpen}
                    aria-label="Öppna sök"
                  >
                    <svg
                      className="h-[1.2rem] w-[1.2rem] text-muted-foreground"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 21l-4.35-4.35M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16z"
                      />
                    </svg>
                    <span className="sr-only">Sök</span>
                  </button>
                </Button>

                {searchOpen && (
                  <div
                    ref={searchRef}
                    className="absolute right-0 top-full mt-2 w-80 bg-card border border-border rounded-md p-3 shadow-lg z-50"
                  >
                    <form
                      onSubmit={handleSearchSubmit}
                      className="flex items-center gap-2"
                    >
                      <label htmlFor="nav-search" className="sr-only">
                        Sök
                      </label>
                      <input
                        id="nav-search"
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Sök..."
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === "Escape") setSearchOpen(false);
                        }}
                        className="w-full border border-border text-foreground rounded-md px-3 py-2 text-sm bg-transparent"
                      />
                      <button
                        type="submit"
                        className="px-3 py-2 rounded-md bg-primary text-secondary-foreground text-sm"
                      >
                        Sök
                      </button>
                    </form>
                  </div>
                )}
              </div>
              <ModeToggle />

              {!isAuthenticated ? (
                <>
                  <Link
                    href="/logga-in"
                    className="whitespace-nowrap bg-primary text-primary-foreground hover:bg-primary/90 py-1 px-2 rounded-md inline-flex items-center justify-center min-w-20 h-8 text-sm font-semibold"
                  >
                    Logga in
                  </Link>
                  <Link
                    href="/registrera"
                    className="whitespace-nowrap bg-primary text-primary-foreground hover:bg-primary/90 py-1 px-2 rounded-md inline-flex items-center justify-center min-w-20 h-8 text-sm font-semibold"
                  >
                    Registrera
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/mina-sidor"
                    className="whitespace-nowrap bg-primary text-primary-foreground hover:bg-primary/90 py-1 px-2 rounded-md inline-flex items-center justify-center min-w-20 h-8 text-sm font-semibold"
                  >
                    Mina sidor
                  </Link>
                  {/*
                    Om användaren inte har en aktiv prenumeration, visa "Prenumerera"-knappen
                    Om användaren har en aktiv prenumeration, visa inget här
                    om användaren är admin, visa inget här heller
                    om användaren är vanlig användare utan prenumeration, visa knappen
                  */}
                  {activeSubscription?.status === "active" ? null : (
                    <Button
                      size="sm"
                      onClick={async () => {
                        await authClient.subscription.upgrade({
                          plan: "Premium",
                          successUrl: "/",
                          cancelUrl: "/",
                        });
                      }}
                    >
                      Prenumerera
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLogout}
                    className="min-w-20 h-8 text-sm"
                  >
                    Logga ut
                  </Button>
                </>
              )}
            </div>

            {/* Mobil: statisk placerad meny som öppnas med state (undviker SSR/klient mismatch) */}
            <div className="md:hidden">
              <div>
                <button
                  type="button"
                  aria-expanded={mobileOpen}
                  aria-controls="mobile-menu"
                  onClick={() => setMobileOpen((s) => !s)}
                  className="flex items-center gap-3 p-2 rounded-md hover:bg-muted"
                >
                  {mobileOpen ? (
                    /* Stäng-ikon */
                    <svg
                      className="h-6 w-6 text-primary-foreground"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  ) : (
                    /* Hamburgare-ikon */
                    <svg
                      className="h-6 w-6 text-primary-foreground"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    </svg>
                  )}
                  <span className="sr-only">Öppna meny</span>
                </button>

                {mobileOpen && (
                  <nav
                    id="mobile-menu"
                    className="mt-2 rounded-md p-4 shadow-lg space-y-3 w-full max-h-[80vh] overflow-auto z-50 bg-secondary"
                  >
                    <div className="flex flex-col space-y-3">
                      {/* Mobil-sök */}
                      <form
                        onSubmit={handleSearchSubmit}
                        className="flex items-center gap-2"
                      >
                        <label htmlFor="mobile-nav-search" className="sr-only">
                          Sök
                        </label>
                        <input
                          id="mobile-nav-search"
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Sök..."
                          className="w-full border border-border rounded-md px-3 py-2 text-sm bg-transparent"
                        />
                      </form>
                      {loadingCategories ? (
                        <div className="block text-lg font-medium text-foreground">
                          Laddar...
                        </div>
                      ) : (
                        categories.map((cat) => (
                          <Link
                            key={cat.id}
                            href={`/kategori/${cat.id}`}
                            className="block text-lg font-medium text-secondary-foreground"
                            onClick={() => setMobileOpen(false)}
                          >
                            {cat.name}
                          </Link>
                        ))
                      )}
                      <Link
                        href="/redaktorens-val"
                        className="block text-lg font-medium text-secondary-foreground"
                        onClick={() => setMobileOpen(false)}
                      >
                        Redaktörens val
                      </Link>
                      {(session?.user as unknown as AdminUser)?.role ===
                        "admin" && (
                        <Link
                          href="/admin"
                          className="block text-lg font-medium text-secondary-foreground"
                          onClick={() => setMobileOpen(false)}
                        >
                          Admin
                        </Link>
                      )}
                    </div>

                    <div className="pt-2 border-t border-muted-foreground/20 flex flex-col gap-3">
                      <div className="pt-2">
                        <ModeToggle />
                      </div>
                      {!isAuthenticated ? (
                        <>
                          <Link
                            href="/logga-in"
                            className="block bg-primary text-primary-foreground hover:bg-primary/90 py-1 px-2 rounded-md min-w-20 h-8 text-sm font-semibold text-center"
                            onClick={() => setMobileOpen(false)}
                          >
                            Logga in
                          </Link>
                          <Link
                            href="/registrera"
                            className="block bg-primary text-primary-foreground hover:bg-primary/90 py-1 px-2 rounded-md min-w-20 h-8 text-sm font-semibold text-center"
                            onClick={() => setMobileOpen(false)}
                          >
                            Registrera
                          </Link>
                        </>
                      ) : (
                        <>
                          <Link
                            href="/mina-sidor"
                            className="block bg-primary text-primary-foreground hover:bg-primary/90 py-1 px-2 rounded-md min-w-20 h-8 text-sm font-semibold text-center"
                            onClick={() => setMobileOpen(false)}
                          >
                            Mina sidor
                          </Link>
                          <button
                            onClick={handleLogout}
                            className="block font-medium text-primary-foreground hover:text-primary min-w-20 h-8 text-sm"
                          >
                            Logga ut
                          </button>
                        </>
                      )}
                    </div>
                  </nav>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* Varningsraden under länkar och knappar
        <div className="w-full overflow-hidden">
          <div
            role="status"
            aria-live="polite"
            className="marquee-bar"
            style={{
              backgroundColor: "var(--primary)",
              color: "var(--accent-foreground)",
              fontWeight: "bold",
            }}
          >
            <div
              className="marquee"
              style={{
                display: "inline-block",
                paddingLeft: "100%",
                whiteSpace: "nowrap",
                animation: "marquee 40s linear infinite",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLDivElement).style.animationPlayState =
                  "paused")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLDivElement).style.animationPlayState =
                  "running")
              }
            >
              VARNING TILL ALLMÄNHETEN — En man som identifierar sig som en
              Kalkong springer runt med blöjja på södermalm, men va inte orolig
              han är inte farlig även om det är mycket obehagligt!
            </div>
          </div>

          <style>{`
            @keyframes marquee {
              0% { transform: translateX(100%); }
              100% { transform: translateX(-100%); }
            }
            .marquee { animation-play-state: running; }
            .marquee-bar { padding: 0.5rem 0; }
            .marquee:hover { animation-play-state: paused; }
            @media (prefers-reduced-motion: reduce) {
              .marquee { animation: none !important; transform: none !important; }
            }
          `}</style> */}
        {/* </div> */}
      </header>
    </>
  );
}
