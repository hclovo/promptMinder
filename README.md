# PromptMinder

一个专业的提示词的管理平台，让AI提示词管理更简单

[![Deployed on Zeabur](https://zeabur.com/deployed-on-zeabur-dark.svg)](https://zeabur.com/referral?referralCode=aircrushin&utm_source=aircrushin&utm_campaign=oss)

![主页](/public/main-page.png)

## 特性

- 支持提示词版本管理，版本回溯
- 完全开源，可以自行部署和修改
- 提示词标签化、版本化管理
- 支持自定义标签
- 移动端适配
- AI 提示词生成

## 技术栈

- Next.js 14
- Tailwind CSS
- Shadcn UI
- OpenAI
- 数据库：Supabase + PostgreSQL
- 用户认证：Clerk
- 部署：Vercel/Zeabur
- 用户反馈：Canny

## 部署流程

### vercel

1. fork本项目
2. 注册并登录vercel
3. 点击`New Project`
4. 选择`Import Git Repository`
5. 输入项目名称，选择`GitHub`作为代码来源
6. 点击`Deploy`

#### 环境变量说明

- `SUPABASE_URL`：Supabase 项目 URL
- `SUPABASE_ANON_KEY`：Supabase 匿名密钥
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`：Clerk 公钥，用于客户端认证
- `CLERK_SECRET_KEY`：Clerk 私钥，用于服务端认证
- `NEXT_PUBLIC_CLERK_SIGN_IN_URL`：Clerk 登录页面 URL
- `NEXT_PUBLIC_CLERK_SIGN_UP_URL`：Clerk 注册页面 URL
- `AUTH_SECRET`：用于 NextAuth.js 的加密密钥
- `ZHIPU_API_KEY`：智谱AI API 密钥，用于提示词生成 (任何 OpenAI 兼容类模型都可以)
- `GITHUB_ID`：GitHub OAuth 应用的客户端 ID（可选，用于 GitHub 登录）
- `GITHUB_SECRET`：GitHub OAuth 应用的客户端密钥（可选，用于 GitHub 登录）

### supabase

1. 注册supabase账号并创建项目
2. 进入项目设置，点击`Service Role`，点击`Generate new key`，复制key
3. 将key填入vercel的环境变量中
4. 进入项目设置，点击`Database`，点击`Create new database`，创建数据库
5. 创建数据表

    ```sql
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

    -- 创建 tags 表
    CREATE TABLE tags (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        user_id TEXT,  -- 使用TEXT类型来匹配Clerk的user_id
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(name, user_id)
    );
    ```

### clerk

clerk 是一个用户认证平台，可以用来管理用户认证和权限。
配置参考官方文档
https://clerk.com/docs

### canny

Canny 是一个用户反馈平台，可以用来收集用户反馈和建议。

1. 注册 Canny 账号并创建项目
2. 将 Canny URL 填入 footer 页面中
