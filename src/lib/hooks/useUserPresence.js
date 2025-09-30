"use client";

import { useEffect, useRef, useState } from "react";
import getSupabaseClient from "../supabaseClient";

// Presence channel using Realtime presence API (ephemeral)
export default function useUserPresence(room = "global") {
  const supabase = getSupabaseClient();
  const channelRef = useRef(null);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const channel = supabase.channel(`presence:${room}`, { config: { presence: { key: Math.random().toString(36).slice(2) } } });
    channelRef.current = channel;

    channel.on('presence', { event: 'sync' }, () => {
      const state = channel.presenceState();
      const list = [];
      Object.values(state).forEach(arr => arr.forEach(v => list.push(v)));
      setUsers(list);
    });

    channel.subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        await channel.track({ online_at: Date.now() });
      }
    });

    return () => { channelRef.current && supabase.removeChannel(channelRef.current); };
  }, [room]);

  return { users };
}


