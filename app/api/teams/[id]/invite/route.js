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

// POST /api/teams/[id]/invite - Send team invitation
export async function POST(request, { params }) {
  try {
    const { id: teamId } = params;
    const auth = await verifyAuth(request);

    if (!auth) {
      return NextResponse.json(
        { error: { code: 'unauthorized', description: 'Authentication required' } },
        { status: 401 }
      );
    }

    const { user_id, message } = await request.json();

    if (!user_id) {
      return NextResponse.json(
        { error: { code: 'missing_user_id', description: 'User ID is required' } },
        { status: 400 }
      );
    }

    // Get team and project details
    const { data: team, error: teamError } = await supabase
      .from('teams')
      .select(`
        id, name, member_count, project_id,
        projects (
          id, title, owner_id, max_team_size, current_team_size
        ),
        team_members!inner (
          user_id, role
        )
      `)
      .eq('id', teamId)
      .single();

    if (teamError || !team) {
      return NextResponse.json(
        { error: { code: 'team_not_found', description: 'Team not found' } },
        { status: 404 }
      );
    }

    // Check if user has permission to invite (team member or project owner)
    const isTeamMember = team.team_members.some(member => member.user_id === auth.userId);
    const isProjectOwner = team.projects.owner_id === auth.userId;

    if (!isTeamMember && !isProjectOwner) {
      return NextResponse.json(
        { error: { code: 'forbidden', description: 'Only team members can send invitations' } },
        { status: 403 }
      );
    }

    // Check if team is full
    if (team.projects.current_team_size >= team.projects.max_team_size) {
      return NextResponse.json(
        { error: { code: 'team_full', description: 'Team is already at maximum capacity' } },
        { status: 400 }
      );
    }

    // Check if user is already a team member
    const { data: existingMember } = await supabase
      .from('team_members')
      .select('id')
      .eq('team_id', teamId)
      .eq('user_id', user_id)
      .single();

    if (existingMember) {
      return NextResponse.json(
        { error: { code: 'already_member', description: 'User is already a team member' } },
        { status: 400 }
      );
    }

    // Check if invitation already exists
    const { data: existingInvite } = await supabase
      .from('team_invitations')
      .select('id, status')
      .eq('team_id', teamId)
      .eq('invited_user_id', user_id)
      .eq('status', 'pending')
      .single();

    if (existingInvite) {
      return NextResponse.json(
        { error: { code: 'invitation_exists', description: 'Invitation already sent' } },
        { status: 400 }
      );
    }

    // Get invited user details
    const { data: invitedUser } = await supabase
      .from('users')
      .select('id, name, email')
      .eq('id', user_id)
      .single();

    if (!invitedUser) {
      return NextResponse.json(
        { error: { code: 'user_not_found', description: 'Invited user not found' } },
        { status: 404 }
      );
    }

    // Create invitation
    const { data: invitation, error: inviteError } = await supabase
      .from('team_invitations')
      .insert({
        team_id: teamId,
        project_id: team.project_id,
        invited_user_id: user_id,
        invited_by_user_id: auth.userId,
        message: message || null,
        status: 'pending',
        created_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days
      })
      .select(`
        id, message, status, created_at, expires_at,
        users!team_invitations_invited_by_user_id_fkey (
          id, name, avatar_url
        )
      `)
      .single();

    if (inviteError) {
      throw inviteError;
    }

    // Create notification for invited user
    await supabase
      .from('notifications')
      .insert({
        user_id: user_id,
        type: 'team_invitation',
        title: 'Team Invitation',
        message: `You've been invited to join "${team.name}" for project "${team.projects.title}"`,
        data: {
          invitation_id: invitation.id,
          team_id: teamId,
          project_id: team.project_id,
          invited_by: auth.userId
        },
        created_at: new Date().toISOString()
      });

    // TODO: Send email notification in production
    // await sendInvitationEmail(invitedUser.email, team, invitation);

    return NextResponse.json({
      invitation: {
        ...invitation,
        team: {
          id: team.id,
          name: team.name,
          project_title: team.projects.title
        },
        invited_user: {
          id: invitedUser.id,
          name: invitedUser.name
        }
      },
      message: 'Invitation sent successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Send invitation error:', error);
    return NextResponse.json(
      { error: { code: 'server_error', description: 'Internal server error' } },
      { status: 500 }
    );
  }
}

// GET /api/teams/[id]/invite - Get team invitations
export async function GET(request, { params }) {
  try {
    const { id: teamId } = params;
    const auth = await verifyAuth(request);

    if (!auth) {
      return NextResponse.json(
        { error: { code: 'unauthorized', description: 'Authentication required' } },
        { status: 401 }
      );
    }

    // Check if user has permission to view invitations
    const { data: teamMember } = await supabase
      .from('team_members')
      .select('role')
      .eq('team_id', teamId)
      .eq('user_id', auth.userId)
      .single();

    if (!teamMember) {
      return NextResponse.json(
        { error: { code: 'forbidden', description: 'Only team members can view invitations' } },
        { status: 403 }
      );
    }

    const { data: invitations, error } = await supabase
      .from('team_invitations')
      .select(`
        id, message, status, created_at, expires_at,
        users!team_invitations_invited_user_id_fkey (
          id, name, avatar_url, faculty
        ),
        users!team_invitations_invited_by_user_id_fkey (
          id, name, avatar_url
        )
      `)
      .eq('team_id', teamId)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json({
      invitations: invitations || []
    });

  } catch (error) {
    console.error('Get invitations error:', error);
    return NextResponse.json(
      { error: { code: 'server_error', description: 'Internal server error' } },
      { status: 500 }
    );
  }
}
