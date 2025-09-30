// Rich mock data for Nexus Team Builder (JS only)

export const faculties = [
  { id: 'eng', name: 'Engineering', color: '#3B82F6' },
  { id: 'sci', name: 'Science', color: '#22C55E' },
  { id: 'bus', name: 'Business', color: '#F59E0B' },
  { id: 'art', name: 'Arts', color: '#EC4899' },
  { id: 'med', name: 'Medicine', color: '#EF4444' },
];

export const skillsCatalog = [
  { id: 'react', name: 'React', category: 'Frontend', icon: '✨' },
  { id: 'nextjs', name: 'Next.js', category: 'Frontend', icon: '⚡' },
  { id: 'tailwind', name: 'Tailwind', category: 'Frontend', icon: '🎨' },
  { id: 'node', name: 'Node.js', category: 'Backend', icon: '🛠️' },
  { id: 'express', name: 'Express', category: 'Backend', icon: '🚂' },
  { id: 'python', name: 'Python', category: 'Backend', icon: '🐍' },
  { id: 'uiux', name: 'UI/UX', category: 'Design', icon: '🎯' },
  { id: 'figma', name: 'Figma', category: 'Design', icon: '📐' },
  { id: 'ml', name: 'AI/ML', category: 'Data', icon: '🤖' },
  { id: 'ds', name: 'Data Science', category: 'Data', icon: '📊' },
  { id: 'sql', name: 'SQL', category: 'Data', icon: '🗄️' },
  { id: 'pm', name: 'Product', category: 'Management', icon: '🧭' },
  { id: 'qa', name: 'QA/Testing', category: 'Quality', icon: '🧪' },
  { id: 'devops', name: 'DevOps', category: 'Infra', icon: '⚙️' },
];

const first = ['Alex','Jamie','Taylor','Jordan','Morgan','Casey','Riley','Avery','Quinn','Rowan','Parker','Dakota','Reese','Skyler','Cameron','Harper','Finley','Emerson'];
const last = ['Lee','Patel','Nguyen','Garcia','Kim','Singh','Brown','Wilson','Martinez','O\'Connor','Davis','Clark','Turner','Wright'];

function rand(arr){return arr[Math.floor(Math.random()*arr.length)];}
function randint(min,max){return Math.floor(Math.random()*(max-min+1))+min;}

export const users = Array.from({length: 18}).map((_,i)=>{
  const name = `${rand(first)} ${rand(last)}`;
  const faculty = rand(faculties);
  const avatar = `https://api.dicebear.com/8.x/fun-emoji/svg?seed=${encodeURIComponent(name)}&radius=50`;
  const skills = skillsCatalog
    .filter(()=>Math.random()>0.45)
    .slice(0, randint(3,6))
    .map(s=>({ id:s.id, name:s.name, level: randint(1,5) }));
  const availability = Array.from({length:7}).map(()=>Array.from({length:24}).map(()=> (Math.random()>0.7?1:0)));
  return {
    id:`user-${i+1}`,
    name,
    email: `${name.toLowerCase().replace(/\s+/g,'.')}@example.com`,
    faculty: faculty.id,
    facultyName: faculty.name,
    avatar,
    year: randint(1,4),
    skills,
    bio: 'Builder focused on delightful, impactful products.',
    compatibility: randint(60,97),
    availability,
  };
});

export const sampleProjects = [
  { id:'p1', name:'Smart Campus Navigator', type:'Mobile App', description:'AR-powered indoor navigation across campus buildings with accessibility routing.', requiredSkills:['React','UI/UX','Node.js'], teamSize:5, progress:65, status:'Active' },
  { id:'p2', name:'Health Tracker AI', type:'Web App', description:'Personalized health recommendations using ML on wearable data.', requiredSkills:['Python','AI/ML','React'], teamSize:6, progress:40, status:'Planning' },
  { id:'p3', name:'Sustainable Supply Chain', type:'Platform', description:'Track and optimize carbon footprint across suppliers with dashboards.', requiredSkills:['Node.js','SQL','DevOps'], teamSize:7, progress:82, status:'Active' },
  { id:'p4', name:'Campus Events Hub', type:'Web App', description:'Real-time events discovery with social features and RSVPs.', requiredSkills:['Next.js','UI/UX','Data Science'], teamSize:4, progress:28, status:'Planning' },
  { id:'p5', name:'Mental Wellness Bot', type:'Assistant', description:'Empathetic chatbot offering resources and check-ins.', requiredSkills:['AI/ML','Product','React'], teamSize:5, progress:55, status:'Active' },
];

export const prebuiltTeams = [
  { id:'t1', name:'Innovators', projectId:'p1', members: users.slice(0,5).map(u=>u.id) },
  { id:'t2', name:'AI Pioneers', projectId:'p2', members: users.slice(5,11).map(u=>u.id) },
  { id:'t3', name:'Eco Builders', projectId:'p3', members: users.slice(11,16).map(u=>u.id) },
];

export function getUserById(id){ return users.find(u=>u.id===id); }
export function getFacultyMeta(fid){ return faculties.find(f=>f.id===fid) || faculties[0]; }
export function compatibilityBetween(a,b){
  const overlap = a.skills.filter(sa=> b.skills.some(sb=>sb.id===sa.id)).length;
  return Math.min(99, 50 + overlap*10 + randint(-5,5));
}


