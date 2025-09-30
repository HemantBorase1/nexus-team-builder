"use client";

import { useState } from "react";

const sizeMap = { sm: 28, md: 40, lg: 56, xl: 80 };

export default function Avatar({ src, name = "?", size = 40, status = "online", facultyColor = ["#8B5CF6", "#06B6D4"], className = "", loading = "lazy" }) {
  const [error, setError] = useState(false);
  const initials = (name || "?")
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const gradient = `conic-gradient(from 180deg at 50% 50%, ${facultyColor[0]}, ${facultyColor[1]})`;
  const pixelSize = typeof size === 'string' ? (sizeMap[size] || 40) : size;
  return (
    <div className={`relative inline-block ${className}`} style={{ width: pixelSize, height: pixelSize }}>
      <div className="rounded-full p-[2px]" style={{ background: gradient }}>
        <div className="rounded-full overflow-hidden bg-gradient-to-br from-[#0F0F23] to-[#111127] grid place-items-center hover:scale-[1.03] transition-transform" style={{ width: pixelSize - 4, height: pixelSize - 4 }}>
          {!error && src ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={src} alt={name} loading={loading} onError={() => setError(true)} className="w-full h-full object-cover" />
          ) : (
            <span className="text-xs font-semibold bg-gradient-to-r from-[#8B5CF6] to-[#06B6D4] bg-clip-text text-transparent">
              {initials}
            </span>
          )}
        </div>
      </div>
      <span
        aria-label={status === 'online' ? 'Online' : 'Offline'}
        className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full ring-2 ring-[#0F0F23] ${status === 'online' ? 'bg-emerald-400' : 'bg-gray-400'}`}
      />
    </div>
  );
}

export function AvatarGroup({ people = [], max = 5 }) {
  const visible = people.slice(0, max);
  const extra = people.length - visible.length;
  return (
    <div className="flex -space-x-2">
      {visible.map((p) => (
        <Avatar key={p.id} src={p.avatar} name={p.name} size={28} className="border-2 border-[#0F0F23]" />
      ))}
      {extra > 0 && (
        <div className="inline-flex items-center justify-center h-7 w-7 rounded-full bg-white/10 text-white text-xs border-2 border-[#0F0F23]">
          +{extra}
        </div>
      )}
    </div>
  );
}


