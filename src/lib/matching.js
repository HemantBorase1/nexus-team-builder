// Intelligent Team Matching Engine (JavaScript only)
// All scores normalized to 0..100

export const defaultWeights = {
  schedule: 0.25,
  skills: 0.25,
  diversity: 0.20,
  projectFit: 0.15,
  workStyle: 0.15,
};

// 1) Schedule overlap (users: [{ availability: [ [0/1]*24 ] per day ]})
export function calculateScheduleCompatibility(users, { timezoneOffsetMinutes = 0 } = {}) {
  if (!users || users.length < 2) return 100;
  // naive: per hour overlap across 7 days
  const days = 7, hours = 24;
  let total = 0, overlap = 0;
  for (let d = 0; d < days; d++) {
    for (let h = 0; h < hours; h++) {
      total++;
      const allAvailable = users.every(u => (u.availability?.[d]?.[h] ?? 0) === 1);
      if (allAvailable) overlap++;
    }
  }
  return Math.round((overlap / total) * 100);
}

// 2) Skills coverage
export function calculateSkillsCoverage(users, projectRequirements) {
  if (!projectRequirements || projectRequirements.length === 0) return 100;
  const teamSkillMax = new Map();
  users.forEach(u => {
    (u.skills || []).forEach(s => {
      const current = teamSkillMax.get(s.id) || 0;
      teamSkillMax.set(s.id, Math.max(current, s.level || 1));
    });
  });
  let covered = 0;
  projectRequirements.forEach(req => {
    const level = teamSkillMax.get(req.skill_id) || 0;
    if (level >= (req.required_level || 1)) covered++;
  });
  return Math.round((covered / projectRequirements.length) * 100);
}

// 3) Faculty diversity (more unique faculties -> higher score)
export function calculateFacultyDiversity(users) {
  const faculties = new Set(users.map(u => u.faculty));
  const unique = faculties.size;
  const n = Math.max(1, users.length);
  // normalized by team size and capped
  const raw = Math.min(1, unique / Math.min(5, n));
  return Math.round(raw * 100);
}

// 4) Project fit (interests, experience vs complexity)
export function calculateProjectFit(users, { projectTags = [], complexity = 3 } = {}) {
  // assume user.interests: [tags], user.experience: 1..5
  const scores = users.map(u => {
    const interests = new Set(u.interests || []);
    const tagOverlap = projectTags.filter(t => interests.has(t)).length;
    const interestScore = projectTags.length ? tagOverlap / projectTags.length : 1;
    const exp = Math.min(5, Math.max(1, u.experience || 3));
    const expMatch = 1 - Math.min(1, Math.abs(exp - complexity) / 4);
    return 0.6 * interestScore + 0.4 * expMatch;
  });
  const avg = scores.reduce((a,b)=>a+b,0) / Math.max(1, scores.length);
  return Math.round(avg * 100);
}

// 5) Work style compatibility
export function calculateWorkStyleCompatibility(users, { preferredPace = 'Balanced', meetingFreq = 5 } = {}) {
  // user.work: { communication: 'Async'|'Sync'|'Hybrid', pace: 'Chill'|'Balanced'|'Intense', meeting: 0..10 }
  if (!users || users.length < 2) return 100;
  const commMap = { Async: 0, Hybrid: 0.5, Sync: 1 };
  const paceMap = { Chill: 0, Balanced: 0.5, Intense: 1 };
  const commVals = users.map(u => commMap[u.work?.communication] ?? 0.5);
  const paceVals = users.map(u => paceMap[u.work?.pace] ?? 0.5);
  const meetVals = users.map(u => (u.work?.meeting ?? meetingFreq)/10);
  const varComm = variance(commVals);
  const varPace = variance(paceVals);
  const varMeet = variance(meetVals);
  const score = 1 - Math.min(1, (varComm + varPace + varMeet) / 3);
  return Math.round(score * 100);
}

function variance(arr){
  const n = arr.length; if (!n) return 0; const mean = arr.reduce((a,b)=>a+b,0)/n; return arr.reduce((s,x)=>s+(x-mean)**2,0)/n;
}

// Combine dimension scores
export function combineScores(dimensions, weights = defaultWeights) {
  const total = Object.values(weights).reduce((a,b)=>a+b,0) || 1;
  let sum = 0;
  sum += (dimensions.schedule ?? 0) * (weights.schedule/total);
  sum += (dimensions.skills ?? 0) * (weights.skills/total);
  sum += (dimensions.diversity ?? 0) * (weights.diversity/total);
  sum += (dimensions.projectFit ?? 0) * (weights.projectFit/total);
  sum += (dimensions.workStyle ?? 0) * (weights.workStyle/total);
  return Math.round(sum);
}

// Optimize team formations (naive: sample combinations up to limit)
export function optimizeTeamFormations({ candidates, teamSize = 5, project }) {
  // candidates: array of users with availability, skills, faculty, interests, experience, work
  const combos = sampleCombinations(candidates, teamSize, 120);
  const results = combos.map(team => {
    const schedule = calculateScheduleCompatibility(team);
    const skills = calculateSkillsCoverage(team, project?.requirements || []);
    const diversity = calculateFacultyDiversity(team);
    const projectFit = calculateProjectFit(team, { projectTags: project?.tags || [], complexity: project?.complexity || 3 });
    const workStyle = calculateWorkStyleCompatibility(team, { meetingFreq: project?.meetingFreq || 5 });
    const score = combineScores({ schedule, skills, diversity, projectFit, workStyle });
    return { team, score, dimensions: { schedule, skills, diversity, projectFit, workStyle } };
  });
  results.sort((a,b)=>b.score - a.score);
  return results.slice(0, 3);
}

// helper to sample combinations for large candidate sets
function sampleCombinations(arr, k, maxSamples = 200) {
  if (k >= arr.length) return [arr.slice()];
  const indices = Array.from({length: arr.length}, (_,i)=>i);
  const picked = new Set();
  const out = [];
  const cap = Math.min(maxSamples, 2000);
  while (out.length < cap) {
    const choice = new Set();
    while (choice.size < k) {
      choice.add(indices[Math.floor(Math.random()*indices.length)]);
    }
    const key = Array.from(choice).sort().join('-');
    if (picked.has(key)) continue;
    picked.add(key);
    out.push(Array.from(choice).map(i => arr[i]));
  }
  return out;
}


