"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardContent } from "@/src/components/ui/Card";
import Button from "@/src/components/ui/Button";
import Avatar from "@/src/components/ui/Avatar";
import Badge from "@/src/components/ui/Badge";
import Progress from "@/src/components/ui/Progress";
import Skeleton from "@/src/components/ui/Skeleton";
import { users, skillsCatalog } from "@/src/lib/mock-data";
import toast from "react-hot-toast";

function CountUp({ to = 0, duration = 1000, className = "" }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    const start = performance.now();
    const step = (now) => {
      const p = Math.min(1, (now - start) / duration);
      setVal(Math.floor(p * to));
      if (p < 1) requestAnimationFrame(step);
    };
    const id = requestAnimationFrame(step);
    return () => cancelAnimationFrame(id);
  }, [to, duration]);
  return <span className={className}>{val}</span>;
}

const categoryColor = (cat) => {
  if (cat === "Frontend") return "from-[#8B5CF6] to-[#06B6D4]";
  if (cat === "Backend") return "from-[#06B6D4] to-[#3B82F6]";
  if (cat === "Design") return "from-[#EC4899] to-[#8B5CF6]";
  if (cat === "Data") return "from-[#22C55E] to-[#06B6D4]";
  return "from-[#8B5CF6] to-[#06B6D4]";
};

export default function ProfilePage() {
  const me = users[0];
  const [loading, setLoading] = useState(false);
  const [edit, setEdit] = useState(false);
  const [bio, setBio] = useState("Passionate builder who loves shipping delightful products.");
  const [skills, setSkills] = useState(me.skills.slice(0, 8));
  const [availability, setAvailability] = useState(
    Array.from({ length: 7 }).map(() => Array.from({ length: 12 }).map(() => (Math.random() > 0.7 ? 1 : 0)))
  );

  // HERO SECTION
  return (
    <div className="space-y-6">
      {/* Hero */}
      <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="relative overflow-hidden rounded-2xl">
        <div className="h-40 sm:h-56 bg-gradient-to-r from-[#8B5CF6] via-[#3B82F6] to-[#06B6D4] opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-[#0F0F23]" />
        <div className="absolute inset-x-0 -bottom-10 sm:-bottom-12 grid place-items-center">
          <motion.div initial={{ y: 8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: .1 }} className="relative">
            <Avatar src={me.avatar} name={me.name} size={96} />
          </motion.div>
        </div>
      </motion.section>

      <div className="text-center mt-12">
        <h1 className="text-2xl font-semibold gradient-text">{me.name}</h1>
        <div className="text-white/70">{me.facultyName} • Year {me.year}</div>
        <div className="mt-3 flex items-center justify-center gap-2">
          <Button onClick={()=>setEdit((v)=>!v)}>{edit ? 'Done' : 'Edit Profile'}</Button>
          <Button variant="secondary">Share</Button>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-3 max-w-md mx-auto">
          {[{k:'Projects',v:12},{k:'Teams',v:3},{k:'Connections',v:42}].map((s)=> (
            <div key={s.k} className="rounded-lg bg-white/5 p-3">
              <div className="text-xs text-white/60">{s.k}</div>
              <div className="text-xl font-bold"><CountUp to={s.v} duration={800} /></div>
            </div>
          ))}
        </div>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN */}
        <div className="space-y-4 lg:col-span-2">
          {/* Bio */}
          <Card>
            <CardHeader className="font-medium">About</CardHeader>
            <CardContent>
              {!edit ? (
                <p className="text-sm text-white/80">{bio}</p>
              ) : (
                <textarea value={bio} onChange={(e)=>setBio(e.target.value)} className="w-full rounded-md bg-[#1A1A2E] border border-white/15 p-3 outline-none text-white" rows={3} />
              )}
            </CardContent>
          </Card>

          {/* Skills */}
          <Card>
            <CardHeader className="font-medium">Skills</CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {skills.map((s, idx) => {
                  const meta = skillsCatalog.find((x)=>x.id===s.id);
                  return (
                    <motion.div key={s.id+idx} whileHover={{ scale: 1.06 }} className={`rounded-full px-3 py-1 text-sm text-white bg-gradient-to-r ${categoryColor(meta?.category)} shadow`}> 
                      {meta?.icon || '•'} {s.name}
                      <span className="ml-2 text-xs bg-white/15 px-1.5 py-0.5 rounded">Lvl {s.level}</span>
                    </motion.div>
                  );
                })}
              </div>
              {edit && (
                <div className="mt-3 text-xs text-white/70">Drag-and-drop to reorder coming soon.</div>
              )}
            </CardContent>
          </Card>

          {/* Availability */}
          <Card>
            <CardHeader className="font-medium">Availability</CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-1">
                {availability.map((day, d) => (
                  <div key={d} className="space-y-1">
                    {day.map((cell, i) => (
                      <div
                        key={i}
                        onClick={()=> setAvailability((prev)=>{
                          const next = prev.map(r=>r.slice());
                          next[d][i] = next[d][i] ? 0 : 1;
                          return next;
                        })}
                        className={`h-5 w-10 rounded transition ${cell ? 'bg-gradient-to-r from-[#8B5CF6] to-[#06B6D4]' : 'bg-white/10 hover:bg-white/20'}`}
                        title={cell? 'Available' : 'Unavailable'}
                      />
                    ))}
                  </div>
                ))}
              </div>
              <div className="mt-2 text-xs text-white/70">{availability.flat().filter(Boolean).length} time blocks available</div>
              {edit && (
                <div className="mt-3 flex justify-end">
                  <Button loading={loading} onClick={async()=>{
                    try{
                      setLoading(true);
                      const body = { slots: [] };
                      availability.forEach((day, d)=>{
                        let start = null;
                        day.forEach((val, h)=>{
                          if (val && start===null) start = h;
                          if ((!val || h===23) && start!==null){
                            const endIndex = val ? h+1 : h;
                            const fmt = (x)=>`${String(x).padStart(2,'0')}:00:00`;
                            body.slots.push({ day_of_week:d, start_time: fmt(start), end_time: fmt(endIndex) });
                            start=null;
                          }
                        });
                      });
                      const res = await fetch('/api/availability', { method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body) });
                      const json = await res.json();
                      if (!res.ok) throw new Error(json?.error?.description || 'Failed to save');
                      toast.success('Availability updated');
                    }catch(e){ toast.error(e.message);} finally { setLoading(false);} 
                  }}>Save Availability</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-4">
          {/* Stats Overview */}
          <Card>
            <CardHeader className="font-medium">Stats</CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-2 text-center">
                {[{k:'Completed',v:7},{k:'Teams',v:3},{k:'Compat',v:86}].map((s)=> (
                  <div key={s.k} className="rounded-md bg-white/5 p-3">
                    <div className="text-xs text-white/60">{s.k}</div>
                    <div className="text-lg font-semibold"><CountUp to={s.v} duration={900} /></div>
                  </div>
                ))}
              </div>
              <div className="mt-3">
                <div className="flex justify-between text-xs mb-1"><span>Profile completeness</span><span>82%</span></div>
                <Progress value={82} />
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader className="font-medium">Recent Activity</CardHeader>
            <CardContent>
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-px bg-white/10" />
                <div className="space-y-4">
                  {["Joined team Innovators","Added skill Next.js","Updated availability","Commented on Health Tracker"].map((t,i)=>(
                    <motion.div key={i} initial={{ opacity: 0, y: 6 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="pl-10">
                      <div className="relative">
                        <span className="absolute -left-6 top-1.5 h-3 w-3 rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#06B6D4]" />
                        <div className="text-sm">{t}</div>
                        <div className="text-xs text-white/60">Today</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card>
            <CardHeader className="font-medium">Achievements</CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {['🚀','🏆','💎','🎯','⚡'].map((b,i)=>(
                  <motion.div key={i} initial={{ scale: .9, opacity: .8 }} whileHover={{ scale: 1.08 }} className="rounded-md bg-white/5 px-3 py-2">
                    <span className="text-lg">{b}</span>
                  </motion.div>
                ))}
              </div>
              <div className="mt-3">
                <div className="text-xs text-white/70 mb-1">Next badge progress</div>
                <Progress value={58} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}


