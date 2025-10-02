// COMPREHENSIVE STATIC DATA FOR NEXUS TEAM BUILDER
// Complete dataset for demo purposes - no backend required

export const staticData = {
  // CURRENT USER (Demo User)
  currentUser: {
    id: 'user-1',
    name: 'Alex Johnson',
    email: 'alex.johnson@student.unsw.edu.au',
    faculty: 'Engineering',
    avatar_url: '/demo-avatars/engineer-male.jpg',
    year: 3,
    bio: 'Passionate about AI and building impactful software solutions. Love working on challenging projects that make a difference.',
    skills: [
      { id: 'skill-1', name: 'React', level: 'advanced', category: 'Frontend' },
      { id: 'skill-2', name: 'Node.js', level: 'intermediate', category: 'Backend' },
      { id: 'skill-3', name: 'Python', level: 'intermediate', category: 'Backend' },
      { id: 'skill-4', name: 'UI/UX Design', level: 'beginner', category: 'Design' },
      { id: 'skill-5', name: 'Machine Learning', level: 'beginner', category: 'AI/ML' }
    ],
    availability: [
      { day: 'Monday', time: '10:00-12:00' },
      { day: 'Tuesday', time: '14:00-16:00' },
      { day: 'Wednesday', time: '16:00-18:00' },
      { day: 'Thursday', time: '11:00-13:00' },
      { day: 'Friday', time: '15:00-17:00' }
    ],
    workStyle: {
      communication: 'async',
      meetingFrequency: 'medium',
      timezone: 'GMT+10',
      preferredTime: 'afternoon'
    },
    preferences: {
      projectTypes: ['AI/ML', 'Web Development', 'Mobile Apps'],
      teamSize: { min: 3, max: 5 },
      faculties: ['Engineering', 'Science', 'Business']
    },
    stats: {
      projectsCompleted: 8,
      teamsJoined: 12,
      connections: 45,
      rating: 4.8
    }
  },

  // 20+ DIVERSE USERS FOR MATCHING
  users: [
    {
      id: 'user-2',
      name: 'Sarah Chen',
      faculty: 'Computer Science',
      avatar_url: '/demo-avatars/computer-science-female.jpg',
      year: 4,
      bio: 'AI enthusiast with a passion for machine learning and data science.',
      skills: [
        { id: 'skill-6', name: 'Machine Learning', level: 'advanced', category: 'AI/ML' },
        { id: 'skill-7', name: 'Python', level: 'advanced', category: 'Backend' },
        { id: 'skill-8', name: 'Data Analysis', level: 'intermediate', category: 'Data' },
        { id: 'skill-9', name: 'TensorFlow', level: 'intermediate', category: 'AI/ML' }
      ],
      availability: [
        { day: 'Monday', time: '09:00-11:00' },
        { day: 'Tuesday', time: '13:00-15:00' },
        { day: 'Thursday', time: '15:00-17:00' }
      ],
      workStyle: { communication: 'sync', meetingFrequency: 'high' },
      compatibility: 92
    },
    {
      id: 'user-3',
      name: 'Marcus Rodriguez',
      faculty: 'Business',
      avatar_url: '/demo-avatars/business-male.jpg',
      year: 2,
      bio: 'Entrepreneurial spirit with strong project management skills.',
      skills: [
        { id: 'skill-10', name: 'Project Management', level: 'advanced', category: 'Business' },
        { id: 'skill-11', name: 'Market Research', level: 'intermediate', category: 'Business' },
        { id: 'skill-12', name: 'UI/UX Design', level: 'beginner', category: 'Design' },
        { id: 'skill-13', name: 'Agile Methodology', level: 'intermediate', category: 'Business' }
      ],
      availability: [
        { day: 'Tuesday', time: '10:00-12:00' },
        { day: 'Wednesday', time: '14:00-16:00' },
        { day: 'Friday', time: '11:00-13:00' }
      ],
      workStyle: { communication: 'async', meetingFrequency: 'low' },
      compatibility: 78
    },
    {
      id: 'user-4',
      name: 'Emma Wilson',
      faculty: 'Design',
      avatar_url: '/demo-avatars/design-female.jpg',
      year: 3,
      bio: 'Creative designer focused on user experience and visual design.',
      skills: [
        { id: 'skill-14', name: 'Figma', level: 'advanced', category: 'Design' },
        { id: 'skill-15', name: 'UI/UX Design', level: 'advanced', category: 'Design' },
        { id: 'skill-16', name: 'Adobe Creative Suite', level: 'intermediate', category: 'Design' },
        { id: 'skill-17', name: 'Prototyping', level: 'intermediate', category: 'Design' }
      ],
      availability: [
        { day: 'Monday', time: '13:00-15:00' },
        { day: 'Wednesday', time: '10:00-12:00' },
        { day: 'Friday', time: '14:00-16:00' }
      ],
      workStyle: { communication: 'sync', meetingFrequency: 'medium' },
      compatibility: 85
    },
    {
      id: 'user-5',
      name: 'David Kim',
      faculty: 'Engineering',
      avatar_url: '/demo-avatars/engineering-male.jpg',
      year: 4,
      bio: 'Full-stack developer with expertise in modern web technologies.',
      skills: [
        { id: 'skill-18', name: 'React', level: 'advanced', category: 'Frontend' },
        { id: 'skill-19', name: 'Node.js', level: 'advanced', category: 'Backend' },
        { id: 'skill-20', name: 'TypeScript', level: 'intermediate', category: 'Frontend' },
        { id: 'skill-21', name: 'MongoDB', level: 'intermediate', category: 'Backend' }
      ],
      availability: [
        { day: 'Tuesday', time: '09:00-11:00' },
        { day: 'Thursday', time: '14:00-16:00' },
        { day: 'Friday', time: '10:00-12:00' }
      ],
      workStyle: { communication: 'async', meetingFrequency: 'medium' },
      compatibility: 88
    },
    {
      id: 'user-6',
      name: 'Lisa Zhang',
      faculty: 'Science',
      avatar_url: '/demo-avatars/science-female.jpg',
      year: 3,
      bio: 'Data scientist with strong analytical skills and research background.',
      skills: [
        { id: 'skill-22', name: 'Python', level: 'advanced', category: 'Backend' },
        { id: 'skill-23', name: 'Data Analysis', level: 'advanced', category: 'Data' },
        { id: 'skill-24', name: 'Statistics', level: 'intermediate', category: 'Data' },
        { id: 'skill-25', name: 'R', level: 'intermediate', category: 'Data' }
      ],
      availability: [
        { day: 'Monday', time: '14:00-16:00' },
        { day: 'Wednesday', time: '09:00-11:00' },
        { day: 'Friday', time: '13:00-15:00' }
      ],
      workStyle: { communication: 'sync', meetingFrequency: 'high' },
      compatibility: 90
    },
    {
      id: 'user-7',
      name: 'James Thompson',
      faculty: 'Engineering',
      avatar_url: '/demo-avatars/engineering-male-2.jpg',
      year: 2,
      bio: 'Mobile app developer with focus on iOS and Android development.',
      skills: [
        { id: 'skill-26', name: 'React Native', level: 'intermediate', category: 'Mobile' },
        { id: 'skill-27', name: 'Swift', level: 'intermediate', category: 'Mobile' },
        { id: 'skill-28', name: 'JavaScript', level: 'advanced', category: 'Frontend' },
        { id: 'skill-29', name: 'Firebase', level: 'beginner', category: 'Backend' }
      ],
      availability: [
        { day: 'Tuesday', time: '15:00-17:00' },
        { day: 'Thursday', time: '10:00-12:00' },
        { day: 'Friday', time: '16:00-18:00' }
      ],
      workStyle: { communication: 'async', meetingFrequency: 'low' },
      compatibility: 82
    },
    {
      id: 'user-8',
      name: 'Maria Garcia',
      faculty: 'Business',
      avatar_url: '/demo-avatars/business-female.jpg',
      year: 4,
      bio: 'Marketing specialist with digital marketing and analytics expertise.',
      skills: [
        { id: 'skill-30', name: 'Digital Marketing', level: 'advanced', category: 'Business' },
        { id: 'skill-31', name: 'Analytics', level: 'intermediate', category: 'Data' },
        { id: 'skill-32', name: 'Content Strategy', level: 'intermediate', category: 'Business' },
        { id: 'skill-33', name: 'Social Media', level: 'advanced', category: 'Business' }
      ],
      availability: [
        { day: 'Monday', time: '11:00-13:00' },
        { day: 'Wednesday', time: '15:00-17:00' },
        { day: 'Friday', time: '09:00-11:00' }
      ],
      workStyle: { communication: 'sync', meetingFrequency: 'medium' },
      compatibility: 75
    },
    {
      id: 'user-9',
      name: 'Ahmed Hassan',
      faculty: 'Computer Science',
      avatar_url: '/demo-avatars/computer-science-male.jpg',
      year: 3,
      bio: 'Cybersecurity enthusiast with strong programming and security skills.',
      skills: [
        { id: 'skill-34', name: 'Cybersecurity', level: 'intermediate', category: 'Security' },
        { id: 'skill-35', name: 'Python', level: 'advanced', category: 'Backend' },
        { id: 'skill-36', name: 'Linux', level: 'intermediate', category: 'System' },
        { id: 'skill-37', name: 'Network Security', level: 'beginner', category: 'Security' }
      ],
      availability: [
        { day: 'Tuesday', time: '12:00-14:00' },
        { day: 'Thursday', time: '16:00-18:00' },
        { day: 'Friday', time: '14:00-16:00' }
      ],
      workStyle: { communication: 'async', meetingFrequency: 'low' },
      compatibility: 80
    },
    {
      id: 'user-10',
      name: 'Sophie Brown',
      faculty: 'Design',
      avatar_url: '/demo-avatars/design-female-2.jpg',
      year: 2,
      bio: 'Graphic designer with strong visual communication skills.',
      skills: [
        { id: 'skill-38', name: 'Adobe Illustrator', level: 'advanced', category: 'Design' },
        { id: 'skill-39', name: 'Photoshop', level: 'advanced', category: 'Design' },
        { id: 'skill-40', name: 'Branding', level: 'intermediate', category: 'Design' },
        { id: 'skill-41', name: 'Typography', level: 'intermediate', category: 'Design' }
      ],
      availability: [
        { day: 'Monday', time: '15:00-17:00' },
        { day: 'Wednesday', time: '11:00-13:00' },
        { day: 'Friday', time: '12:00-14:00' }
      ],
      workStyle: { communication: 'sync', meetingFrequency: 'medium' },
      compatibility: 77
    }
  ],

  // 10+ SAMPLE PROJECTS
  projects: [
    {
      id: 'project-1',
      title: 'AI Study Assistant',
      description: 'Build an intelligent study assistant that creates personalized learning plans using machine learning algorithms.',
      category: 'AI/ML',
      type: 'Web App',
      requiredSkills: ['Python', 'Machine Learning', 'React', 'UI/UX Design'],
      preferredFaculties: ['Engineering', 'Science'],
      scope: 'intermediate',
      teamSize: { min: 3, max: 4 },
      status: 'recruiting',
      compatibility: 95,
      progress: 0,
      owner: 'user-1',
      createdAt: '2024-01-15',
      deadline: '2024-04-15'
    },
    {
      id: 'project-2',
      title: 'Campus Connect Social Platform',
      description: 'Create a social platform for UNSW students to connect based on interests, courses, and study groups.',
      category: 'Web Development',
      type: 'Platform',
      requiredSkills: ['React', 'Node.js', 'MongoDB', 'UI/UX Design'],
      preferredFaculties: ['Engineering', 'Arts', 'Business'],
      scope: 'advanced',
      teamSize: { min: 4, max: 6 },
      status: 'recruiting',
      compatibility: 87,
      progress: 0,
      owner: 'user-2',
      createdAt: '2024-01-10',
      deadline: '2024-05-01'
    },
    {
      id: 'project-3',
      title: 'Sustainable Campus App',
      description: 'Develop a mobile app to track and promote sustainable practices on campus.',
      category: 'Mobile Development',
      type: 'Mobile App',
      requiredSkills: ['React Native', 'Firebase', 'UI/UX Design', 'Environmental Science'],
      preferredFaculties: ['Engineering', 'Science', 'Design'],
      scope: 'beginner',
      teamSize: { min: 3, max: 5 },
      status: 'active',
      compatibility: 82,
      progress: 45,
      owner: 'user-3',
      createdAt: '2024-01-05',
      deadline: '2024-03-30'
    },
    {
      id: 'project-4',
      title: 'Virtual Reality Learning Environment',
      description: 'Create an immersive VR experience for complex scientific concepts.',
      category: 'VR/AR',
      type: 'Platform',
      requiredSkills: ['Unity', 'C#', '3D Modeling', 'Educational Design'],
      preferredFaculties: ['Engineering', 'Science', 'Design'],
      scope: 'advanced',
      teamSize: { min: 4, max: 6 },
      status: 'recruiting',
      compatibility: 78,
      progress: 0,
      owner: 'user-4',
      createdAt: '2024-01-20',
      deadline: '2024-06-15'
    },
    {
      id: 'project-5',
      title: 'Blockchain Voting System',
      description: 'Implement a secure, transparent voting system using blockchain technology.',
      category: 'Blockchain',
      type: 'Web App',
      requiredSkills: ['Solidity', 'Web3.js', 'React', 'Cybersecurity'],
      preferredFaculties: ['Engineering', 'Computer Science'],
      scope: 'advanced',
      teamSize: { min: 3, max: 4 },
      status: 'recruiting',
      compatibility: 85,
      progress: 0,
      owner: 'user-5',
      createdAt: '2024-01-18',
      deadline: '2024-04-30'
    }
  ],

  // USER'S CURRENT TEAMS
  userTeams: [
    {
      id: 'team-1',
      projectId: 'project-1',
      name: 'AI Study Squad',
      members: ['user-1', 'user-2', 'user-6'],
      compatibility: 92,
      status: 'active',
      createdAt: '2024-01-15',
      progress: 35
    },
    {
      id: 'team-2',
      projectId: 'project-3',
      name: 'Green Campus Team',
      members: ['user-1', 'user-4', 'user-7'],
      compatibility: 88,
      status: 'active',
      createdAt: '2024-01-10',
      progress: 60
    }
  ],

  // SKILLS CATALOG
  skills: [
    { id: 'skill-1', name: 'React', category: 'Frontend', level: 'advanced', icon: '⚛️' },
    { id: 'skill-2', name: 'Node.js', category: 'Backend', level: 'intermediate', icon: '🟢' },
    { id: 'skill-3', name: 'Python', category: 'Backend', level: 'intermediate', icon: '🐍' },
    { id: 'skill-4', name: 'JavaScript', category: 'Frontend', level: 'advanced', icon: '🟨' },
    { id: 'skill-5', name: 'TypeScript', category: 'Frontend', level: 'intermediate', icon: '🔷' },
    { id: 'skill-6', name: 'Machine Learning', category: 'AI/ML', level: 'beginner', icon: '🤖' },
    { id: 'skill-7', name: 'Data Analysis', category: 'Data', level: 'intermediate', icon: '📊' },
    { id: 'skill-8', name: 'UI/UX Design', category: 'Design', level: 'beginner', icon: '🎨' },
    { id: 'skill-9', name: 'Figma', category: 'Design', level: 'intermediate', icon: '🎨' },
    { id: 'skill-10', name: 'Project Management', category: 'Business', level: 'advanced', icon: '📋' },
    { id: 'skill-11', name: 'Agile Methodology', category: 'Business', level: 'intermediate', icon: '🔄' },
    { id: 'skill-12', name: 'MongoDB', category: 'Backend', level: 'intermediate', icon: '🍃' },
    { id: 'skill-13', name: 'React Native', category: 'Mobile', level: 'intermediate', icon: '📱' },
    { id: 'skill-14', name: 'Cybersecurity', category: 'Security', level: 'beginner', icon: '🔒' },
    { id: 'skill-15', name: 'Digital Marketing', category: 'Business', level: 'advanced', icon: '📈' }
  ],

  // FACULTIES
  faculties: [
    { id: 'eng', name: 'Engineering', color: '#8B5CF6' },
    { id: 'cs', name: 'Computer Science', color: '#06B6D4' },
    { id: 'sci', name: 'Science', color: '#10B981' },
    { id: 'bus', name: 'Business', color: '#F59E0B' },
    { id: 'art', name: 'Arts', color: '#EC4899' },
    { id: 'med', name: 'Medicine', color: '#EF4444' },
    { id: 'law', name: 'Law', color: '#6366F1' },
    { id: 'des', name: 'Design', color: '#8B5CF6' }
  ],

  // NOTIFICATIONS
  notifications: [
    {
      id: 'notif-1',
      type: 'team_invite',
      title: 'Team Invitation',
      message: 'Sarah Chen invited you to join "AI Study Squad"',
      timestamp: '2024-01-20T10:30:00Z',
      read: false
    },
    {
      id: 'notif-2',
      type: 'project_update',
      title: 'Project Update',
      message: 'New member joined "Green Campus Team"',
      timestamp: '2024-01-19T15:45:00Z',
      read: true
    },
    {
      id: 'notif-3',
      type: 'match',
      title: 'New Match',
      message: 'You have a 92% compatibility with Marcus Rodriguez',
      timestamp: '2024-01-19T09:15:00Z',
      read: false
    }
  ],

  // ANALYTICS DATA
  analytics: {
    skillsDistribution: [
      { name: 'Frontend', value: 35, color: '#8B5CF6' },
      { name: 'Backend', value: 25, color: '#06B6D4' },
      { name: 'Design', value: 20, color: '#EC4899' },
      { name: 'AI/ML', value: 15, color: '#10B981' },
      { name: 'Business', value: 5, color: '#F59E0B' }
    ],
    facultyDistribution: [
      { name: 'Engineering', value: 40, color: '#8B5CF6' },
      { name: 'Computer Science', value: 25, color: '#06B6D4' },
      { name: 'Business', value: 15, color: '#F59E0B' },
      { name: 'Design', value: 10, color: '#EC4899' },
      { name: 'Science', value: 10, color: '#10B981' }
    ],
    compatibilityTrends: [
      { week: 'W1', score: 75 },
      { week: 'W2', score: 78 },
      { week: 'W3', score: 82 },
      { week: 'W4', score: 85 },
      { week: 'W5', score: 88 },
      { week: 'W6', score: 90 },
      { week: 'W7', score: 92 },
      { week: 'W8', score: 95 }
    ]
  }
};

// HELPER FUNCTIONS
export const getCurrentUser = () => staticData.currentUser;
export const getAllUsers = () => staticData.users;
export const getAllProjects = () => staticData.projects;
export const getUserTeams = () => staticData.userTeams;
export const getAllSkills = () => staticData.skills;
export const getAllFaculties = () => staticData.faculties;
export const getNotifications = () => staticData.notifications;
export const getAnalytics = () => staticData.analytics;

// MATCHING FUNCTIONS
export const getMatchingUsers = (currentUserId, limit = 20) => {
  return staticData.users
    .filter(user => user.id !== currentUserId)
    .sort((a, b) => b.compatibility - a.compatibility)
    .slice(0, limit);
};

export const getRecommendedProjects = (userId, limit = 10) => {
  return staticData.projects
    .filter(project => project.owner !== userId)
    .sort((a, b) => b.compatibility - a.compatibility)
    .slice(0, limit);
};

export const calculateCompatibility = (user1, user2) => {
  // Simple compatibility calculation based on skills overlap
  const skills1 = user1.skills.map(s => s.name);
  const skills2 = user2.skills.map(s => s.name);
  const commonSkills = skills1.filter(skill => skills2.includes(skill));
  const totalSkills = new Set([...skills1, ...skills2]).size;
  
  return Math.round((commonSkills.length / totalSkills) * 100);
};

export const getFacultyColor = (facultyId) => {
  const faculty = staticData.faculties.find(f => f.id === facultyId);
  return faculty ? faculty.color : '#8B5CF6';
};

export const getFacultyName = (facultyId) => {
  const faculty = staticData.faculties.find(f => f.id === facultyId);
  return faculty ? faculty.name : 'Unknown';
};
