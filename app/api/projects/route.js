
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

// GET /api/projects - Get projects with filtering
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
    const status = searchParams.get('status');
    const type = searchParams.get('type');
    const faculty = searchParams.get('faculty');
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit')) || 20;
    const offset = parseInt(searchParams.get('offset')) || 0;

    let query = supabase
      .from('projects')
      .select(`
        id, title, description, type, status, progress, 
        max_team_size, current_team_size, deadline,
        created_at, updated_at,
        users!projects_owner_id_fkey (
          id, name, faculty, avatar_url
        ),
        project_skills (
          skill_id, required_level,
          skills (name, category)
        ),
        teams (
          id, name, member_count,
          team_members (
            user_id,
            users (name, avatar_url, faculty)
          )
        )
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // Apply filters
    if (status) {
      query = query.eq('status', status);
    }
    if (type) {
      query = query.eq('type', type);
    }
    if (search) {
      query = query.or(title.ilike.%${search}%,description.ilike.%${search}%);
    }

    const { data: projects, error } = await query;

    if (error) {
      throw error;
    }

    // Calculate compatibility scores for each project
    const projectsWithCompatibility = await Promise.all(
      projects.map(async (project) => {
        const { data: compatibility } = await supabase
          .rpc('calculate_project_compatibility', {
            user_id: auth.userId,
            project_id: project.id
          });

        return {
          ...project,
          compatibility: compatibility || 0
        };
      })
    );

    return NextResponse.json({
      projects: projectsWithCompatibility,
      pagination: {
        limit,
        offset,
        total: projectsWithCompatibility.length
      }
    });

  } catch (error) {
    console.error('Get projects error:', error);
    return NextResponse.json(
      { error: { code: 'server_error', description: 'Internal server error' } },
      { status: 500 }
    );
  }
}

// POST /api/projects - Create new project
export async function POST(request) {
  try {
    const auth = await verifyAuth(request);
    if (!auth) {
      return NextResponse.json(
        { error: { code: 'unauthorized', description: 'Authentication required' } },
        { status: 401 }
      );
    }

    const projectData = await request.json();
    const {
      title,
      description,
      type,
      max_team_size,
      deadline,
      required_skills,
      preferred_faculties
    } = projectData;

    // Validation
    if (!title || !description || !type) {
      return NextResponse.json(
        { error: { code: 'missing_fields', description: 'Title, description, and type are required' } },
        { status: 400 }
      );
    }

    if (max_team_size && (max_team_size < 2 || max_team_size > 10)) {
      return NextResponse.json(
        { error: { code: 'invalid_team_size', description: 'Team size must be between 2 and 10' } },
        { status: 400 }
      );
    }

    // Create project
    const { data: newProject, error: projectError } = await supabase
      .from('projects')
      .insert({
        title: title.trim(),
        description: description.trim(),
        type,
        status: 'recruiting',
        progress: 0,
        max_team_size: max_team_size || 5,
        current_team_size: 1, // Owner is first member
        deadline: deadline || null,
        owner_id: auth.userId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select(`
        id, title, description, type, status, progress,
        max_team_size, current_team_size, deadline,
        created_at, updated_at,
        users!projects_owner_id_fkey (
          id, name, faculty, avatar_url
        )
      `)
      .single();

    if (projectError) {
      throw projectError;
    }

    // Add required skills if provided
    if (required_skills && Array.isArray(required_skills)) {
      const skillsToInsert = required_skills.map(skill => ({
        project_id: newProject.id,
        skill_id: skill.skill_id,
        required_level: skill.required_level || 3,
        created_at: new Date().toISOString()
      }));

      await supabase
        .from('project_skills')
        .insert(skillsToInsert);
    }

    // Create initial team with owner
    const { data: newTeam } = await supabase
      .from('teams')
      .insert({
        project_id: newProject.id,
        name: ${newProject.title} Team,
        member_count: 1,
        created_at: new Date().toISOString()
      })
      .select('id')
      .single();

    // Add owner as team member
    await supabase
      .from('team_members')
      .insert({
        team_id: newTeam.id,
        user_id: auth.userId,
        role: 'owner',
        joined_at: new Date().toISOString()
      });

    return NextResponse.json({
      project: newProject,
      team_id: newTeam.id,
      message: 'Project created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Create project error:', error);
    return NextResponse.json(
      { error: { code: 'server_error', description: 'Internal server error' } },
      { status: 500 }
    );
  }
}
