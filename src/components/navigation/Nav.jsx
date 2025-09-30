"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Avatar from "@/src/components/ui/Avatar";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/matching", label: "Matching" },
  { href: "/projects", label: "Projects" },
  { href: "/profile", label: "Profile" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  return (
    <nav className="sticky top-0 z-40 w-full border-b border-black/10 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-md bg-black text-white grid place-items-center text-sm font-bold">NT</div>
            <Link href="/dashboard" className="text-sm font-semibold tracking-wide">
              Nexus Team Builder
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-6">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className="text-sm text-gray-700 hover:text-black">
                {l.label}
              </Link>
            ))}
            <Link href="/profile" className="ml-2">
              <Avatar name="You" size={28} />
            </Link>
          </div>

          <button
            className="md:hidden inline-flex items-center justify-center rounded-md p-2 hover:bg-gray-100"
            onClick={() => setOpen((v) => !v)}
            aria-label="Open menu"
          >
            <span className="i-heroicons-bars-3 text-xl">☰</span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-t border-black/10 bg-white"
          >
            <div className="px-4 py-3 flex flex-col gap-2">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="text-sm py-2"
                  onClick={() => setOpen(false)}
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}


