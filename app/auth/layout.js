import "../globals.css";

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-[calc(100vh-56px)] relative overflow-hidden">
      <div className="absolute inset-0 gradient-hero" />
      <div className="absolute inset-0">
        <div className="float-shape w-72 h-72 rounded-full" style={{ top: -40, left: -40, background: "radial-gradient(circle at 30% 30%, #8B5CF6, transparent)" }} />
        <div className="float-shape w-96 h-96 rounded-full" style={{ bottom: -60, right: -60, background: "radial-gradient(circle at 70% 70%, #06B6D4, transparent)" }} />
      </div>
      <div className="relative z-10 py-10">
        <div className="mx-auto max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          {children}
        </div>
      </div>
    </div>
  );
}


