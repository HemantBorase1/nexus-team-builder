"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardHeader, CardContent } from "@/src/components/ui/Card";
import Input from "@/src/components/ui/Input";
import Select from "@/src/components/ui/Select";
import Button from "@/src/components/ui/Button";
import Progress from "@/src/components/ui/Progress";
import Modal from "@/src/components/ui/Modal";
import Avatar, { AvatarGroup } from "@/src/components/ui/Avatar";
import Skeleton from "@/src/components/ui/Skeleton";
import { getAllProjects, getAllUsers } from "@/src/lib/mock-data";
import staticStorage from "@/src/lib/static-storage";

function Ring({ value = 75, size = 64 }) {
  const radius = (size - 12) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, value));
  const offset = circumference - (clamped / 100) * circumference;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size/2} cy={size/2} r={radius} stroke="rgba(255,255,255,.15)" strokeWidth="8" fill="none" />
      <circle cx={size/2} cy={size/2} r={radius} stroke="url(#g)" strokeWidth="8" fill="none" strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" />
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#06B6D4" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [type, setType] = useState("");
  const [status, setStatus] = useState("");
  const [view, setView] = useState("grid");
  const [open, setOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    description: '',
    team_size: 5,
    timeline: '',
    required_skills: ''
  });

  useEffect(() => {
    let mounted = true;
    const seed = getAllProjects();
    (async () => {
      const resp = await staticStorage.listProjectsAsync();
      const user = resp?.data || [];
      if (mounted) {
        setProjects([...seed, ...user]);
        setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const filtered = useMemo(() => projects.filter(
    (p) => (p.title || p.name || '').toLowerCase().includes(query.toLowerCase()) && (!type || p.type === type) && (!status || p.status === status)
  ), [projects, query, type, status]);

  const stats = useMemo(() => ({
    active: projects.filter(p=> (p.status||'').toLowerCase()==='active').length,
    planning: projects.filter(p=> (p.status||'').toLowerCase()==='planning').length,
    completed: projects.filter(p=> (p.status||'').toLowerCase()==='completed').length,
  }), [projects]);

  const handleCreateProject = async () => {
    if (!formData.name.trim() || !formData.type) return;
    setCreating(true);
    const base = {
      title: formData.name.trim(),
      description: formData.description.trim(),
      category: formData.type,
      type: formData.type,
      status: 'recruiting',
      progress: 0,
      compatibility: 80 + Math.floor(Math.random()*15),
      owner: 'user-1',
      deadline: formData.timeline
    };
    const optimistic = { id: `temp-${Date.now()}`, ...base };
    setProjects(prev => [...prev, optimistic]);
    try {
      const resp = await staticStorage.createProjectAsync(base);
      const created = resp.data;
      setProjects(prev => prev.map(p => p.id===optimistic.id ? created : p));
      setOpen(false);
      setFormData({ name: '', type: '', description: '', team_size: 5, timeline: '', required_skills: '' });
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold gradient-text">Your Projects</h1>
            <div className="mt-2 grid grid-cols-3 gap-2 max-w-md">
              {[{k:'Active',v:stats.active},{k:'Planning',v:stats.planning},{k:'Completed',v:stats.completed}].map((s)=> (
                <div key={s.k} className="rounded-md bg-white/5 p-2 text-center">
                  <div className="text-xs text-white/70">{s.k}</div>
                  <div className="text-lg font-semibold">{s.v}</div>
                </div>
              ))}
            </div>
          </div>
          <Button className="btn-gradient btn-glow" onClick={()=>{
            setFormData({ name: '', type: '', description: '', team_size: 5, timeline: '', required_skills: '' });
            setOpen(true);
          }}>Create New Project</Button>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-2">
          <Input className="bg-[#0F0F23] border-white/15 text-white placeholder:text-white/50" placeholder="Search projects" value={query} onChange={(e) => setQuery(e.target.value)} />
          <Select className="bg-[#0F0F23] border-white/15 text-white" value={type} onChange={(e) => setType(e.target.value)} options={[{label:'All types', value:''}, 'Mobile App', 'Web App', 'Platform', 'Assistant'].map((v) => (typeof v === 'string' ? {label:v,value:v} : v))} />
          <Select className="bg-[#0F0F23] border-white/15 text-white" value={status} onChange={(e) => setStatus(e.target.value)} options={[{label:'All status', value:''}, {label:'Active', value:'Active'}, {label:'Planning', value:'Planning'}, {label:'Completed', value:'Completed'}]} />
          <div className="flex items-center gap-2">
            <Button variant={view==='grid'? 'primary':'secondary'} className="w-full" onClick={()=>setView('grid')}>Grid</Button>
            <Button variant={view==='list'? 'primary':'secondary'} className="w-full" onClick={()=>setView('list')}>List</Button>
          </div>
        </div>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({length:6}).map((_,i)=>(
            <div key={i} className="glass-card">
              <div className="inner p-4 animate-pulse space-y-3">
                <div className="h-5 bg-white/10 rounded" />
                <div className="h-4 bg-white/10 rounded" />
                <div className="h-24 bg-white/10 rounded" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* GRID VIEW */}
      {view === 'grid' && (
        <motion.div layout className="columns-1 md:columns-2 lg:columns-3 gap-4 [column-fill:_balance]">{/* Masonry using CSS columns */}
          {filtered.map((p, idx) => (
            <motion.div key={p.id} layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx*.03 }} className="mb-4 break-inside-avoid">
              <div className="glass-card hover-glow hover:-translate-y-1 transition-transform">
                <div className="inner p-0">
                  <div className="h-28 bg-gradient-to-r from-[#8B5CF6] via-[#3B82F6] to-[#06B6D4] relative">
                    <div className="absolute right-3 top-3">
                      <BadgePulse status={p.status} />
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-semibold">{p.title}</div>
                        <div className="text-xs text-white/60">{p.type}</div>
                      </div>
                      <Ring value={p.progress} size={56} />
                    </div>
                    <p className="text-sm text-white/80 mt-2">{p.description}</p>
                    <div className="mt-3 flex items-center justify-between">
                      <AvatarGroup people={getAllUsers().slice(0,5)} />
                      <div className="flex gap-1">
                        <QuickAction>View</QuickAction>
                        <QuickAction>Edit</QuickAction>
                        <QuickAction onClick={()=>{ setProjects(prev=>prev.filter(x=>x.id!==p.id)); staticStorage.deleteProjectAsync(p.id); }}>Delete</QuickAction>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* LIST VIEW */}
      {view === 'list' && (
        <div className="glass-card">
          <div className="inner p-3">
            <div className="grid grid-cols-12 text-xs text-white/60 px-2 py-2">
              <div className="col-span-4">Project</div>
              <div className="col-span-2">Type</div>
              <div className="col-span-2">Progress</div>
              <div className="col-span-2">Team</div>
              <div className="col-span-2 text-right">Actions</div>
            </div>
            <div className="divide-y divide-white/10">
              {filtered.map((p, idx) => (
                <motion.div key={p.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx*.03 }} className="grid grid-cols-12 items-center px-2 py-3">
                  <div className="col-span-4 flex items-center gap-2">
                    <span className="h-6 w-6 rounded bg-gradient-to-r from-[#8B5CF6] to-[#06B6D4]" />
                    <div>
                      <div className="text-sm font-medium">{p.title}</div>
                      <div className="text-xs text-white/60">Updated recently</div>
                    </div>
                  </div>
                  <div className="col-span-2 text-sm">{p.type}</div>
                  <div className="col-span-2">
                    <Progress value={p.progress} />
                  </div>
                  <div className="col-span-2">
                    <AvatarGroup people={getAllUsers().slice(0,4)} />
                  </div>
                  <div className="col-span-2 flex justify-end gap-1">
                    <QuickAction>View</QuickAction>
                    <QuickAction>Edit</QuickAction>
                    <QuickAction onClick={()=>{ setProjects(prev=>prev.filter(x=>x.id!==p.id)); staticStorage.deleteProjectAsync(p.id); }}>Delete</QuickAction>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* EMPTY STATE */}
      {!loading && filtered.length === 0 && (
        <div className="text-center text-white/70 py-10">No results. Try adjusting filters.</div>
      )}

      {/* CREATE PROJECT MODAL */}
      <Modal
        open={open}
        onClose={()=>setOpen(false)}
        title="Create Project"
        size="md"
        footer={[
          <Button key="cancel" variant="secondary" onClick={()=>setOpen(false)}>Cancel</Button>,
          <Button key="create" className="btn-gradient" loading={creating} onClick={handleCreateProject}>Create</Button>,
        ]}
      >
        <div className="space-y-5 text-white">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <Input 
              className="bg-[#0F0F23] border-white/15 text-white placeholder:text-white/50" 
              label="Project Name" 
              placeholder="e.g., Campus Events Hub" 
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            />
            <Select 
              className="bg-[#0F0F23] border-white/15 text-white" 
              label="Type" 
              options={["Web App","Mobile App","Platform","Assistant"].map(v=>({label:v,value:v}))}
              value={formData.type}
              onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <Input 
              className="bg-[#0F0F23] border-white/15 text-white" 
              label="Team Size" 
              type="number" 
              min={2} 
              max={10} 
              value={formData.team_size}
              onChange={(e) => setFormData(prev => ({ ...prev, team_size: parseInt(e.target.value) }))}
            />
            <Input 
              className="bg-[#0F0F23] border-white/15 text-white placeholder:text-white/50" 
              label="Timeline" 
              placeholder="MM/DD/YYYY - MM/DD/YYYY" 
              value={formData.timeline}
              onChange={(e) => setFormData(prev => ({ ...prev, timeline: e.target.value }))}
            />
            <Input 
              className="bg-[#0F0F23] border-white/15 text-white placeholder:text-white/50" 
              label="Required Skills (comma separated)" 
              placeholder="React, Node.js" 
              value={formData.required_skills}
              onChange={(e) => setFormData(prev => ({ ...prev, required_skills: e.target.value }))}
            />
          </div>
          <div>
            <Input 
              className="bg-[#0F0F23] border-white/15 text-white placeholder:text-white/50" 
              label="Description" 
              placeholder="Describe the scope and goals" 
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}

function QuickAction({ children, ...props }) {
  return (
    <button className="text-xs rounded-md px-2 py-1 bg-white/5 hover:bg-white/10 transition" {...props}>{children}</button>
  );
}

function BadgePulse({ status }) {
  const map = { Active: "text-emerald-300", Planning: "text-blue-300", Completed: "text-white/70" };
  return (
    <span className={`inline-flex items-center gap-1 rounded-full bg-white/10 px-2 py-1 text-xs ${map[status] || ''}`}>
      <span className="relative h-2 w-2">
        <span className="absolute inset-0 rounded-full bg-current opacity-70 animate-ping" />
        <span className="absolute inset-0 rounded-full bg-current" />
      </span>
      {status}
    </span>
  );
}


