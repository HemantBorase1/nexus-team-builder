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

// GET /api/users/[id]/skills - Get user skills
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

    const { data: userSkills, error } = await supabase
      .from('user_skills')
      .select(`
        skill_id, level, created_at,
        skills (
          id, name, category, description
        )
      `)
      .eq('user_id', id)
      .order('level', { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json({
      skills: userSkills || []
    });

  } catch (error) {
    console.error('Get user skills error:', error);
    return NextResponse.json(
      { error: { code: 'server_error', description: 'Internal server error' } },
      { status: 500 }
    );
  }
}

// POST /api/users/[id]/skills - Add/Update user skills
export async function POST(request, { params }) {
  try {
    const { id } = params;
    const auth = await verifyAuth(request);

    if (!auth || auth.userId !== id) {
      return NextResponse.json(
        { error: { code: 'forbidden', description: 'Cannot update other users skills' } },
        { status: 403 }
      );
    }

    const { skills } = await request.json();

    if (!Array.isArray(skills)) {
      return NextResponse.json(
        { error: { code: 'invalid_data', description: 'Skills must be an array' } },
        { status: 400 }
      );
    }

    // Validate skill data
    for (const skill of skills) {
      if (!skill.skill_id || !skill.level || skill.level < 1 || skill.level > 5) {
        return NextResponse.json(
          { error: { code: 'invalid_skill', description: 'Each skill must have skill_id and level (1-5)' } },
          { status: 400 }
        );
      }
    }

    // Delete existing skills
    await supabase
      .from('user_skills')
      .delete()
      .eq('user_id', id);

    // Insert new skills
    const skillsToInsert = skills.map(skill => ({
      user_id: id,
      skill_id: skill.skill_id,
      level: skill.level,
      created_at: new Date().toISOString()
    }));

    const { data: insertedSkills, error: insertError } = await supabase
      .from('user_skills')
      .insert(skillsToInsert)
      .select(`
        skill_id, level, created_at,
        skills (
          id, name, category, description
        )
      `);

    if (insertError) {
      throw insertError;
    }

    // Update user's updated_at timestamp
    await supabase
      .from('users')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', id);

    return NextResponse.json({
      skills: insertedSkills,
      message: 'Skills updated successfully'
    });

  } catch (error) {
    console.error('Update user skills error:', error);
    return NextResponse.json(
      { error: { code: 'server_error', description: 'Internal server error' } },
      { status: 500 }
    );
  }
}
