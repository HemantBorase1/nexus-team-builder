"use client";

import Progress from "@/src/components/ui/Progress";

export default function TeamAnalytics({ compatibility = 78, diversity = 64, coverage = 72 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <div className="text-sm mb-1">Compatibility</div>
        <Progress value={compatibility} />
      </div>
      <div>
        <div className="text-sm mb-1">Faculty Diversity</div>
        <Progress value={diversity} color="bg-amber-500" />
      </div>
      <div>
        <div className="text-sm mb-1">Skills Coverage</div>
        <Progress value={coverage} color="bg-emerald-600" />
      </div>
    </div>
  );
}


