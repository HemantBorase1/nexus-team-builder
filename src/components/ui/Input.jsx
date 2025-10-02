"use client";

import { useId, useState } from "react";

function cx(...c){return c.filter(Boolean).join(" ");}

export default function Input({
  label,
  error,
  success,
  helperText,
  className,
  leftIcon,
  rightIcon,
  type = "text",
  ...props
}) {
  const id = useId();
  const [focused, setFocused] = useState(false);
  const hasValue = props.value != null && String(props.value).length > 0;

  const baseBorder = error
    ? "border-red-400 focus:border-red-400"
    : success
    ? "border-emerald-500/60 focus:border-emerald-500"
    : "border-white/15 focus:border-transparent";

  const focusRing = error
    ? "focus:ring-2 focus:ring-red-400"
    : success
    ? "focus:ring-2 focus:ring-emerald-500"
    : "focus:ring-2 focus:ring-transparent";

  return (
    <div className={cx("w-full", className)}>
      <div className={cx("relative rounded-lg border bg-[#1A1A2E] text-white transition-all duration-300", baseBorder, focusRing)}>
        {leftIcon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70 text-sm">{leftIcon}</span>
        )}
        <input
          id={id}
          type={type}
          className={cx(
            "peer w-full bg-transparent outline-none placeholder:text-[#A0A0B0]",
            "px-3 py-3",
            leftIcon && "pl-9",
            rightIcon && "pr-9"
          )}
          onFocus={()=>setFocused(true)}
          onBlur={()=>setFocused(false)}
          {...props}
        />
        {rightIcon && (
          <button type="button" tabIndex={-1} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition">
            {rightIcon}
          </button>
        )}
        {label && (
          <label
            htmlFor={id}
            className={cx(
              "pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-white/60 transition-all",
              (focused || hasValue) && "top-2 -translate-y-0 text-xs bg-[#1A1A2E] px-1 text-white/70"
            )}
          >
            <span className="bg-gradient-to-r from-[#8B5CF6] to-[#06B6D4] bg-clip-text text-transparent">
              {label}
            </span>
          </label>
        )}
        <span
          aria-hidden
          className={cx(
            "pointer-events-none absolute inset-0 rounded-lg",
            focused && !error && !success && "ring-1 ring-inset ring-[#8B5CF6]"
          )}
        />
      </div>
      {(helperText || error) && (
        <p className={cx("mt-1 text-xs", error ? "text-red-400" : "text-white/60")}>{error || helperText}</p>
      )}
    </div>
  );
}


