-- 创建 project 应用(项目)表
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name varchar(255) NOT NULL,
    description TEXT,
    team_id UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by TEXT
);

-- 修改 prompts 表，添加 project_id 字段
ALTER TABLE prompts 
ADD COLUMN project_id UUID REFERENCES projects(id) ON DELETE CASCADE;

-- 为了性能优化，添加索引
CREATE INDEX idx_prompts_project_id ON prompts(project_id);
CREATE INDEX idx_projects_user_id ON projects(user_id);