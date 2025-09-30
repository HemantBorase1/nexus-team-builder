"use client";

export default function GlobalError({ error, reset }) {
  return (
    <html>
      <body>
        <div className="min-h-screen grid place-items-center">
          <div className="glass-card max-w-md w-full">
            <div className="inner p-6 text-center">
              <h2 className="text-xl font-semibold">Something went wrong</h2>
              <p className="text-sm text-white/70 mt-1">{error?.message || 'Unexpected error occurred.'}</p>
              <button onClick={() => reset()} className="mt-4 rounded-md px-4 py-2 bg-white/10 hover:bg-white/15">Try again</button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}


