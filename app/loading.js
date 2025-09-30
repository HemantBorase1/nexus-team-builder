export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="space-y-4">
        <div className="h-8 w-64 rounded bg-white/10 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_,i)=> <div key={i} className="h-24 rounded bg-white/10 animate-pulse" />)}
        </div>
        <div className="h-64 rounded bg-white/10 animate-pulse" />
      </div>
    </div>
  );
}


