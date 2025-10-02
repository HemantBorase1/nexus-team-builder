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

// GET /api/projects/[id] - Get project details
export async function GET(request, { params }) {
  try {
    const { id } = params;
    const auth = await verifyAuth(request);

    if (!auth) {
      return NextResponse.json(
        { error: { code: 'unauthorized', description: 'Authentication required' } },
        { status: 401 }
      );
    }

    const { data: project, error } = await supabase
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
          skills (id, name, category, description)
        ),
        teams (
          id, name, member_count,
          team_members (
            user_id, role, joined_at,
            users (id, name, avatar_url, faculty)
          )
        )
      `)
      .eq('id', id)
      .single();

    if (error || !project) {
      return NextResponse.json(
        { error: { code: 'project_not_found', description: 'Project not found' } },
        { status: 404 }
      );
    }

    // Calculate user's compatibility with this project
    const { data: compatibility } = await supabase
      .rpc('calculate_project_compatibility', {
        user_id: auth.userId,
        project_id: id
      });

    // Check if user is already part of this project
    const isTeamMember = project.teams?.[0]?.team_members?.some(
      member => member.user_id === auth.userId
    );

    return NextResponse.json({
      ...project,
      compatibility: compatibility || 0,
      is_team_member: isTeamMember || false,
      can_edit: project.users.id === auth.userId
    });

  } catch (error) {
    console.error('Get project error:', error);
    return NextResponse.json(
      { error: { code: 'server_error', description: 'Internal server error' } },
      { status: 500 }
    );
  }
}

// PUT /api/projects/[id] - Update project
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const auth = await verifyAuth(request);

    if (!auth) {
      return NextResponse.json(
        { error: { code: 'unauthorized', description: 'Authentication required' } },
        { status: 401 }
      );
    }

    // Check if user owns the project
    const { data: project } = await supabase
      .from('projects')
      .select('owner_id')
      .eq('id', id)
      .single();

    if (!project || project.owner_id !== auth.userId) {
      return NextResponse.json(
        { error: { code: 'forbidden', description: 'Only project owner can update' } },
        { status: 403 }
      );
    }

    const updateData = await request.json();
    const { title, description, type, status, progress, max_team_size, deadline } = updateData;

    // Build update object
    const updates = { updated_at: new Date().toISOString() };
    if (title) updates.title = title.trim();
    if (description) updates.description = description.trim();
    if (type) updates.type = type;
    if (status) updates.status = status;
    if (progress !== undefined) updates.progress = Math.max(0, Math.min(100, progress));
    if (max_team_size) updates.max_team_size = Math.max(2, Math.min(10, max_team_size));
    if (deadline !== undefined) updates.deadline = deadline;

    const { data: updatedProject, error: updateError } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', id)
      .select(`
        id, title, description, type, status, progress,
        max_team_size, current_team_size, deadline,
        created_at, updated_at,
        users!projects_owner_id_fkey (
          id, name, faculty, avatar_url
        )
      `)
      .single();

    if (updateError) {
      throw updateError;
    }

    return NextResponse.json({
      project: updatedProject,
      message: 'Project updated successfully'
    });

  } catch (error) {
    console.error('Update project error:', error);
    return NextResponse.json(
      { error: { code: 'server_error', description: 'Internal server error' } },
      { status: 500 }
    );
  }
}

// DELETE /api/projects/[id] - Delete project
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const auth = await verifyAuth(request);

    if (!auth) {
      return NextResponse.json(
        { error: { code: 'unauthorized', description: 'Authentication required' } },
        { status: 401 }
      );
    }

    // Check if user owns the project
    const { data: project } = await supabase
      .from('projects')
      .select('owner_id, status')
      .eq('id', id)
      .single();

    if (!project || project.owner_id !== auth.userId) {
      return NextResponse.json(
        { error: { code: 'forbidden', description: 'Only project owner can delete' } },
        { status: 403 }
      );
    }

    // Prevent deletion of active projects with team members
    if (project.status === 'active') {
      const { data: teamMembers } = await supabase
        .from('team_members')
        .select('id')
        .eq('project_id', id);

      if (teamMembers && teamMembers.length > 1) {
        return NextResponse.json(
          { error: { code: 'active_project', description: 'Cannot delete active project with team members' } },
          { status: 400 }
        );
      }
    }

    // Delete project (cascade will handle related records)
    const { error: deleteError } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);

    if (deleteError) {
      throw deleteError;
    }

    return NextResponse.json({
      message: 'Project deleted successfully'
    });

  } catch (error) {
    console.error('Delete project error:', error);
    return NextResponse.json(
      { error: { code: 'server_error', description: 'Internal server error' } },
      { status: 500 }
    );
  }
}
