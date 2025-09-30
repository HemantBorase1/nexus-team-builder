// Data transformation and utility helpers

export function formatDate(dt) {
  const d = new Date(dt);
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

export function formatTime(t) {
  // expects 'HH:MM:SS' or Date
  if (typeof t === 'string') return t.slice(0,5);
  const d = new Date(t); return `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
}

export function normalizeScore(x) {
  const v = Math.max(0, Math.min(100, Number(x) || 0));
  return Math.round(v);
}

export function paginate({ page = 1, pageSize = 20 }) {
  const p = Math.max(1, Number(page));
  const s = Math.max(1, Math.min(200, Number(pageSize)));
  const offset = (p - 1) * s; const limit = s;
  return { offset, limit };
}

export function mapDbProject(project) {
  if (!project) return null;
  return { ...project, created_at: formatDate(project.created_at) };
}

export function batchChunks(arr, size = 100) {
  const out = []; for (let i=0;i<arr.length;i+=size) out.push(arr.slice(i, i+size)); return out;
}

// Very naive in-memory cache (process-scoped)
const cache = new Map();
export function memoize(key, compute, ttlMs = 60_000) {
  const hit = cache.get(key);
  const now = Date.now();
  if (hit && now - hit.ts < ttlMs) return hit.value;
  const value = compute();
  cache.set(key, { value, ts: now });
  return value;
}


