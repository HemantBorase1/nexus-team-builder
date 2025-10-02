import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import jwt from 'jsonwebtoken';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Middleware to verify JWT token
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

// GET /api/users/[id] - Get user profile
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

    // Get user with profile, skills, and availability
    const { data: user, error: userError } = await supabase
      .from('users')
      .select(`
        id, email, name, faculty, year, avatar_url, created_at,
        user_profiles (
          bio, work_style, communication_preference, timezone
        ),
        user_skills (
          skill_id, level,
          skills (name, category)
        ),
        user_availability (
          day_of_week, start_time, end_time
        )
      `)
      .eq('id', id)
      .single();

    if (userError || !user) {
      return NextResponse.json(
        { error: { code: 'user_not_found', description: 'User not found' } },
        { status: 404 }
      );
    }

    // Calculate compatibility score if requesting different user
    let compatibility = null;
    if (auth.userId !== id) {
      const { data: compatibilityData } = await supabase
        .rpc('calculate_compatibility', {
          user1_id: auth.userId,
          user2_id: id
        });
      compatibility = compatibilityData || 0;
    }

    return NextResponse.json({
      ...user,
      compatibility
    });

  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { error: { code: 'server_error', description: 'Internal server error' } },
      { status: 500 }
    );
  }
}

// PUT /api/users/[id] - Update user profile
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const auth = await verifyAuth(request);

    if (!auth || auth.userId !== id) {
      return NextResponse.json(
        { error: { code: 'forbidden', description: 'Cannot update other users' } },
        { status: 403 }
      );
    }

    const updateData = await request.json();
    const { name, faculty, year, bio, work_style, communication_preference, timezone } = updateData;

    // Update user basic info
    const userUpdates = {};
    if (name) userUpdates.name = name;
    if (faculty) userUpdates.faculty = faculty;
    if (year) userUpdates.year = year;
    userUpdates.updated_at = new Date().toISOString();

    if (Object.keys(userUpdates).length > 1) {
      await supabase
        .from('users')
        .update(userUpdates)
        .eq('id', id);
    }

    // Update profile info
    const profileUpdates = {};
    if (bio !== undefined) profileUpdates.bio = bio;
    if (work_style) profileUpdates.work_style = work_style;
    if (communication_preference) profileUpdates.communication_preference = communication_preference;
    if (timezone) profileUpdates.timezone = timezone;

    if (Object.keys(profileUpdates).length > 0) {
      profileUpdates.updated_at = new Date().toISOString();
      
      await supabase
        .from('user_profiles')
        .upsert({
          user_id: id,
          ...profileUpdates
        });
    }

    // Get updated user data
    const { data: updatedUser } = await supabase
      .from('users')
      .select(`
        id, email, name, faculty, year, avatar_url, updated_at,
        user_profiles (bio, work_style, communication_preference, timezone)
      `)
      .eq('id', id)
      .single();

    return NextResponse.json({
      user: updatedUser,
      message: 'Profile updated successfully'
    });

  } catch (error) {
    console.error('Update user error:', error);
    return NextResponse.json(
      { error: { code: 'server_error', description: 'Internal server error' } },
      { status: 500 }
    );
  }
}
