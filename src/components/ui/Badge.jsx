export default function Badge({ children, variant = "default", pulse = false, className = "" }) {
  const variants = {
    default: "bg-gradient-to-r from-[#8B5CF6] to-[#06B6D4] text-white",
    secondary: "bg-white/10 text-white",
    success: "bg-emerald-500/20 text-emerald-300",
    warning: "bg-amber-500/20 text-amber-300",
    error: "bg-red-500/20 text-red-300",
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium transition-colors duration-200 ${variants[variant] || variants.default} ${pulse ? 'animate-[pulseGlow_1.6s_ease-in-out_infinite]' : ''} ${className}`}>
      {children}
      <style jsx>{`
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(139,92,246,.4); }
          50% { box-shadow: 0 0 0 6px rgba(6,182,212,.12); }
        }
      `}</style>
    </span>
  );
}


