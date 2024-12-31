    -- 创建 prompts 表
    CREATE TABLE prompts (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        description TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        is_public BOOLEAN DEFAULT false,
        user_id TEXT,
        version TEXT,
        tags TEXT,
        cover_img TEXT
    );