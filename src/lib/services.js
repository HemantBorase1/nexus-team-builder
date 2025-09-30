import getSupabaseClient from "./supabaseClient";
import { formatError } from "./errors";

function ok(data){ return { ok: true, data, error: null }; }
function fail(err){ return { ok: false, data: null, error: formatError(err) }; }

// ========= USER MANAGEMENT =========
export async function createUserProfile({ id, full_name, faculty, year, avatar_url, bio }) {
  try {
    const supabase = getSupabaseClient();
    const { error } = await supabase.from('profiles').insert([{ id, full_name, faculty, year, avatar_url, bio }]);
    if (error) throw error;
    return ok(true);
  } catch (err) {
    return fail(err);
  }
}

export async function getUserProfile({ userId }) {
  try {
    const supabase = getSupabaseClient();
    const { data: profile, error: pErr } = await supabase.from('profiles').select('*').eq('id', userId).single();
    if (pErr) throw pErr;
    const { data: skills, error: sErr } = await supabase
      .from('user_skills')
      .select('level, skills:skill_id ( id, name, category, icon )')
      .eq('user_id', userId);
    if (sErr) throw sErr;
    const { data: availability, error: aErr } = await supabase
      .from('availability')
      .select('*')
      .eq('user_id', userId)
      .order('day_of_week');
    if (aErr) throw aErr;
    return ok({ profile, skills, availability });
  } catch (err) {
    return fail(err);
  }
}

export async function updateUserProfile({ userId, updates }) {
  try {
    const supabase = getSupabaseClient();
    const { error } = await supabase.from('profiles').update(updates).eq('id', userId);
    if (error) throw error;
    return ok(true);
  } catch (err) {
    return fail(err);
  }
}

export async function searchUsers({ skills = [], faculty, limit = 20, offset = 0 }) {
  try {
    const supabase = getSupabaseClient();
    let query = supabase.from('profiles').select('*, user_skills!inner(skill_id)').range(offset, offset + limit - 1);
    if (faculty) query = query.eq('faculty', faculty);
    if (skills.length > 0) query = query.in('user_skills.skill_id', skills);
    const { data, error } = await query;
    if (error) throw error;
    return ok(data);
  } catch (err) {
    return fail(err);
  }
}

// ========= SKILLS MANAGEMENT =========
export async function getUserSkills({ userId }) {
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('user_skills')
      .select('level, skills:skill_id ( id, name, category, icon )')
      .eq('user_id', userId);
    if (error) throw error;
    return ok(data);
  } catch (err) {
    return fail(err);
  }
}

export async function updateUserSkills({ userId, skills }) {
  // skills: [{ skill_id, level }]
  try {
    const supabase = getSupabaseClient();
    const { error: delErr } = await supabase.from('user_skills').delete().eq('user_id', userId);
    if (delErr) throw delErr;
    if (skills && skills.length) {
      const rows = skills.map(s => ({ user_id: userId, skill_id: s.skill_id, level: s.level }));
      const { error: insErr } = await supabase.from('user_skills').insert(rows);
      if (insErr) throw insErr;
    }
    return ok(true);
  } catch (err) {
    return fail(err);
  }
}

export async function getSkillsCatalog() {
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.from('skills').select('*').order('name');
    if (error) throw error;
    return ok(data);
  } catch (err) {
    return fail(err);
  }
}

// ========= AVAILABILITY =========
export async function setUserAvailability({ userId, slots }) {
  // slots: [{ day_of_week, start_time, end_time }]
  try {
    const supabase = getSupabaseClient();
    const { error: delErr } = await supabase.from('availability').delete().eq('user_id', userId);
    if (delErr) throw delErr;
    const rows = slots.map(s => ({ ...s, user_id: userId }));
    const { error: insErr } = await supabase.from('availability').insert(rows);
    if (insErr) throw insErr;
    return ok(true);
  } catch (err) {
    return fail(err);
  }
}

export async function getUserAvailability({ userId }) {
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.from('availability').select('*').eq('user_id', userId).order('day_of_week');
    if (error) throw error;
    return ok(data);
  } catch (err) {
    return fail(err);
  }
}

export function findCommonAvailability({ usersAvailability }) {
  // usersAvailability: array of arrays of slots [{ day_of_week, start_time, end_time }]
  // naive approach: group by day and intersect time ranges
  try {
    const byDay = new Map();
    usersAvailability.flat().forEach(slot => {
      const key = slot.day_of_week;
      if (!byDay.get(key)) byDay.set(key, []);
      byDay.get(key).push({ start: slot.start_time, end: slot.end_time });
    });
    // Intersection per day (simplified by returning all slots for now)
    const result = Array.from(byDay.entries()).map(([day, ranges]) => ({ day_of_week: Number(day), ranges }));
    return ok(result);
  } catch (err) {
    return fail(err);
  }
}

// ========= PROJECTS =========
export async function createProject({ owner_id, name, type, description, status = 'Planning', team_size, requirements = [] }) {
  try {
    const supabase = getSupabaseClient();
    const { data: proj, error } = await supabase
      .from('projects')
      .insert([{ owner_id, name, type, description, status, team_size }])
      .select('*')
      .single();
    if (error) throw error;
    if (requirements.length) {
      const rows = requirements.map(r => ({ project_id: proj.id, skill_id: r.skill_id, required_level: r.required_level, weight: r.weight || 1 }));
      const { error: reqErr } = await supabase.from('project_requirements').insert(rows);
      if (reqErr) throw reqErr;
    }
    return ok(proj);
  } catch (err) {
    return fail(err);
  }
}

export async function getProjects({ owner_id, status, q, limit = 20, offset = 0 }) {
  try {
    const supabase = getSupabaseClient();
    let query = supabase.from('projects').select('*').range(offset, offset + limit - 1).order('created_at', { ascending: false });
    if (owner_id) query = query.eq('owner_id', owner_id);
    if (status) query = query.eq('status', status);
    if (q) query = query.ilike('name', `%${q}%`);
    const { data, error } = await query;
    if (error) throw error;
    return ok(data);
  } catch (err) {
    return fail(err);
  }
}

export async function updateProject({ project_id, updates }) {
  try {
    const supabase = getSupabaseClient();
    const { error } = await supabase.from('projects').update(updates).eq('id', project_id);
    if (error) throw error;
    return ok(true);
  } catch (err) {
    return fail(err);
  }
}

export async function getProjectDetails({ project_id }) {
  try {
    const supabase = getSupabaseClient();
    const { data: project, error: pErr } = await supabase.from('projects').select('*').eq('id', project_id).single();
    if (pErr) throw pErr;
    const { data: requirements, error: rErr } = await supabase
      .from('project_requirements')
      .select('required_level, weight, skills:skill_id ( id, name, category, icon )')
      .eq('project_id', project_id);
    if (rErr) throw rErr;
    const { data: teams, error: tErr } = await supabase.from('teams').select('*').eq('project_id', project_id);
    if (tErr) throw tErr;
    return ok({ project, requirements, teams });
  } catch (err) {
    return fail(err);
  }
}

// ========= TEAMS =========
export async function createTeam({ project_id, name }) {
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.from('teams').insert([{ project_id, name }]).select('*').single();
    if (error) throw error;
    return ok(data);
  } catch (err) {
    return fail(err);
  }
}

export async function getTeamDetails({ team_id }) {
  try {
    const supabase = getSupabaseClient();
    const { data: team, error: tErr } = await supabase.from('teams').select('*').eq('id', team_id).single();
    if (tErr) throw tErr;
    const { data: members, error: mErr } = await supabase
      .from('team_members')
      .select('role, profiles:user_id ( id, full_name, faculty, avatar_url )')
      .eq('team_id', team_id);
    if (mErr) throw mErr;
    return ok({ team, members });
  } catch (err) {
    return fail(err);
  }
}

export async function addTeamMember({ team_id, user_id, role }) {
  try {
    const supabase = getSupabaseClient();
    const { error } = await supabase.from('team_members').insert([{ team_id, user_id, role }]);
    if (error) throw error;
    return ok(true);
  } catch (err) {
    return fail(err);
  }
}

export async function removeTeamMember({ team_id, user_id }) {
  try {
    const supabase = getSupabaseClient();
    const { error } = await supabase.from('team_members').delete().match({ team_id, user_id });
    if (error) throw error;
    return ok(true);
  } catch (err) {
    return fail(err);
  }
}

export async function getTeamCompatibility({ team_id }) {
  // Mock compatibility: based on overlap of skills between all pairs
  try {
    const supabase = getSupabaseClient();
    const { data: members, error } = await supabase
      .from('team_members')
      .select('profiles:user_id ( id ), user_skills:user_id ( skill_id, level )')
      .eq('team_id', team_id);
    if (error) throw error;
    // naive calculation: higher diversity + overlap -> higher score
    const memberIds = Array.from(new Set(members.map(m => m.profiles.id)));
    const diversityScore = Math.min(40, memberIds.length * 8);
    const overlapScore = Math.min(60, Math.floor(Math.random()*30)+20);
    return ok({ score: diversityScore + overlapScore });
  } catch (err) {
    return fail(err);
  }
}


