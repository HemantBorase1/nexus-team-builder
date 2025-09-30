"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import Button from "@/src/components/ui/Button";
import Avatar from "@/src/components/ui/Avatar";
import Badge from "@/src/components/ui/Badge";
import Progress from "@/src/components/ui/Progress";
import TeamCircle from "@/src/components/team/TeamCircle";
import { users, sampleProjects, skillsCatalog, getFacultyMeta } from "@/src/lib/mock-data";

function CompatibilityRing({ value = 72 }) {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, value));
  const offset = circumference - (clamped / 100) * circumference;
  return (
    <svg width="96" height="96" viewBox="0 0 96 96">
      <circle cx="48" cy="48" r={radius} stroke="rgba(255,255,255,.15)" strokeWidth="8" fill="none" />
      <motion.circle
        cx="48"
        cy="48"
        r={radius}
        stroke="url(#grad)"
        strokeWidth="8"
        fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={circumference}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: .6 }}
        strokeLinecap="round"
      />
      <defs>
        <linearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#06B6D4" />
        </linearGradient>
      </defs>
      <text x="50%" y="52%" dominantBaseline="middle" textAnchor="middle" className="fill-white text-sm font-semibold">{clamped}%</text>
    </svg>
  );
}

export default function MatchingPage() {
  const candidates = users.slice(0, 20);
  const [index, setIndex] = useState(0);
  const [team, setTeam] = useState([]);
  const [projectOpen, setProjectOpen] = useState(false);
  const [project, setProject] = useState(sampleProjects[0]);
  const current = candidates[index];

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-10, 10]);
  const likeOpacity = useTransform(x, [40, 120], [0, 1]);
  const nopeOpacity = useTransform(x, [-40, -120], [0, 1]);

  const requirementLevels = useMemo(() => {
    const map = (project?.requiredSkills || []).map((name) => ({
      name,
      level: Math.floor(Math.random() * 40) + 60,
    }));
    return map;
  }, [project]);

  const facultyBreakdown = useMemo(() => {
    const counts = {};
    team.forEach((m) => {
      counts[m.faculty] = (counts[m.faculty] || 0) + 1;
    });
    return Object.entries(counts);
  }, [team]);

  const swipe = (liked) => {
    if (!current) return;
    if (liked) setTeam((t) => [...t, current]);
    setIndex((i) => (i + 1) % candidates.length);
  };

  const teamCompatibility = useMemo(() => {
    if (team.length === 0) return 0;
    const avg = Math.min(98, 60 + team.length * 7);
    return avg;
  }, [team]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* LEFT SIDEBAR */}
      <div className="order-2 lg:order-1 space-y-3">
        <div className="glass-card">
          <div className="inner p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium">Project</div>
              <button className="text-xs text-white/70 hover:text-white" onClick={()=>setProjectOpen((v)=>!v)}>{projectOpen ? 'Close' : 'Change'}</button>
            </div>
            <div className="mt-2">
              <button onClick={()=>setProjectOpen((v)=>!v)} className="w-full text-left rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/10 transition">
                {project.name} <span className="text-white/60">• {project.type}</span>
              </button>
              <AnimatePresence>
                {projectOpen && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="mt-2 overflow-hidden rounded-md border border-white/10">
                    {sampleProjects.map((p)=> (
                      <button key={p.id} onClick={()=>{setProject(p); setProjectOpen(false);}} className={`block w-full text-left px-3 py-2 text-sm hover:bg-white/5 ${p.id===project.id?'bg-white/5':''}`}>{p.name}</button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="mt-4">
              <div className="text-sm font-medium mb-2">Requirements</div>
              <div className="space-y-2">
                {requirementLevels.map((r)=> (
                  <div key={r.name}>
                    <div className="flex justify-between text-xs mb-1"><span>{r.name}</span><span>{r.level}%</span></div>
                    <Progress value={r.level} />
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4">
              <div className="text-sm font-medium mb-2">Diversity</div>
              <div className="flex flex-wrap gap-2">
                {facultyBreakdown.length === 0 && <span className="text-xs text-white/60">No members yet</span>}
                {facultyBreakdown.map(([fid, count]) => {
                  const meta = getFacultyMeta(fid);
                  return (
                    <span key={fid} className="inline-flex items-center gap-1 rounded-full bg-white/5 px-2 py-1 text-xs">
                      <span className={`h-2.5 w-2.5 rounded-full`} style={{ backgroundColor: meta.color?.replace('bg-','').includes('#')? meta.color : undefined }} />
                      {meta.name}
                      <span className="text-white/60">×{count}</span>
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CENTER - SWIPE */}
      <div className="order-1 lg:order-2">
        <div className="relative h-[520px] flex items-center justify-center">
          <AnimatePresence initial={false}>
            {current ? (
              <motion.div
                key={current.id}
                className="w-full max-w-md"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <motion.div
                  drag="x"
                  style={{ x, rotate }}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.2}
                  onDragEnd={(_, info) => {
                    if (info.offset.x > 140) swipe(true);
                    else if (info.offset.x < -140) swipe(false);
                  }}
                  className="glass-card"
                >
                  <div className="inner p-5">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Avatar src={current.avatar} name={current.name} size={56} />
                        <div>
                          <div className="font-semibold">{current.name}</div>
                          <div className="text-sm text-white/60">{current.facultyName} • Year {current.year}</div>
                        </div>
                      </div>
                      <CompatibilityRing value={current.compatibility} />
                    </div>

                    <div className="mb-4">
                      <div className="text-xs text-white/60 mb-1">Skills</div>
                      <div className="flex flex-wrap gap-1">
                        {current.skills.map((s) => (
                          <Badge key={s.id} variant="secondary">{s.name}</Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="text-xs text-white/60 mb-1">Availability</div>
                      <div className="grid grid-cols-7 gap-1">
                        {Array.from({ length: 7 * 7 }).map((_, i) => (
                          <div key={i} className="h-4 rounded bg-white/10" />
                        ))}
                      </div>
                    </div>

                    {/* Like/Nope overlays */}
                    <motion.div style={{ opacity: likeOpacity }} className="pointer-events-none absolute left-4 top-4 rounded-md border border-emerald-400 text-emerald-300 px-3 py-1 text-sm rotate-[-12deg]">LIKE</motion.div>
                    <motion.div style={{ opacity: nopeOpacity }} className="pointer-events-none absolute right-4 top-4 rounded-md border border-red-400 text-red-300 px-3 py-1 text-sm rotate-[12deg]">NOPE</motion.div>
                  </div>
                </motion.div>

                <div className="mt-4 flex gap-3">
                  <Button variant="ghost" className="w-full" onClick={() => swipe(false)}>✖ Dislike</Button>
                  <Button className="w-full" onClick={() => swipe(true)}>❤ Like</Button>
                </div>
              </motion.div>
            ) : (
              <div className="w-full max-w-md">
                <div className="glass-card">
                  <div className="inner p-5">
                    <div className="animate-pulse space-y-3">
                      <div className="h-6 bg-white/10 rounded" />
                      <div className="h-4 bg-white/10 rounded" />
                      <div className="h-48 bg-white/10 rounded" />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* RIGHT SIDEBAR */}
      <div className="order-3 space-y-3">
        <div className="glass-card">
          <div className="inner p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="font-medium">Team ({team.length})</div>
              <div className="text-xs text-white/60">Compatibility</div>
            </div>
            <div className="flex items-center gap-3">
              <TeamCircle members={team} />
              <div className="flex-1">
                <Progress value={teamCompatibility} />
                <div className="text-xs text-white/60 mt-1">{teamCompatibility}%</div>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-card">
          <div className="inner p-4">
            <div className="font-medium mb-2">Stats</div>
            <div className="grid grid-cols-3 gap-2 text-center">
              {[{k:'Members',v:team.length},{k:'Avg Score',v:teamCompatibility},{k:'Skills',v:team.reduce((a,b)=>a+b.skills.length,0)}].map((s)=> (
                <motion.div key={s.k} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="rounded-md bg-white/5 p-2">
                  <div className="text-xs text-white/60">{s.k}</div>
                  <div className="text-sm font-semibold">{s.v}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <AnimatePresence>
          {team.length >= 5 && (
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }} className="glass-card">
              <div className="inner p-4 text-center">
                <div className="text-lg font-semibold">Team Complete 🎉</div>
                <div className="text-sm text-white/70">You have enough members to start!</div>
                <ConfettiBlast />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function ConfettiBlast() {
  const pieces = Array.from({ length: 30 });
  return (
    <div className="relative h-0">
      {pieces.map((_, i) => (
        <span
          key={i}
          className="pointer-events-none absolute top-0 left-1/2 h-2 w-2 rounded-sm"
          style={{
            background: ["#8B5CF6","#06B6D4","#22c55e","#f59e0b","#ef4444"][i%5],
            transform: `translateX(${(i-15)*4}px)`,
            animation: `fall ${0.8 + (i%5)*0.1}s ease-out forwards`,
          }}
        />
      ))}
      <style jsx>{`
        @keyframes fall {
          from { opacity: 1; transform: translateY(0) rotate(0deg); }
          to { opacity: 0; transform: translateY(60px) rotate(180deg); }
        }
      `}</style>
    </div>
  );
}


