"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";

function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

const base = "relative overflow-hidden inline-flex items-center justify-center rounded-[10px] font-medium transition-all duration-300 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white/20 disabled:opacity-60 disabled:pointer-events-none";

const variants = {
  primary: "btn-gradient text-white shadow-md hover:shadow-lg hover:-translate-y-0.5",
  secondary: "border border-white/15 bg-transparent text-white hover:bg-white/5 hover:-translate-y-0.5",
  ghost: "bg-transparent text-white hover:bg-white/5",
};

const sizes = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-4 text-sm",
  lg: "h-12 px-6 text-base",
};

export default function Button({
  asChild,
  variant = "primary",
  size = "md",
  className,
  children,
  loading = false,
  leftIcon,
  rightIcon,
  onClick,
  ...props
}) {
  const Comp = asChild ? motion.span : motion.button;
  const ref = useRef(null);
  const [ripples, setRipples] = useState([]);

  const handleClick = (e) => {
    if (onClick) onClick(e);
    // Ripple
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    const newRipple = { id: Date.now(), x, y, size };
    setRipples((r) => [...r, newRipple]);
    setTimeout(() => setRipples((r) => r.filter((rp) => rp.id !== newRipple.id)), 600);
  };

  return (
    <Comp
      ref={ref}
      whileTap={{ scale: 0.98 }}
      className={cx(base, variants[variant], sizes[size], "backdrop-blur-sm", className)}
      aria-busy={loading}
      onClick={handleClick}
      {...props}
    >
      {leftIcon && (
        <span className={cx("mr-2 inline-flex items-center transition-transform", loading && "opacity-50")}>{leftIcon}</span>
      )}
      <span className={cx("inline-flex items-center", loading && "opacity-70")}>{children}</span>
      {rightIcon && (
        <span className={cx("ml-2 inline-flex items-center transition-transform", loading && "opacity-50")}>{rightIcon}</span>
      )}
      {loading && (
        <span className="absolute inset-0 grid place-items-center">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
        </span>
      )}
      {/* ripples */}
      {ripples.map((r) => (
        <span
          key={r.id}
          className="pointer-events-none absolute rounded-full bg-white/30 animate-[ripple_0.6s_ease-out]"
          style={{ left: r.x, top: r.y, width: r.size, height: r.size }}
        />
      ))}
      <style jsx>{`
        @keyframes ripple {
          from { transform: scale(0); opacity: .5; }
          to { transform: scale(2.5); opacity: 0; }
        }
      `}</style>
    </Comp>
  );
}


