"use client";

import { motion } from "framer-motion";
import Avatar from "@/src/components/ui/Avatar";

export default function TeamCircle({ members = [] }) {
  const radius = 110;
  const center = 128;
  return (
    <div className="relative w-64 h-64">
      <svg className="absolute inset-0" width={256} height={256}>
        <circle cx={center} cy={center} r={radius} fill="none" stroke="#e5e7eb" />
        {members.map((m, idx) => {
          const angle = (idx / members.length) * 2 * Math.PI;
          const x = center + radius * Math.cos(angle);
          const y = center + radius * Math.sin(angle);
          return (
            <line key={m.id} x1={center} y1={center} x2={x} y2={y} stroke="#e5e7eb" />
          );
        })}
      </svg>
      <div className="absolute" style={{ left: center - 24, top: center - 24 }}>
        <Avatar name="You" size={48} />
      </div>
      {members.map((m, idx) => {
        const angle = (idx / members.length) * 2 * Math.PI;
        const x = center + radius * Math.cos(angle);
        const y = center + radius * Math.sin(angle);
        return (
          <motion.div key={m.id} initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="absolute" style={{ left: x - 20, top: y - 20 }}>
            <Avatar src={m.avatar} name={m.name} size={40} />
          </motion.div>
        );
      })}
    </div>
  );
}


