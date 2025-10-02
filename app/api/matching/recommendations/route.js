import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import jwt from 'jsonwebtoken';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function verifyAuth(request) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  try {
    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    return null;
  }
}

// Advanced compatibility calculation
function calculateCompatibilityScore(user1, user2) {
  let totalScore = 0;
  let weights = {
    skills: 0.4,
    schedule: 0.3,
    faculty: 0.2,
    workStyle: 0.1
  };

  // Skills compatibility (40%)
  const user1Skills = new Set(user1.user_skills?.map(s => s.skill_id) || []);
  const user2Skills = new Set(user2.user_skills?.map(s => s.skill_id) || []);
  const commonSkills = new Set([...user1Skills].filter(x => user2Skills.has(x)));
  const totalUniqueSkills = new Set([...user1Skills, ...user2Skills]).size;
  
  const skillsScore = totalUniqueSkills > 0 ? (commonSkills.size / totalUniqueSkills) * 100 : 0;
  totalScore += skillsScore * weights.skills;

  // Schedule compatibility (30%)
  const user1Availability = user1.user_availability || [];
  const user2Availability = user2.user_availability || [];
  
  let overlappingSlots = 0;
  let totalSlots = 0;
  
  for (let day = 0; day < 7; day++) {
    const user1DaySlots = user1Availability.filter(a => a.day_of_week === day);
    const user2DaySlots = user2Availability.filter(a => a.day_of_week === day);
    
    totalSlots += Math.max(user1DaySlots.length, user2DaySlots.length);
    
    user1DaySlots.forEach(slot1 => {
      user2DaySlots.forEach(slot2 => {
        if (slot1.start_time === slot2.start_time) {
          overlappingSlots++;
        }
      });
    });
  }
  
  const scheduleScore = totalSlots > 0 ? (overlappingSlots / totalSlots) * 100 : 50;
  totalScore += scheduleScore * weights.schedule;

  // Faculty diversity (20%)
  const facultyScore = user1.faculty !== user2.faculty ? 100 : 60;
  totalScore += facultyScore * weights.faculty;

  // Work style compatibility (10%)
  const user1Profile = user1.user_profiles?.[0];
  const user2Profile = user2.user_profiles?.[0];
  
  let workStyleScore = 70; // Default neutral score
  if (user1Profile && user2Profile) {
    const workStyleMatch = user1Profile.work_style === user2Profile.work_style ? 100 : 50;
    const commMatch = user1Profile.communication_preference === user2Profile.communication_preference ? 100 : 70;
    workStyleScore = (workStyleMatch + commMatch) / 2;
  }
  
  totalScore += workStyleScore * weights.workStyle;

  return Math.round(Math.min(100, Math.max(0, totalScore)));
}

// GET /api/matching/recommendations - Get user recommendations
export async function GET(request) {
  try {
    const auth = await verifyAuth(request);
    if (!auth) {
      return NextResponse.json(
        { error: { code: 'unauthorized', description: 'Authentication required' } },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('project_id');
    const limit = parseInt(searchParams.get('limit')) || 20;
    const minCompatibility = parseInt(searchParams.get('min_compatibility')) || 60;

    // Get current user's profile
    const { data: currentUser, error: userError } = await supabase
      .from('users')
      .select(`
        id, faculty, year,
        user_skills (skill_id, level),
        user_availability (day_of_week, start_time, end_time),
        user_profiles (work_style, communication_preference, timezone)
      `)
      .eq('id', auth.userId)
      .single();

    if (userError || !currentUser) {
      return NextResponse.json(
        { error: { code: 'user_not_found', description: 'User profile not found' } },
        { status: 404 }
      );
    }

    // Get potential matches (exclude current user and existing team members)
    let excludeUserIds = [auth.userId];
    
    if (projectId) {
      // Get existing team members for this project
      const { data: teamMembers } = await supabase
        .from('team_members')
        .select('user_id')
        .eq('project_id', projectId);
      
      if (teamMembers) {
        excludeUserIds = [...excludeUserIds, ...teamMembers.map(tm => tm.user_id)];
      }
    }

    const { data: potentialMatches, error: matchesError } = await supabase
      .from('users')
      .select(`
        id, name, faculty, year, avatar_url, created_at,
        user_skills (skill_id, level),
        user_availability (day_of_week, start_time, end_time),
        user_profiles (bio, work_style, communication_preference, timezone)
      `)
      .not('id', 'in', (${excludeUserIds.join(',')}))
      .limit(50); // Get more than needed for filtering

    if (matchesError) {
      throw matchesError;
    }

    // Calculate compatibility scores
    const matchesWithScores = potentialMatches
      .map(user => ({
        ...user,
        compatibility: calculateCompatibilityScore(currentUser, user)
      }))
      .filter(user => user.compatibility >= minCompatibility)
      .sort((a, b) => b.compatibility - a.compatibility)
      .slice(0, limit);

    // If we have a specific project, also calculate project-specific compatibility
    if (projectId) {
      const { data: project } = await supabase
        .from('projects')
        .select(`
          id, title, type,
          project_skills (skill_id, required_level)
        `)
        .eq('id', projectId)
        .single();

      if (project) {
        matchesWithScores.forEach(user => {
          // Calculate project-specific skill match
          const userSkillIds = new Set(user.user_skills?.map(s => s.skill_id) || []);
          const requiredSkillIds = new Set(project.project_skills?.map(s => s.skill_id) || []);
          const matchingSkills = [...userSkillIds].filter(id => requiredSkillIds.has(id));
          
          const projectSkillMatch = requiredSkillIds.size > 0 
            ? (matchingSkills.length / requiredSkillIds.size) * 100 
            : 100;
          
          // Adjust compatibility based on project fit
          user.project_compatibility = Math.round((user.compatibility * 0.7) + (projectSkillMatch * 0.3));
        });
      }
    }

    return NextResponse.json({
      recommendations: matchesWithScores,
      total: matchesWithScores.length,
      filters: {
        project_id: projectId,
        min_compatibility: minCompatibility,
        limit
      }
    });

  } catch (error) {
    console.error('Get recommendations error:', error);
    return NextResponse.json(
      { error: { code: 'server_error', description: 'Internal server error' } },
      { status: 500 }
    );
  }
}
