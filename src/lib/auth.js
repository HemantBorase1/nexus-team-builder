import getSupabaseClient from "./supabaseClient";
import { AuthError } from "./errors";

export async function signUp({ email, password, options = {} }) {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.auth.signUp({ email, password, options });
  if (error) throw new AuthError(error.message, { code: error.status });
  return data;
}

export async function signInWithPassword({ email, password }) {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw new AuthError(error.message, { code: error.status });
  return data;
}

export async function signOut() {
  const supabase = getSupabaseClient();
  const { error } = await supabase.auth.signOut();
  if (error) throw new AuthError(error.message, { code: error.status });
  return true;
}

export async function getSession() {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.auth.getSession();
  if (error) throw new AuthError(error.message, { code: error.status });
  return data.session;
}

export function onAuthStateChange(callback) {
  const supabase = getSupabaseClient();
  const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session);
  });
  return () => listener.subscription.unsubscribe();
}


