"use client";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-white/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* LEFT - Brand & Mission */}
          <div>
            <div className="text-2xl font-bold bg-gradient-to-r from-[#8B5CF6] via-[#3B82F6] to-[#06B6D4] bg-clip-text text-transparent">Nexus</div>
            <div className="text-white/80 mt-2">Building Better Teams at UNSW</div>
            <div className="text-sm text-white/60 mt-1">AI-powered team matching for students</div>
          </div>

          {/* MIDDLE - Platform Links */}
          <div className="grid grid-cols-3 gap-6 text-sm">
            <div>
              <div className="font-semibold mb-2">For Students</div>
              <ul className="space-y-1 text-white/70">
                <li><a href="#features" className="hover:text-white transition">Features</a></li>
                <li><a href="#how" className="hover:text-white transition">How It Works</a></li>
                <li><a href="#stories" className="hover:text-white transition">Success Stories</a></li>
              </ul>
            </div>
            <div>
              <div className="font-semibold mb-2">For Educators</div>
              <ul className="space-y-1 text-white/70">
                <li><a href="#classroom" className="hover:text-white transition">Classroom Integration</a></li>
                <li><a href="#projects" className="hover:text-white transition">Group Projects</a></li>
              </ul>
            </div>
            <div>
              <div className="font-semibold mb-2">Resources</div>
              <ul className="space-y-1 text-white/70">
                <li><a href="#help" className="hover:text-white transition">Help Center</a></li>
                <li><a href="#docs" className="hover:text-white transition">Documentation</a></li>
                <li><a href="#blog" className="hover:text-white transition">Blog</a></li>
              </ul>
            </div>
          </div>

          {/* RIGHT - University Focus */}
          <div>
            <div className="font-semibold">Made for UNSW Students</div>
            <div className="text-sm text-white/70 mt-2">Contact: <a href="mailto:team@nexusunsw.com" className="hover:text-white">team@nexusunsw.com</a></div>
            <div className="text-sm text-white/70 mt-1">University Partnerships</div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between text-xs text-white/60">
          <div>© 2025 Nexus - DevSoc Hackathon 2025</div>
          <div className="mt-2 sm:mt-0 flex items-center gap-3">
            <a href="#privacy" className="hover:text-white transition">Privacy Policy</a>
            <span>•</span>
            <a href="#terms" className="hover:text-white transition">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}


