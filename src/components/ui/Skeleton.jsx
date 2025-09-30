export default function Skeleton({ className = "", shimmer = true }) {
  return (
    <div className={`relative overflow-hidden rounded-md bg-white/10 ${className}`}>
      {shimmer && (
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      )}
      <style jsx>{`
        @keyframes shimmer { 100% { transform: translateX(100%); } }
      `}</style>
    </div>
  );
}


