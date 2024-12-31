-- 创建团队表
CREATE TABLE teams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by TEXT NOT NULL,  -- 团队创建者/管理员
    avatar_url TEXT,
    is_personal BOOLEAN DEFAULT false  -- 是否为个人团队
);

-- 团队成员关系表
CREATE TABLE team_user_relation (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID NOT NULL,
    user_id TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('owner', 'admin', 'member')),  -- 成员角色
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by TEXT,
    UNIQUE(team_id, user_id)
);

-- 修改 projects 表，添加 team_id
ALTER TABLE projects
ADD COLUMN team_id UUID REFERENCES teams(id) ON DELETE CASCADE;

-- 修改 prompts 表，添加 team_id
ALTER TABLE prompts
ADD COLUMN team_id UUID REFERENCES teams(id) ON DELETE CASCADE;

-- 修改 tags 表，添加 team_id
ALTER TABLE tags
ADD COLUMN team_id UUID REFERENCES teams(id) ON DELETE CASCADE;

-- 添加索引优化查询性能
CREATE INDEX idx_team_members_team_id ON team_members(team_id);
CREATE INDEX idx_team_members_user_id ON team_members(user_id);
CREATE INDEX idx_projects_team_id ON projects(team_id);
CREATE INDEX idx_prompts_team_id ON prompts(team_id);
CREATE INDEX idx_tags_team_id ON tags(team_id);