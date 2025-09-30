import getSupabaseClient from "./supabaseClient";

const faculties = ['Engineering','Science','Business','Arts','Medicine'];
const types = ['Web App','Mobile App','Platform','Assistant','Tool'];
const tags = ['Health','Education','Finance','Climate','Social'];

function rand(arr){ return arr[Math.floor(Math.random()*arr.length)]; }
function randint(min,max){ return Math.floor(Math.random()*(max-min+1))+min; }

export function generateUsers(n = 20) {
  const first = ['Alex','Jamie','Taylor','Jordan','Morgan','Casey','Riley','Avery','Quinn','Rowan','Parker','Dakota','Reese','Skyler','Cameron','Harper','Finley','Emerson'];
  const last = ['Lee','Patel','Nguyen','Garcia','Kim','Singh','Brown','Wilson','Martinez','O\'Connor','Davis','Clark','Turner','Wright'];
  const users = [];
  for (let i=0;i<n;i++){
    const name = `${rand(first)} ${rand(last)}`;
    const skillsPool = ['react','nextjs','tailwind','node','express','python','uiux','figma','ml','ds','sql','pm','qa','devops'];
    const skills = skillsPool
      .filter(()=>Math.random()>0.5)
      .slice(0, randint(3,6))
      .map(id => ({ id, level: randint(1,5) }));
    const availability = Array.from({ length: 7 }).map(() => Array.from({ length: 24 }).map(() => (Math.random() > 0.7 ? 1 : 0)));
    users.push({
      id: `mock-${i+1}`,
      name,
      email: `${name.toLowerCase().replace(/\s+/g,'.')}@example.com`,
      faculty: rand(['eng','sci','bus','art','med']),
      facultyName: rand(faculties),
      year: randint(1,4),
      avatar: `https://api.dicebear.com/8.x/fun-emoji/svg?seed=${encodeURIComponent(name)}&radius=50`,
      skills,
      interests: [rand(tags), rand(tags)].filter((v,i,a)=>a.indexOf(v)===i),
      experience: randint(1,5),
      work: { communication: rand(['Async','Hybrid','Sync']), pace: rand(['Chill','Balanced','Intense']), meeting: randint(0,10) },
      availability,
      compatibility: randint(60,97),
    });
  }
  return users;
}

export function generateProjects(n = 10) {
  const skillsMap = { react:1,nextjs:1,tailwind:1,node:2,express:2,python:2,uiux:1,figma:1,ml:3,ds:2,sql:2,pm:1,qa:1,devops:2 };
  const ids = Object.keys(skillsMap);
  const projects = [];
  for (let i=0;i<n;i++){
    const req = Array.from({ length: randint(3,6) }).map(() => {
      const skill_id = rand(ids);
      return { skill_id, required_level: skillsMap[skill_id] || 1, weight: randint(1,3) };
    });
    projects.push({
      id: `proj-mock-${i+1}`,
      name: `${rand(['Smart','Next','Nova','Atlas','Echo'])} ${rand(['Campus','Health','Insight','Flow','Bridge'])}`,
      type: rand(types),
      description: 'A realistic project with clear goals and requirements.',
      status: rand(['Planning','Active','Completed']),
      team_size: randint(3,7),
      requirements: req,
      tags: [rand(tags), rand(tags)].filter((v,i,a)=>a.indexOf(v)===i),
      complexity: randint(1,5),
      meetingFreq: randint(2,8),
    });
  }
  return projects;
}

export function generateTeams(users, projects, n = 4) {
  const teams = [];
  for (let i=0;i<n;i++){
    const project = rand(projects);
    const shuffled = users.sort(()=>Math.random()-0.5).slice(0, randint(3, project.team_size));
    teams.push({ id: `team-mock-${i+1}`, name: `Team ${i+1}`, projectId: project.id, members: shuffled.map(u=>u.id), score: randint(60,95) });
  }
  return teams;
}

// Seeding utilities (Supabase)
export async function seedSkillsCatalog() {
  const skills = [
    { name:'React', category:'Frontend', icon:'✨' }, { name:'Next.js', category:'Frontend', icon:'⚡' }, { name:'Tailwind', category:'Frontend', icon:'🎨' },
    { name:'Node.js', category:'Backend', icon:'🛠️' }, { name:'Express', category:'Backend', icon:'🚂' }, { name:'Python', category:'Backend', icon:'🐍' },
    { name:'UI/UX', category:'Design', icon:'🎯' }, { name:'Figma', category:'Design', icon:'📐' }, { name:'AI/ML', category:'Data', icon:'🤖' },
    { name:'Data Science', category:'Data', icon:'📊' }, { name:'SQL', category:'Data', icon:'🗄️' }, { name:'Product', category:'Management', icon:'🧭' },
    { name:'QA/Testing', category:'Quality', icon:'🧪' }, { name:'DevOps', category:'Infra', icon:'⚙️' },
  ];
  const supabase = getSupabaseClient();
  await supabase.from('skills').insert(skills).select('*');
}

export async function resetDatabase() {
  const supabase = getSupabaseClient();
  await supabase.from('team_members').delete().neq('team_id', '');
  await supabase.from('teams').delete().neq('id', '');
  await supabase.from('project_requirements').delete().neq('project_id', '');
  await supabase.from('projects').delete().neq('id', '');
  await supabase.from('user_skills').delete().neq('user_id', '');
  await supabase.from('availability').delete().neq('user_id', '');
}

export async function seedProjects({ owner_id }) {
  const supabase = getSupabaseClient();
  const projects = generateProjects(8);
  for (const p of projects){
    const { data: proj } = await supabase.from('projects').insert([{ owner_id, name: p.name, type: p.type, description: p.description, status: p.status, team_size: p.team_size }]).select('*').single();
    if (p.requirements?.length) {
      const rows = p.requirements.map(r => ({ project_id: proj.id, skill_id: r.skill_id, required_level: r.required_level, weight: r.weight }));
      await supabase.from('project_requirements').insert(rows);
    }
  }
}

export async function seedDemo(owner_id) {
  await seedSkillsCatalog();
  await seedProjects({ owner_id });
}


