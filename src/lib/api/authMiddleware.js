import { NextResponse } from "next/server";
import getSupabaseClient from "../supabaseClient";
import { jwtVerify } from "jose";

const textEncoder = new TextEncoder();

export async function verifyJwt(token) {
  try {
    const secret = process.env.NEXT_PUBLIC_SUPABASE_JWT_SECRET;
    if (!secret) return null;
    const { payload } = await jwtVerify(token, textEncoder.encode(secret));
    return payload;
  } catch (_e) {
    return null;
  }
}

export async function getSessionFromSupabase() {
  const supabase = getSupabaseClient();
  const { data } = await supabase.auth.getSession();
  return data?.session || null;
}

export function withAuth(handler, { roles } = {}) {
  return async (request, ctx) => {
    try {
      const authHeader = request.headers.get('authorization') || '';
      const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
      let user = null;
      if (token) {
        const payload = await verifyJwt(token);
        if (payload?.sub) user = { id: payload.sub, role: payload.role };
      }
      if (!user) {
        const session = await getSessionFromSupabase();
        if (session?.user) user = { id: session.user.id, role: session.user.role };
      }
      if (!user) return NextResponse.json({ ok:false, error:{ title:'Unauthorized', description:'Valid session required' } }, { status: 401 });
      if (roles && roles.length && !roles.includes(user.role)) {
        return NextResponse.json({ ok:false, error:{ title:'Forbidden', description:'Insufficient permissions' } }, { status: 403 });
      }
      return handler(request, { ...ctx, user });
    } catch (e) {
      return NextResponse.json({ ok:false, error:{ title:'Auth Error', description:e.message } }, { status: 401 });
    }
  };
}

export function validate(body, schema) {
  // Very lightweight validation; schema is { field: (v)=>boolean }
  const errors = [];
  Object.entries(schema || {}).forEach(([k, fn]) => {
    if (!fn(body?.[k])) errors.push(k);
  });
  return { valid: errors.length === 0, errors };
}

export function sanitizeString(v) {
  if (typeof v !== 'string') return v;
  return v.replace(/[<>\\]/g, '');
}

// Simple memory rate limiter per IP (process scoped)
const rateMap = new Map();
export function rateLimit({ key, windowMs = 60_000, limit = 60 }) {
  const now = Date.now();
  const entry = rateMap.get(key) || { count: 0, ts: now };
  if (now - entry.ts > windowMs) { entry.count = 0; entry.ts = now; }
  entry.count += 1; rateMap.set(key, entry);
  if (entry.count > limit) return false;
  return true;
}


