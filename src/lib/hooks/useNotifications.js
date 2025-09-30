"use client";

import { useEffect, useRef, useState } from "react";
import getSupabaseClient from "../supabaseClient";

export default function useNotifications(userId) {
  const supabase = getSupabaseClient();
  const chanRef = useRef(null);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    if (!userId) return;
    const push = (evt) => setEvents((e) => [{ id: Date.now(), ...evt }, ...e].slice(0, 50));

    const chan = supabase.channel(`notif:${userId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'invitations', filter: `invitee_id=eq.${userId}` }, (payload) => {
        push({ type: 'invite', payload });
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'projects' }, (payload) => {
        push({ type: 'project_update', payload });
      })
      .subscribe();
    chanRef.current = chan;
    return () => { chanRef.current && supabase.removeChannel(chanRef.current); };
  }, [userId]);

  return { events };
}


