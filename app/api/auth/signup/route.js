import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(request) {
  try {
    const { email, password, full_name, faculty, year } = await request.json();

    // Validation
    if (!email || !password || !full_name || !faculty) {
      return NextResponse.json(
        { error: { code: 'missing_fields', description: 'All fields are required' } },
        { status: 400 }
      );
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: { code: 'invalid_email', description: 'Invalid email format' } },
        { status: 400 }
      );
    }

    // Password strength validation
    if (password.length < 8) {
      return NextResponse.json(
        { error: { code: 'weak_password', description: 'Password must be at least 8 characters' } },
        { status: 400 }
      );
    }

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email.toLowerCase())
      .single();

    if (existingUser) {
      return NextResponse.json(
        { error: { code: 'user_exists', description: 'Email already registered' } },
        { status: 409 }
      );
    }

    // Hash password
    const saltRounds = 12;
    const password_hash = await bcrypt.hash(password, saltRounds);

    // Create user
    const { data: newUser, error: createError } = await supabase
      .from('users')
      .insert({
        email: email.toLowerCase(),
        password_hash,
        name: full_name,
        faculty,
        year: year || 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select('id, email, name, faculty, year, created_at')
      .single();

    if (createError) {
      console.error('User creation error:', createError);
      return NextResponse.json(
        { error: { code: 'creation_failed', description: 'Failed to create user account' } },
        { status: 500 }
      );
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: newUser.id, 
        email: newUser.email,
        exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
      },
      process.env.JWT_SECRET
    );

    // Create default user profile
    await supabase
      .from('user_profiles')
      .insert({
        user_id: newUser.id,
        bio: '',
        work_style: 'balanced',
        communication_preference: 'async',
        created_at: new Date().toISOString()
      });

    return NextResponse.json({
      user: newUser,
      token,
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      message: 'Account created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: { code: 'server_error', description: 'Internal server error' } },
      { status: 500 }
    );
  }
}
