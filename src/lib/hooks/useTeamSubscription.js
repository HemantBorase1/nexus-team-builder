"use client";

import { useEffect, useRef, useState } from "react";
import getSupabaseClient from "../supabaseClient";
import { getTeamCompatibility } from "../services";

export default function useTeamSubscription(teamId) {
  const supabase = getSupabaseClient();
  const [members, setMembers] = useState([]);
  const [compatibility, setCompatibility] = useState(null);
  const chanRef = useRef(null);

  useEffect(() => {
    if (!teamId) return;
    const fetchMembers = async () => {
      const { data } = await supabase
        .from('team_members')
        .select('user_id, role')
        .eq('team_id', teamId);
      setMembers(data || []);
      const score = await getTeamCompatibility({ team_id: teamId });
      setCompatibility(score.ok ? score.data : null);
    };
    fetchMembers();

    const chan = supabase.channel(`team:${teamId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'team_members', filter: `team_id=eq.${teamId}` }, () => {
        fetchMembers();
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          // initial
        }
      });
    chanRef.current = chan;
    return () => { chanRef.current && supabase.removeChannel(chanRef.current); };
  }, [teamId]);

  return { members, compatibility };
}


