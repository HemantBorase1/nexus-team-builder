"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Avatar from "@/src/components/ui/Avatar";
import Badge from "@/src/components/ui/Badge";
import Progress from "@/src/components/ui/Progress";

const users = [
  { name: "Alex", faculty: "Engineering", skills: ["React","Node","UI/UX"] },
  { name: "Sarah", faculty: "Business", skills: ["PM","Marketing","Research"] },
  { name: "Emma", faculty: "Design", skills: ["Figma","Prototyping","Branding"] },
  { name: "James", faculty: "Engineering", skills: ["React Native","Swift","Firebase"] },
];

function BrowserChrome() {
  return (
    <div className="flex items-center justify-between px-3 py-2 border-b border-white/10 bg-white/5 rounded-t-lg">
      <div className="flex items-center gap-2">
        <span className="h-3 w-3 rounded-full bg-red-400/80" />
        <span className="h-3 w-3 rounded-full bg-yellow-400/80" />
        <span className="h-3 w-3 rounded-full bg-emerald-400/80" />
      </div>
      <div className="flex-1 mx-3">
        <div className="rounded-md bg-white/10 text-xs px-3 py-1 text-white/80 text-center">app.nexus.teams/match</div>
      </div>
      <div className="text-sm font-semibold bg-gradient-to-r from-[#8B5CF6] to-[#06B6D4] bg-clip-text text-transparent">Nexus</div>
    </div>
  );
}

function Compatibility({ value }) {
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <div className="text-center">
      <div className="text-xs text-white/60">Compatibility</div>
      <div className="text-3xl font-semibold">{clamped}%</div>
      <div className="mt-1"><Progress value={clamped} /></div>
    </div>
  );
}

function TeamCircle({ members }) {
  return (
    <div className="relative h-36 w-36 grid place-items-center">
      {members.map((m, i) => (
        <div key={m.name} className="absolute" style={{ transform: `rotate(${(i/members.length)*360}deg) translate(52px) rotate(-${(i/members.length)*360}deg)` }}>
          <Avatar name={m.name} size={36} />
        </div>
      ))}
      <div className="h-12 w-12 rounded-full bg-white/10 grid place-items-center text-xs">Team</div>
    </div>
  );
}

export default function AppPreviewMockup() {
  const [idx, setIdx] = useState(0);
  const [compat, setCompat] = useState(65);
  const [team, setTeam] = useState([users[0]]);

  useEffect(() => {
    let mounted = true;
    let t1, t2;
    t1 = setTimeout(() => {
      if (!mounted) return;
      setCompat(78);
      setTeam([users[0], users[1]]);
    }, 1200);
    t2 = setTimeout(() => {
      if (!mounted) return;
      setCompat(92);
      setTeam([users[0], users[1], users[2]]);
      setTimeout(() => {
        // loop scenario
        if (!mounted) return;
        setCompat(65);
        setTeam([users[(idx+1)%users.length]]);
        setIdx((v)=> (v+1)%users.length);
      }, 1600);
    }, 2600);
    return () => { mounted = false; clearTimeout(t1); clearTimeout(t2); };
  }, [idx]);

  const current = team[team.length-1];

  return (
    <div className="glass-card hover-glow">
      <div className="inner p-0">
        <BrowserChrome />
        <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Left: User card */}
          <div className="rounded-lg border border-white/10 bg-white/5 p-3">
            <div className="flex items-center gap-3">
              <Avatar name={current.name} size={48} />
              <div>
                <div className="font-semibold">{current.name}</div>
                <div className="text-xs text-white/60">{current.faculty}</div>
              </div>
            </div>
            <div className="mt-2 flex flex-wrap gap-1">
              {current.skills.map((s)=>(<Badge key={s} variant="secondary">{s}</Badge>))}
            </div>
          </div>

          {/* Center: Compatibility */}
          <div className="rounded-lg border border-white/10 bg-white/5 p-3 grid place-items-center">
            <Compatibility value={compat} />
            <AnimatePresence>
              {compat >= 90 && (
                <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }} className="text-emerald-300 text-sm mt-2">Team Ready 🎉</motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right: Team formation */}
          <div className="rounded-lg border border-white/10 bg-white/5 p-3 grid place-items-center">
            <TeamCircle members={team} />
            <div className="mt-2 flex gap-2 text-xs">
              {["Engineering","Business","Design"].map((f,i)=>(
                <span key={f} className={`rounded-full px-2 py-1 ${i<team.length? 'bg-white/20':'bg-white/10'} `}>{f}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


