"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Card, CardHeader, CardContent } from "@/src/components/ui/Card";
import Button from "@/src/components/ui/Button";
import Avatar, { AvatarGroup } from "@/src/components/ui/Avatar";
import Badge from "@/src/components/ui/Badge";
import Progress from "@/src/components/ui/Progress";
import { users, sampleProjects } from "@/src/lib/mock-data";
import { motion } from "framer-motion";
import { ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, Tooltip, AreaChart, Area } from "recharts";

function CountUp({ to = 0, duration = 1000, className = "" }) {
  const [val, setVal] = useState(0);
  const startRef = useRef(null);
  useEffect(() => {
    const start = performance.now();
    startRef.current = start;
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

function Ring({ value = 75, size = 64 }) {
  const radius = (size - 12) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, value));
  const offset = circumference - (clamped / 100) * circumference;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size/2} cy={size/2} r={radius} stroke="rgba(255,255,255,.15)" strokeWidth="8" fill="none" />
      <circle
        cx={size/2}
        cy={size/2}
        r={radius}
        stroke="url(#ringGrad)"
        strokeWidth="8"
        fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
      />
      <defs>
        <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#06B6D4" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function DashboardPage() {
  const me = useMemo(() => users[0], []);
  const activeProjects = sampleProjects.slice(0, 3);
  const recommended = users.slice(1, 9);
  const skillCounts = useMemo(() => {
    const counts = {};
    users.slice(0, 20).forEach((u) => {
      u.skills.forEach((s) => {
        counts[s.name] = (counts[s.name] || 0) + 1;
      });
    });
    return Object.entries(counts)
      .slice(0, 6)
      .map(([name, value]) => ({ name, value }));
  }, []);

  const trendData = useMemo(() => Array.from({length: 8}).map((_,i)=>({x:`W${i+1}`, y: 60 + Math.round(Math.sin(i/2)*10) + i*2})), []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl sm:text-4xl font-semibold gradient-text">Welcome back, {me.name.split(" ")[0]}!</h1>
          <p className="text-white/70">Build your perfect hackathon team.</p>
        </div>
        <div className="flex gap-2">
          <Button leftIcon={<span>＋</span>}>New Project</Button>
          <Button variant="secondary">Invite</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[{k:'Projects',v:12},{k:'Teams',v:3},{k:'Connections',v:42},{k:'Invites',v:5}].map((s,i)=> (
          <motion.div key={s.k} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i*.05 }} className="glass-card">
            <div className="inner p-4">
              <div className="text-xs text-white/60">{s.k}</div>
              <div className="text-2xl font-bold"><CountUp to={s.v} duration={900} /></div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader className="font-medium">Active Projects</CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {activeProjects.map((p) => (
                <motion.div key={p.id} whileHover={{ y: -3, scale: 1.01 }} className="glass-card hover-glow">
                  <div className="inner p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold">{p.name}</h3>
                        <p className="text-xs text-white/60">{p.type} • {p.status}</p>
                      </div>
                      <Ring value={p.progress} />
                    </div>
                    <p className="text-sm text-white/80 mt-2 line-clamp-2">{p.description}</p>
                    <div className="mt-3 flex items-center justify-between">
                      <AvatarGroup people={users.slice(0,5)} />
                      <Badge variant="success" pulse className="ml-2">Active</Badge>
                    </div>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </div>
        <div>
          <Card>
            <CardHeader className="font-medium">Team Recommendations</CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-3">
                {recommended.map((u) => (
                  <motion.div key={u.id} whileHover={{ y: -2 }} className="glass-card">
                    <div className="inner p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar src={u.avatar} name={u.name} />
                          <div>
                            <div className="text-sm font-medium">{u.name}</div>
                            <div className="text-xs text-white/60">{u.facultyName}</div>
                          </div>
                        </div>
                        <Badge variant="secondary">{u.compatibility}%</Badge>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {u.skills.slice(0,3).map(s=> <Badge key={s.id} variant="secondary">{s.name}</Badge>)}
                      </div>
                      <div className="mt-2">
                        <Button size="sm" variant="secondary" className="w-full">Add to Team</Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="font-medium">Skills Distribution</CardHeader>
          <CardContent style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={skillCounts} dataKey="value" nameKey="name" outerRadius={90} innerRadius={40}>
                  {skillCounts.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={["#8B5CF6","#06B6D4","#22c55e","#f59e0b","#ef4444","#3B82F6"][index % 6]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="font-medium">Compatibility Trends</CardHeader>
          <CardContent style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorComp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.6}/>
                    <stop offset="95%" stopColor="#06B6D4" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="x" stroke="#80809A" tickLine={false} axisLine={false} />
                <YAxis hide />
                <Tooltip contentStyle={{ background: "rgba(15,15,35,0.9)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8 }} />
                <Area type="monotone" dataKey="y" stroke="#8B5CF6" fill="url(#colorComp)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="font-medium">Availability Heatmap</CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: 7 * 10 }).map((_, i) => (
                <div key={i} className="h-5 rounded" style={{ background: `linear-gradient(90deg, rgba(139,92,246,${(i%5)/8}), rgba(6,182,212,${(i%5)/8}))` }} />
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="font-medium">Faculty Diversity</CardHeader>
          <CardContent style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={skillCounts} dataKey="value" nameKey="name" outerRadius={90} innerRadius={60}>
                  {skillCounts.map((entry, index) => (
                    <Cell key={`cell-div-${index}`} fill={["#06B6D4","#8B5CF6","#22c55e","#f59e0b","#ef4444","#3B82F6"][index % 6]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="font-medium">Recent Activity</CardHeader>
        <CardContent>
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-px bg-white/10" />
            <div className="space-y-4">
              {["Invited Alex to Smart Campus","Matched with Jamie (86%)","Project 'Health Tracker' created","New comment on Team thread"].map((t,i)=>(
                <motion.div key={i} initial={{ opacity: 0, y: 6 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="pl-10">
                  <div className="relative">
                    <span className="absolute -left-6 top-1.5 h-3 w-3 rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#06B6D4]" />
                    <div className="text-sm">{t}</div>
                    <div className="text-xs text-white/60">Just now</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


