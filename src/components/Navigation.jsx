"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import Avatar from "@/src/components/ui/Avatar";
 

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/matching", label: "Matching" },
  { href: "/projects", label: "Projects" },
];

export default function Navigation() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [session, setSession] = useState(null);

  useEffect(()=>{
    // Set static session for demo
    setSession({
      user: {
        email: 'alex.johnson@student.unsw.edu.au',
        id: 'user-1'
      }
    });
  },[]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 6);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const activeIndex = useMemo(() => navLinks.findIndex(l => l.href === (pathname || "/")), [pathname]);

  const LinkItem = ({ href, label, onClick }) => {
    const isActive = pathname === href || (href !== "/" && pathname?.startsWith(href));
    return (
      <Link
        href={href}
        onClick={(e) => {
          setDropdownOpen(false);
          setOpen(false);
          startTransition(() => {});
          onClick && onClick(e);
        }}
        className={`relative px-3 py-2 text-sm transition-transform duration-200 ${
          isActive ? "text-white" : "text-white/80 hover:text-white"
        } hover:scale-[1.02]`}
      >
        {label}
        {isActive && (
          <span className="absolute left-1/2 -bottom-0.5 h-[2px] w-8 -translate-x-1/2 rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#06B6D4]" />)
        }
      </Link>
    );
  };

  return (
    <>
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className={`fixed top-0 left-0 right-0 z-50`}
      >
        <div className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8`}> 
          <div className={`mt-2 mb-2 rounded-xl border ${scrolled ? "shadow-lg" : "shadow"} border-white/10 backdrop-blur supports-[backdrop-filter]:bg-[rgba(15,15,35,0.8)] bg-[rgba(15,15,35,0.8)]`}> 
            <div className="flex h-14 items-center justify-between px-3">
              {/* Left: Logo */}
              <Link href="/" className="text-sm font-semibold">
                <span className="bg-gradient-to-r from-[#8B5CF6] via-[#3B82F6] to-[#06B6D4] bg-clip-text text-transparent">Nexus</span>
              </Link>

              {/* Center: Links (desktop) */}
              <div className="hidden md:flex items-center gap-2">
                {navLinks.map((l) => (
                  <LinkItem key={l.href} href={l.href} label={l.label} />
                ))}
              </div>

              {/* Right: Avatar + dropdown + hamburger */}
              <div className="flex items-center gap-2">
                <div className="relative hidden md:block">
                  <button
                    className="rounded-md p-1.5 hover:bg-white/5 transition"
                    onClick={() => setDropdownOpen((v) => !v)}
                    aria-haspopup="menu"
                    aria-expanded={dropdownOpen}
                  >
                    <Avatar name={session?.user?.email || 'You'} size={28} />
                  </button>
                  <AnimatePresence>
                    {dropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-44 rounded-md border border-white/10 bg-[rgba(15,15,35,0.95)] backdrop-blur p-1 shadow-xl"
                        role="menu"
                      >
                        <Link href="/profile" className="block rounded-md px-3 py-2 text-sm text-white/90 hover:bg-white/5" onClick={()=>setDropdownOpen(false)} role="menuitem">Profile</Link>
                        <Link href="/dashboard" className="block rounded-md px-3 py-2 text-sm text-white/90 hover:bg-white/5" onClick={()=>setDropdownOpen(false)} role="menuitem">Dashboard</Link>
                        <button className="w-full text-left rounded-md px-3 py-2 text-sm text-white/90 hover:bg-white/5" role="menuitem" onClick={()=>{location.href='/auth/login';}}>Sign out</button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <button
                  className="md:hidden rounded-md p-2 hover:bg-white/5 transition"
                  onClick={() => setOpen(true)}
                  aria-label="Open menu"
                >
                  <span>☰</span>
                </button>
              </div>
            </div>
            {/* loading bar */}
            <AnimatePresence>
              {isPending && (
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: "90%" }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="h-0.5 rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#06B6D4] mx-3"
                />
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur"
            onClick={() => setOpen(false)}
          >
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="ml-auto h-full w-72 bg-[rgba(15,15,35,0.92)] border-l border-white/10 p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold bg-gradient-to-r from-[#8B5CF6] via-[#3B82F6] to-[#06B6D4] bg-clip-text text-transparent">Nexus</span>
                <button className="rounded-md p-2 hover:bg-white/5" onClick={() => setOpen(false)} aria-label="Close menu">✕</button>
              </div>
              <div className="flex flex-col gap-1">
                {navLinks.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className={`rounded-md px-3 py-2 text-sm ${pathname === l.href ? 'bg-white/5 text-white' : 'text-white/80 hover:text-white hover:bg-white/5'}`}
                    onClick={() => setOpen(false)}
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}


