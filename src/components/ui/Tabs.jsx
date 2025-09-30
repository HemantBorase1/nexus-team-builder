"use client";

import { useState } from "react";

export default function Tabs({ tabs = [], initial = 0, onChange }) {
  const [active, setActive] = useState(initial);
  const handle = (idx) => {
    setActive(idx);
    onChange && onChange(idx);
  };
  return (
    <div>
      <div className="flex gap-2 border-b border-gray-200">
        {tabs.map((t, idx) => (
          <button
            key={idx}
            className={`px-4 py-2 text-sm font-medium rounded-t-md transition-colors ${
              active === idx ? "bg-white border-x border-t border-gray-200" : "text-gray-600 hover:text-gray-900"
            }`}
            onClick={() => handle(idx)}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="rounded-b-md border border-gray-200 border-t-0 p-4 bg-white">
        {tabs[active]?.content}
      </div>
    </div>
  );
}


