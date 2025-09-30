import { NextResponse } from "next/server";
import getSupabaseClient from "../supabaseClient";

export async function getCurrentSession() {
  const supabase = getSupabaseClient();
  const { data } = await supabase.auth.getSession();
  return data?.session || null;
}

export async function requireAuth() {
  const session = await getCurrentSession();
  if (!session?.user) {
    return { ok: false, response: NextResponse.json({ ok: false, error: { title: "Unauthorized", description: "Login required" } }, { status: 401 }) };
  }
  return { ok: true, user: session.user };
}

export async function parseJson(request) {
  try {
    return await request.json();
  } catch (_e) {
    return {};
  }
}

export function success(data, init) {
  return NextResponse.json({ ok: true, data }, init);
}

export function failure(error, status = 400) {
  const payload = typeof error === 'string' ? { title: 'Error', description: error } : error;
  return NextResponse.json({ ok: false, error: payload }, { status });
}


