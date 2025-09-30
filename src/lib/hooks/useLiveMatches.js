"use client";

import { useEffect, useRef, useState } from "react";
import getSupabaseClient from "../supabaseClient";
import { optimizeTeamFormations } from "../matching";

export default function useLiveMatches({ candidates = [], teamSize = 5, project = {} }) {
  const supabase = getSupabaseClient();
  const [results, setResults] = useState([]);
  const chanRef = useRef(null);

  useEffect(() => {
    // initial compute
    try { setResults(optimizeTeamFormations({ candidates, teamSize, project })); } catch (_e) {}

    // subscribe to changes in user skills and availability to recompute
    const chan = supabase.channel('live-matches')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'user_skills' }, () => {
        setResults(optimizeTeamFormations({ candidates, teamSize, project }));
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'availability' }, () => {
        setResults(optimizeTeamFormations({ candidates, teamSize, project }));
      })
      .subscribe();
    chanRef.current = chan;
    return () => { chanRef.current && supabase.removeChannel(chanRef.current); };
  }, [JSON.stringify(candidates), teamSize, JSON.stringify(project)]);

  return { results };
}


