"use client";

// LocalStorage-backed static auth simulation
const STORAGE_KEY = "nexus.auth";

function readStore() {
  if (typeof window === "undefined") return { users: [], session: null };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // seed a default demo user
      const seedUser = { id: 'u-demo', name: 'Demo User', email: 'demo@nexus.app', faculty: 'eng', createdAt: new Date().toISOString(), passwordHash: btoa('Demo@123') };
      const seeded = { users: [seedUser], session: null };
      writeStore(seeded);
      return seeded;
    }
    const parsed = JSON.parse(raw);
    if (!parsed.users || parsed.users.length === 0) {
      const seedUser = { id: 'u-demo', name: 'Demo User', email: 'demo@nexus.app', faculty: 'eng', createdAt: new Date().toISOString(), passwordHash: btoa('Demo@123') };
      const seeded = { users: [seedUser], session: parsed.session || null };
      writeStore(seeded);
      return seeded;
    }
    return { users: parsed.users || [], session: parsed.session || null };
  } catch {
    return { users: [], session: null };
  }
}

function writeStore(next) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {}
}

function delay(ms = 900) {
  return new Promise((res) => setTimeout(res, ms));
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function passwordStrength(pw) {
  let score = 0;
  if (!pw) return 0;
  if (pw.length >= 8) score += 1;
  if (/[A-Z]/.test(pw)) score += 1;
  if (/[a-z]/.test(pw)) score += 1;
  if (/[0-9]/.test(pw)) score += 1;
  if (/[^A-Za-z0-9]/.test(pw)) score += 1;
  return Math.min(5, score);
}

export const authService = {
  async signup({ name, email, password, faculty }) {
    await delay(Math.random() * 400 + 600);
    if (!validateEmail(email)) {
      return { ok: false, error: { code: "invalid_email", description: "Enter a valid email." } };
    }
    if (passwordStrength(password) < 3) {
      return { ok: false, error: { code: "weak_password", description: "Password too weak." } };
    }
    const store = readStore();
    const exists = store.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      return { ok: false, error: { code: "user_exists", description: "Email already registered." } };
    }
    const user = {
      id: `u-${Date.now()}`,
      name,
      email,
      faculty,
      createdAt: new Date().toISOString(),
      passwordHash: btoa(password), // demo only
    };
    const session = { user: { id: user.id, name: user.name, email: user.email }, createdAt: Date.now() };
    const next = { users: [...store.users, user], session };
    writeStore(next);
    return { ok: true, data: { user: session.user, session } };
  },

  async login({ email, password }) {
    await delay(Math.random() * 400 + 600);
    const store = readStore();
    // If user exists and password matches, log in; otherwise, auto-create a temp session for demo
    let user = store.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      user = { id: `u-${Date.now()}`, name: email.split('@')[0] || 'User', email, faculty: 'eng', createdAt: new Date().toISOString(), passwordHash: btoa(password || 'Demo@123') };
      writeStore({ ...store, users: [...store.users, user], session: null });
    }
    const session = { user: { id: user.id, name: user.name, email: user.email }, createdAt: Date.now() };
    writeStore({ ...readStore(), session });
    return { ok: true, data: { user: session.user, session } };
  },

  async logout() {
    await delay(300);
    const store = readStore();
    writeStore({ ...store, session: null });
    return { ok: true };
  },

  getSession() {
    const store = readStore();
    return store.session;
  },
};

export default authService;


