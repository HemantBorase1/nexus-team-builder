"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";

function cx(...c){return c.filter(Boolean).join(" ");}

export default function Select({
  label,
  options = [],
  placeholder = "Select...",
  className = "",
  variant = "default", // default | error | success
  size = "md", // sm | md | lg
  value,
  onChange,
  disabled,
  searchable = false,
  ...props
}) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const buttonRef = useRef(null);
  const listRef = useRef(null);

  const opts = useMemo(() => options.map(o => (typeof o === 'string' ? { value:o, label:o } : o)), [options]);
  const selected = opts.find(o => o.value === value);
  const filtered = useMemo(() => !searchable || !query ? opts : opts.filter(o => o.label.toLowerCase().includes(query.toLowerCase())), [opts, searchable, query]);

  const sizes = { sm: "h-8 text-sm", md: "h-10 text-sm", lg: "h-12 text-base" };
  const paddingY = { sm: "py-2", md: "py-2.5", lg: "py-3" };

  const borderGradient = variant === 'error'
    ? 'linear-gradient(45deg,#EF4444,#F59E0B)'
    : variant === 'success'
    ? 'linear-gradient(45deg,#10B981,#06B6D4)'
    : 'linear-gradient(45deg,#8B5CF6,#06B6D4)';

  useEffect(() => {
    const onKey = (e) => {
      if (!open) return;
      const items = listRef.current?.querySelectorAll('[role="option"]');
      if (!items || items.length === 0) return;
      const currentIndex = Array.from(items).findIndex(el => el.getAttribute('aria-selected') === 'true');
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const next = items[Math.min(items.length - 1, currentIndex + 1)] || items[0];
        next?.focus();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const prev = items[Math.max(0, currentIndex - 1)] || items[items.length-1];
        prev?.focus();
      } else if (e.key === 'Escape') {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const controlStyles = {
    background: open
      ? `linear-gradient(#1A1A2E,#1A1A2E) padding-box, ${borderGradient} border-box`
      : undefined,
  };

  return (
    <div className={cx("w-full", disabled && "opacity-50 cursor-not-allowed", className)}>
      <div className="relative">
        <button
          id={id}
          ref={buttonRef}
          type="button"
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className={cx(
            "relative w-full rounded-[8px] border bg-[#1A1A2E] text-white text-left px-4",
            paddingY[size], sizes[size],
            "border-[1px] border-[rgba(139,92,246,0.3)] focus:outline-none",
            open && "shadow-[0_0_20px_rgba(139,92,246,0.3)]",
          )}
          style={controlStyles}
          {...props}
        >
          {/* Floating label */}
          {label && (
            <span className={cx(
              "pointer-events-none absolute left-4 transition-all ease-out",
              selected || open ? "-top-2 text-xs px-1 bg-[#1A1A2E] text-white/70" : "top-1/2 -translate-y-1/2 text-sm text-white/60"
            )}>
              <span className="bg-gradient-to-r from-[#8B5CF6] to-[#06B6D4] bg-clip-text text-transparent">{label}</span>
            </span>
          )}

          <span className={cx("block truncate", (!selected && label) ? "pt-3" : "")}>{selected ? selected.label : placeholder}</span>

          {/* Chevron */}
          <span className={cx("absolute right-3 top-1/2 -translate-y-1/2 text-[#8B5CF6] transition-transform", open && "rotate-180")}>▾</span>
        </button>

        {/* Dropdown */}
        <div className="relative">
          <div className={cx(
            "absolute z-30 mt-2 w-full origin-top-left",
            )}
          >
            <Animate show={open}>
              <div
                className="rounded-md border border-[rgba(139,92,246,0.3)] bg-[#1A1A2E]/95 backdrop-blur shadow-[0_10px_30px_rgba(0,0,0,0.5)] overflow-hidden"
              >
                {searchable && (
                  <div className="p-2 border-b border-white/10">
                    <input
                      autoFocus
                      value={query}
                      onChange={(e)=>setQuery(e.target.value)}
                      placeholder="Search..."
                      className="w-full rounded bg-[#0F0F23] px-2 py-2 text-sm text-white placeholder:text-[#A0A0B0] outline-none border border-white/10"
                    />
                  </div>
                )}
                <ul
                  role="listbox"
                  ref={listRef}
                  className="max-h-52 overflow-auto scrollbar-thin"
                  style={{ scrollbarColor: "#8B5CF6 #0F0F23" }}
                >
                  {filtered.map((opt) => {
                    const isSelected = opt.value === value;
                    return (
                      <li
                        key={opt.value}
                        role="option"
                        aria-selected={isSelected}
                        tabIndex={0}
                        onClick={() => { onChange && onChange({ target: { value: opt.value }}); setOpen(false); setQuery(""); }}
                        className={cx(
                          "px-3 py-2 text-sm cursor-pointer transition-colors",
                          isSelected
                            ? "bg-[linear-gradient(45deg,#8B5CF6,#06B6D4)] text-white"
                            : "bg-[#1A1A2E] text-white hover:bg-[rgba(139,92,246,0.2)]"
                        )}
                      >
                        <span className={cx(isSelected && "drop-shadow")}>{opt.label}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </Animate>
          </div>
        </div>
      </div>
    </div>
  );
}

function Animate({ show, children }){
  const [mounted, setMounted] = useState(show);
  const [render, setRender] = useState(show);
  useEffect(()=>{
    if (show){ setMounted(true); setRender(true);} else { setTimeout(()=>setRender(false), 180);} 
  },[show]);
  return (
    <div
      aria-hidden={!mounted}
      style={{
        transformOrigin:'top',
        transition:'opacity .18s ease, transform .18s ease',
        opacity: show ? 1 : 0,
        transform: show ? 'translateY(0px)' : 'translateY(-4px)'
      }}
    >
      {render ? children : null}
    </div>
  );
}


