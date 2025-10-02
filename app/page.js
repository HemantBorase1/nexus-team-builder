"use client";

import { motion } from "framer-motion";
import Button from "@/src/components/ui/Button";
import AppPreviewMockup from "@/src/components/home/AppPreviewMockup";

export default function Home() {
  return (
    <div className="min-h-[calc(100vh-56px)]">
      {/* Hero */}
      <section className="gradient-hero relative overflow-hidden rounded-2xl min-h-[70vh] grid place-items-center">
        {/* Floating shapes */}
        <div className="float-shape w-72 h-72 rounded-full" style={{ top: -40, left: -40, background: "radial-gradient(circle at 30% 30%, #8B5CF6, transparent)" }} />
        <div className="float-shape w-96 h-96 rounded-full" style={{ bottom: -60, right: -60, background: "radial-gradient(circle at 70% 70%, #06B6D4, transparent)" }} />

        <div className="relative px-6 py-24 sm:py-28 lg:py-32 text-center">
          <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .6 }} className="text-4xl sm:text-6xl font-bold tracking-tight gradient-text">
            Build Dream Teams. Automatically.
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .1, duration: .6 }} className="mt-3 text-base sm:text-lg text-[color:var(--muted-foreground)]">
            AI-powered team matching for university students
          </motion.p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Button className="btn-gradient btn-glow" onClick={()=>location.href='/auth/signup'}>
              Get Started
            </Button>
            <Button variant="secondary" className="hover-glow" onClick={()=>location.href='/dashboard'}>
              Live Demo
            </Button>
          </div>

          {/* Floating mockup */}
          <motion.div initial={{ opacity: 0, y: 20, scale: .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay: .2, duration: .6 }} className="mx-auto mt-10 max-w-4xl">
            <AppPreviewMockup />
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="mt-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[{t:'Intelligent Matching',d:'Compatibility across skills, time, and style.'},{t:'Visual Team Builder',d:'Drag-and-drop with real-time analytics.'},{t:'Project Insights',d:'Charts for coverage, diversity, and risk.'}].map((f,i)=>(
            <motion.div key={f.t} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i*.05 }} className="glass-card hover-glow hover:-translate-y-1 transition-transform">
              <div className="inner p-6">
              <div className="text-2xl mb-3">{['✨','🧩','📊'][i]}</div>
              <div className="font-semibold">{f.t}</div>
              <p className="text-sm text-[color:var(--muted-foreground)] mt-1">{f.d}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="mt-12">
        <h2 className="text-xl font-semibold mb-6">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            {t:'Create Profile', d:'Tell us your skills, schedule, and style.', icon:'🧑‍🎓'},
            {t:'Pick Project', d:'Choose what you want to build.', icon:'🛠️'},
            {t:'Smart Matching', d:'We recommend teammates and roles.', icon:'🤝'},
            {t:'Build & Win', d:'Collaborate with confidence and speed.', icon:'🏆'},
          ].map((s, i)=>(
            <motion.div
              key={s.t}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: .4 }}
              transition={{ delay: i*.05 }}
              className="relative"
            >
              <div className="glass-card hover-glow hover:-translate-y-1 transition-transform">
                <div className="inner p-5">
                  <div className="flex items-center justify-between">
                    <div className="h-8 w-8 grid place-items-center rounded-md bg-white/10 text-lg">{s.icon}</div>
                    <div className="text-xs rounded-full px-2 py-0.5 bg-white/10">Step {i+1}</div>
                  </div>
                  <div className="mt-3 font-semibold">{s.t}</div>
                  <p className="text-sm text-[color:var(--muted-foreground)]">{s.d}</p>
                  <div className="mt-4 h-1 rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#8B5CF6] to-[#06B6D4]" style={{ width: `${(i+1)/4*100}%` }} />
                  </div>
                </div>
              </div>
              {i < 3 && (
                <div className="hidden md:block absolute top-1/2 right-[-10px] w-5 h-px bg-white/10" />
              )}
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
