"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardHeader, CardContent, CardFooter } from "@/src/components/ui/Card";
import Input from "@/src/components/ui/Input";
import Button from "@/src/components/ui/Button";
import Progress from "@/src/components/ui/Progress";
import Badge from "@/src/components/ui/Badge";
import Avatar from "@/src/components/ui/Avatar";
import { getAllFaculties, getAllSkills } from "@/src/lib/mock-data";
import staticStorage from "@/src/lib/static-storage";

const steps = ["Personal", "Skills", "Availability", "Preferences"];

export default function OnboardingPage() {
  const faculties = getAllFaculties();
  const [step, setStep] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [form, setForm] = useState({
    name: "",
    faculty: getAllFaculties()[0].id,
    avatar: "",
    skills: [],
    levels: {},
    availability: Array.from({ length: 7 }).map(() => Array.from({ length: 12 }).map(() => 0)),
    projectType: "Web App",
    teamSize: 5,
    commitment: "Balanced",
  });
  const progress = ((step + 1) / steps.length) * 100;

  const next = () => setStep((s) => Math.min(s + 1, steps.length - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));
  
  const finish = () => {
    // Save user profile to static storage
    const profile = {
      name: form.name,
      faculty: form.faculty,
      avatar: form.avatar,
      bio: "Passionate about building amazing projects!"
    };
    staticStorage.setUserProfile(profile);
    
    // Save skills
    const skills = form.skills.map(skillId => ({
      skill_id: skillId,
      level: form.levels[skillId] || 3
    }));
    staticStorage.setUserSkills(skills);
    
    // Save availability
    const availability = [];
    form.availability.forEach((day, dayIdx) => {
      day.forEach((slot, slotIdx) => {
        if (slot) {
          const startTime = slotIdx * 2;
          const endTime = startTime + 2;
          availability.push({
            day_of_week: dayIdx,
            start_time: `${startTime.toString().padStart(2, '0')}:00:00`,
            end_time: `${endTime.toString().padStart(2, '0')}:00:00`
          });
        }
      });
    });
    staticStorage.setUserAvailability(availability);
    
    // Redirect to dashboard
    window.location.href = '/dashboard';
  };

  const onDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setForm((f) => ({ ...f, avatar: reader.result }));
    reader.readAsDataURL(file);
  };

  const gridRef = useRef(null);
  const toggleCell = (dayIdx, slotIdx, value) => {
    setForm((f) => {
      const nextAvail = f.availability.map((row) => row.slice());
      nextAvail[dayIdx][slotIdx] = value ?? (nextAvail[dayIdx][slotIdx] ? 0 : 1);
      return { ...f, availability: nextAvail };
    });
  };

  const onMouseDownCell = (d, s) => {
    setDragging(true);
    toggleCell(d, s);
  };
  const onMouseEnterCell = (d, s) => {
    if (dragging) toggleCell(d, s, 1);
  };
  useEffect(() => {
    const up = () => setDragging(false);
    window.addEventListener("mouseup", up);
    window.addEventListener("touchend", up);
    return () => {
      window.removeEventListener("mouseup", up);
      window.removeEventListener("touchend", up);
    };
  }, []);

  const selectedSummary = useMemo(() => {
    const total = form.availability.flat().filter(Boolean).length;
    return `${total} blocks selected`;
  }, [form.availability]);

  const containerVariants = {
    initial: (dir) => ({ x: dir > 0 ? 24 : -24, opacity: 0 }),
    enter: { x: 0, opacity: 1, transition: { duration: 0.3 } },
    exit: (dir) => ({ x: dir > 0 ? -24 : 24, opacity: 0, transition: { duration: 0.25 } }),
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-4">
        <div className="flex items-center justify-between text-sm mb-1">
          <div className="flex items-center gap-3">
            {steps.map((s, i) => (
              <div key={s} className={`h-2 w-8 rounded-full ${i <= step ? 'bg-gradient-to-r from-[#8B5CF6] to-[#06B6D4]' : 'bg-white/10'}`} />
            ))}
          </div>
          <span className="text-white/70">Step {step + 1} • {steps[step]}</span>
        </div>
        <Progress value={progress} />
      </div>

      <Card>
        <CardHeader className="font-medium">Onboarding</CardHeader>
        <CardContent>
          <AnimatePresence mode="wait" custom={step}>
            {step === 0 && (
              <motion.div
                key="step1"
                custom={step}
                variants={containerVariants}
                initial="initial"
                animate="enter"
                exit="exit"
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                <div className="relative">
                  <Input
                    label="Full Name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <div className="text-sm text-white/70">Faculty</div>
                  <div className="grid grid-cols-2 gap-2">
                    {faculties.map((f) => {
                      const active = form.faculty === f.id;
                      return (
                        <button
                          key={f.id}
                          onClick={() => setForm({ ...form, faculty: f.id })}
                          className={`rounded-lg p-3 text-left transition transform hover:-translate-y-0.5 ${active ? 'bg-white/10 ring-1 ring-white/20' : 'bg-white/5 hover:bg-white/10'}`}
                        >
                          <div className="text-sm font-medium">{f.name}</div>
                          <div className="text-xs text-white/60">Select if you belong here</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="md:col-span-2">
                  <div
                    onDragOver={(e)=>e.preventDefault()}
                    onDrop={onDrop}
                    className="rounded-xl border border-dashed border-white/20 bg-white/5 p-4 text-center hover:bg-white/10 transition"
                  >
                    <div className="text-sm font-medium">Upload Avatar</div>
                    <div className="text-xs text-white/60">Drag & drop or click to select</div>
                    <div className="mt-3 flex items-center justify-center gap-3">
                      {form.avatar ? (
                        <img src={form.avatar} alt="avatar" className="h-16 w-16 rounded-full object-cover" />
                      ) : (
                        <div className="h-16 w-16 rounded-full bg-white/10" />
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div
                key="step2"
                custom={step}
                variants={containerVariants}
                initial="initial"
                animate="enter"
                exit="exit"
                className="space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="text-sm text-white/70">Select your skills</div>
                  <Badge variant="secondary">{form.skills.length} selected</Badge>
                </div>
                <div className="flex flex-wrap gap-2">
                  {getAllSkills().map((s) => {
                    const active = form.skills.includes(s.id);
                    return (
                      <motion.button
                        whileTap={{ scale: 0.96 }}
                        whileHover={{ scale: 1.04 }}
                        key={s.id}
                        onClick={() => setForm({
                          ...form,
                          skills: active ? form.skills.filter((id) => id !== s.id) : [...form.skills, s.id],
                          levels: { ...form.levels, [s.id]: form.levels[s.id] || 3 },
                        })}
                        className={`rounded-full px-3 py-1 text-sm border ${active ? 'bg-gradient-to-r from-[#8B5CF6] to-[#06B6D4] text-white border-transparent' : 'bg-white/5 text-white/90 border-white/10'}`}
                      >
                        {s.name}
                      </motion.button>
                    );
                  })}
                </div>
                {form.skills.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {form.skills.map((id) => (
                      <motion.div key={id} whileHover={{ rotateX: 6, rotateY: -6 }} className="rounded-lg bg-white/5 p-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-sm font-medium">{getAllSkills().find((s) => s.id === id)?.name}</div>
                          <span className="text-xs text-white/70">Lvl {form.levels[id] || 3}</span>
                        </div>
                        <input
                          type="range"
                          min={1}
                          max={5}
                          value={form.levels[id] || 3}
                          onChange={(e) => setForm({ ...form, levels: { ...form.levels, [id]: Number(e.target.value) } })}
                          className="w-full"
                        />
                      </motion.div>
                    ))}
                  </div>
                )}
                <div>
                  <div className="text-xs text-white/60 mb-1">Completion</div>
                  <Progress value={Math.min(100, form.skills.length * 12)} />
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step3"
                custom={step}
                variants={containerVariants}
                initial="initial"
                animate="enter"
                exit="exit"
              >
                <div className="text-sm text-white/70 mb-2">Select your weekly availability</div>
                <div ref={gridRef} className="grid grid-cols-7 gap-1 select-none">
                  {form.availability.map((day, dIdx) => (
                    <div key={dIdx} className="space-y-1">
                      {day.map((cell, sIdx) => (
                        <div
                          key={sIdx}
                          onMouseDown={() => onMouseDownCell(dIdx, sIdx)}
                          onMouseEnter={() => onMouseEnterCell(dIdx, sIdx)}
                          onTouchStart={() => onMouseDownCell(dIdx, sIdx)}
                          onTouchMove={() => onMouseEnterCell(dIdx, sIdx)}
                          className={`h-6 w-10 rounded ${cell ? 'bg-gradient-to-r from-[#8B5CF6] to-[#06B6D4]' : 'bg-white/10 hover:bg-white/20'} transition`}
                        />
                      ))}
                    </div>
                  ))}
                </div>
                <div className="mt-3 text-xs text-white/70">{selectedSummary}</div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step4"
                custom={step}
                variants={containerVariants}
                initial="initial"
                animate="enter"
                exit="exit"
                className="space-y-4"
              >
                <div>
                  <div className="text-sm text-white/70 mb-2">Project Type</div>
                  <div className="grid grid-cols-2 gap-2">
                    {["Web App","Mobile App","Platform","Tool"].map((p) => (
                      <button key={p} onClick={()=>setForm({ ...form, projectType: p })} className={`rounded-lg p-3 text-left ${form.projectType===p?'bg-white/10 ring-1 ring-white/20':'bg-white/5 hover:bg-white/10'} transition`}>
                        <div className="text-sm font-medium">{p}</div>
                        <div className="text-xs text-white/60">Great for hackathons</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-white/70">Team size</div>
                    <span className="text-xs">{form.teamSize} people</span>
                  </div>
                  <input type="range" min={2} max={8} value={form.teamSize} onChange={(e)=>setForm({ ...form, teamSize: Number(e.target.value) })} className="w-full" />
                </div>

                <div>
                  <div className="text-sm text-white/70 mb-1">Commitment</div>
                  <div className="flex gap-2">
                    {["Chill","Balanced","Intense"].map((c)=> (
                      <Badge key={c} variant={form.commitment===c? 'default':'secondary'} className="cursor-pointer" onClick={()=>setForm({ ...form, commitment: c })}>{c}</Badge>
                    ))}
                  </div>
                </div>

                <div className="rounded-lg bg-white/5 p-3">
                  <div className="text-sm font-medium mb-1">Review</div>
                  <div className="text-xs text-white/70">{form.name || 'Your name'}, {faculties.find(f=>f.id===form.faculty)?.name} • Prefers {form.projectType}, team of {form.teamSize}, {form.commitment.toLowerCase()} pace. {form.skills.length} skills selected. {selectedSummary}.</div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="ghost" onClick={back} disabled={step === 0}>Back</Button>
          <Button onClick={step === steps.length - 1 ? finish : next}>
            {step === steps.length - 1 ? 'Finish' : 'Next'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}


