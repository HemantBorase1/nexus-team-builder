-- Nexus Team Builder Database Schema
-- PostgreSQL with Supabase

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    faculty VARCHAR(100) NOT NULL,
    year INTEGER DEFAULT 1,
    avatar_url TEXT,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User profiles for extended information
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    bio TEXT,
    work_style VARCHAR(50) DEFAULT 'balanced', -- balanced, intensive, relaxed
    communication_preference VARCHAR(50) DEFAULT 'async', -- sync, async, mixed
    timezone VARCHAR(50) DEFAULT 'Australia/Sydney',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Skills catalog
CREATE TABLE skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    category VARCHAR(50) NOT NULL, -- frontend, backend, design, business, etc.
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User skills with proficiency levels
CREATE TABLE user_skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    skill_id UUID REFERENCES skills(id) ON DELETE CASCADE,
    level INTEGER CHECK (level >= 1 AND level <= 5), -- 1=beginner, 5=expert
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, skill_id)
);

-- User availability schedule
CREATE TABLE user_availability (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    day_of_week INTEGER CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0=Sunday
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, day_of_week, start_time)
);

-- Projects
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    type VARCHAR(100) NOT NULL, -- web_app, mobile_app, platform, etc.
    status VARCHAR(50) DEFAULT 'recruiting', -- recruiting, active, completed, cancelled
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    max_team_size INTEGER DEFAULT 5 CHECK (max_team_size >= 2 AND max_team_size <= 10),
    current_team_size INTEGER DEFAULT 1,
    deadline TIMESTAMP WITH TIME ZONE,
    owner_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Project required skills
CREATE TABLE project_skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    skill_id UUID REFERENCES skills(id) ON DELETE CASCADE,
    required_level INTEGER CHECK (required_level >= 1 AND required_level <= 5),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(project_id, skill_id)
);

-- Teams
CREATE TABLE teams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    member_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Team members
CREATE TABLE team_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(50) DEFAULT 'member', -- owner, member, contributor
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(team_id, user_id)
);

-- Team invitations
CREATE TABLE team_invitations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    invited_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    invited_by_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    message TEXT,
    status VARCHAR(50) DEFAULT 'pending', -- pending, accepted, declined, expired
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    responded_at TIMESTAMP WITH TIME ZONE
);

-- Notifications
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- team_invitation, project_update, match_found
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    data JSONB, -- Additional structured data
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User connections/matches
CREATE TABLE user_connections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user1_id UUID REFERENCES users(id) ON DELETE CASCADE,
    user2_id UUID REFERENCES users(id) ON DELETE CASCADE,
    compatibility_score INTEGER CHECK (compatibility_score >= 0 AND compatibility_score <= 100),
    status VARCHAR(50) DEFAULT 'matched', -- matched, connected, blocked
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user1_id, user2_id),
    CHECK (user1_id != user2_id)
);

-- Indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_faculty ON users(faculty);
CREATE INDEX idx_user_skills_user_id ON user_skills(user_id);
CREATE INDEX idx_user_skills_skill_id ON user_skills(skill_id);
CREATE INDEX idx_user_availability_user_id ON user_availability(user_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_type ON projects(type);
CREATE INDEX idx_projects_owner_id ON projects(owner_id);
CREATE INDEX idx_team_members_team_id ON team_members(team_id);
CREATE INDEX idx_team_members_user_id ON team_members(user_id);
CREATE INDEX idx_team_invitations_invited_user_id ON team_invitations(invited_user_id);
CREATE INDEX idx_team_invitations_status ON team_invitations(status);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(read);

-- Functions for compatibility calculation
CREATE OR REPLACE FUNCTION calculate_compatibility(user1_id UUID, user2_id UUID)
RETURNS INTEGER AS $$
DECLARE
    skills_score INTEGER := 0;
    schedule_score INTEGER := 0;
    faculty_score INTEGER := 0;
    work_style_score INTEGER := 0;
    total_score INTEGER := 0;
    user1_faculty VARCHAR(100);
    user2_faculty VARCHAR(100);
    user1_work_style VARCHAR(50);
    user2_work_style VARCHAR(50);
BEGIN
    -- Get user faculties
    SELECT faculty INTO user1_faculty FROM users WHERE id = user1_id;
    SELECT faculty INTO user2_faculty FROM users WHERE id = user2_id;
    
    -- Get work styles
    SELECT COALESCE(up.work_style, 'balanced') INTO user1_work_style 
    FROM user_profiles up WHERE up.user_id = user1_id;
    SELECT COALESCE(up.work_style, 'balanced') INTO user2_work_style 
    FROM user_profiles up WHERE up.user_id = user2_id;
    
    -- Calculate skills compatibility (40% weight)
    WITH skill_overlap AS (
        SELECT COUNT(*) as common_skills,
               (SELECT COUNT(DISTINCT skill_id) FROM user_skills 
                WHERE user_id IN (user1_id, user2_id)) as total_unique_skills
        FROM user_skills us1
        INNER JOIN user_skills us2 ON us1.skill_id = us2.skill_id
        WHERE us1.user_id = user1_id AND us2.user_id = user2_id
    )
    SELECT CASE 
        WHEN total_unique_skills > 0 THEN (common_skills * 100 / total_unique_skills)
        ELSE 0 
    END INTO skills_score
    FROM skill_overlap;
    
    -- Schedule compatibility (30% weight) - simplified
    schedule_score := 75; -- Default moderate compatibility
    
    -- Faculty diversity bonus (20% weight)
    faculty_score := CASE 
        WHEN user1_faculty != user2_faculty THEN 100
        ELSE 60
    END;
    
    -- Work style compatibility (10% weight)
    work_style_score := CASE 
        WHEN user1_work_style = user2_work_style THEN 100
        ELSE 70
    END;
    
    -- Calculate weighted total
    total_score := ROUND(
        (skills_score * 0.4) + 
        (schedule_score * 0.3) + 
        (faculty_score * 0.2) + 
        (work_style_score * 0.1)
    );
    
    RETURN LEAST(100, GREATEST(0, total_score));
END;
$$ LANGUAGE plpgsql;

-- Function for project compatibility
CREATE OR REPLACE FUNCTION calculate_project_compatibility(user_id UUID, project_id UUID)
RETURNS INTEGER AS $$
DECLARE
    skill_match_score INTEGER := 0;
    base_compatibility INTEGER := 70;
BEGIN
    -- Calculate how well user's skills match project requirements
    WITH project_skill_match AS (
        SELECT 
            COUNT(ps.skill_id) as required_skills,
            COUNT(us.skill_id) as matching_skills
        FROM project_skills ps
        LEFT JOIN user_skills us ON ps.skill_id = us.skill_id AND us.user_id = user_id
        WHERE ps.project_id = project_id
    )
    SELECT CASE 
        WHEN required_skills > 0 THEN (matching_skills * 100 / required_skills)
        ELSE 100 
    END INTO skill_match_score
    FROM project_skill_match;
    
    -- Combine base compatibility with skill match
    RETURN ROUND((base_compatibility * 0.6) + (skill_match_score * 0.4));
END;
$$ LANGUAGE plpgsql;

-- Triggers for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_teams_updated_at BEFORE UPDATE ON teams
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Sample data for development
INSERT INTO skills (name, category, description) VALUES
('React', 'Frontend', 'JavaScript library for building user interfaces'),
('Node.js', 'Backend', 'JavaScript runtime for server-side development'),
('Python', 'Backend', 'High-level programming language'),
('UI/UX Design', 'Design', 'User interface and experience design'),
('Project Management', 'Business', 'Planning and managing projects'),
('Machine Learning', 'AI/ML', 'Artificial intelligence and machine learning'),
('PostgreSQL', 'Backend', 'Relational database management system'),
('Figma', 'Design', 'Collaborative design tool'),
('TypeScript', 'Frontend', 'Typed superset of JavaScript'),
('Docker', 'DevOps', 'Containerization platform');

-- Row Level Security (RLS) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Users can read their own data and public profiles of others
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

-- Public read access for user profiles (for matching)
CREATE POLICY "Public profiles viewable" ON users
    FOR SELECT USING (true);

-- Similar policies for other tables...
-- (Additional RLS policies would be added for production security)
