
# Docker 本地部署指南

本文档详细说明如何使用 Docker 在本地部署 PromptMinder 项目。

## 📋 目录

- [前置要求](#前置要求)
- [项目概述](#项目概述)
- [部署方式](#部署方式)
  - [方式一：使用 Docker Compose（推荐）](#方式一使用-docker-compose推荐)
  - [方式二：单独构建和运行](#方式二单独构建和运行)
  - [方式三：使用现有数据库](#方式三使用现有数据库)
- [环境变量配置](#环境变量配置)
- [数据库管理](#数据库管理)
- [常见问题排查](#常见问题排查)
- [性能优化](#性能优化)

## 🔧 前置要求

在开始之前，请确保您的系统已安装以下软件：

- **Docker**: 版本 20.10 或更高
- **Docker Compose**: 版本 2.0 或更高
- **Git**: 用于克隆项目代码

### 验证安装

```bash
# 检查 Docker 版本
docker --version

# 检查 Docker Compose 版本
docker compose version

# 验证 Docker 服务状态
docker info
```

## 📖 项目概述

PromptMinder 是一个基于 Next.js 的提示词管理应用，主要特性：

- **前端**: Next.js 15 + React 18
- **数据库**: PostgreSQL
- **ORM**: Drizzle ORM
- **样式**: Tailwind CSS
- **包管理**: pnpm

## 🚀 部署方式

### 方式一：使用 Docker Compose（推荐）

这是最简单的部署方式，会自动创建数据库和应用容器。

#### 1. 创建 Docker Compose 配置

在项目根目录创建 `docker-compose.yml` 文件：

```yaml
version: '3.8'

services:
  # PostgreSQL 数据库
  postgres:
    image: postgres:15-alpine
    container_name: promptminder-db
    environment:
      POSTGRES_DB: promptminder
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: your_secure_password
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./sql:/docker-entrypoint-initdb.d
    ports:
      - "5432:5432"
    networks:
      - promptminder-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

  # PromptMinder 应用
  app:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: promptminder-app
    environment:
      - NODE_ENV=production
      - POSTGRES_URL=postgres://postgres:your_secure_password@postgres:5432/promptminder
      - API_PORT=3000
      - ENABLE_ANALYTICS=false
      # 如果使用 Clerk 认证，请添加以下环境变量
      # - NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_public_key
      # - CLERK_SECRET_KEY=your_clerk_secret_key
    ports:
      - "3000:3000"
    depends_on:
      postgres:
        condition: service_healthy
    networks:
      - promptminder-network
    restart: unless-stopped

volumes:
  postgres_data:

networks:
  promptminder-network:
    driver: bridge
```

#### 2. 创建环境变量文件

创建 `.env.local` 文件（可选，用于覆盖默认配置）：

```env
# 数据库配置
POSTGRES_URL=postgres://postgres:your_secure_password@postgres:5432/promptminder

# 应用配置
NODE_ENV=production
API_PORT=3000
ENABLE_ANALYTICS=false

# Clerk 认证（如果使用）
# NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_public_key
# CLERK_SECRET_KEY=your_clerk_secret_key
```

#### 3. 启动服务

```bash
# 启动所有服务
docker compose up -d

# 查看服务状态
docker compose ps

# 查看日志
docker compose logs -f app
```

#### 4. 初始化数据库

```bash
# 进入应用容器
docker compose exec app sh

# 运行数据库迁移
pnpm db:push

# 退出容器
exit
```

### 方式二：单独构建和运行

如果您已有 PostgreSQL 数据库或希望更精细地控制部署过程。

#### 1. 构建镜像

```bash
# 构建应用镜像
docker build -t promptminder:latest .

# 验证镜像创建成功
docker images | grep promptminder
```

#### 2. 运行容器

```bash
# 运行 PromptMinder 容器
docker run -d \
  --name promptminder-app \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -e POSTGRES_URL="postgres://username:password@host:5432/database" \
  -e API_PORT=3000 \
  -e ENABLE_ANALYTICS=false \
  --restart unless-stopped \
  promptminder:latest
```

### 方式三：使用现有数据库

如果您已有运行中的 PostgreSQL 数据库：

#### 1. 更新 Docker Compose 配置

移除 `postgres` 服务，只保留 `app` 服务：

```yaml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: promptminder-app
    environment:
      - NODE_ENV=production
      - POSTGRES_URL=postgres://username:password@your-db-host:5432/promptminder
      - API_PORT=3000
      - ENABLE_ANALYTICS=false
    ports:
      - "3000:3000"
    restart: unless-stopped
```

#### 2. 创建数据库和表

```sql
-- 连接到您的 PostgreSQL 数据库
CREATE DATABASE promptminder;

-- 使用项目中的 SQL 文件创建表结构
\i sql/prompts.sql
\i sql/tags.sql
```

## ⚙️ 环境变量配置

### 必需的环境变量

| 变量名           | 描述                  | 示例值                                |
| ---------------- | --------------------- | ------------------------------------- |
| `POSTGRES_URL` | PostgreSQL 连接字符串 | `postgres://user:pass@host:5432/db` |
| `NODE_ENV`     | 运行环境              | `production`                        |

### 可选的环境变量

| 变量名                                | 描述       | 默认值    |
| ------------------------------------- | ---------- | --------- |
| `API_PORT`                          | 应用端口   | `3000`  |
| `ENABLE_ANALYTICS`                  | 启用分析   | `false` |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk 公钥 | -         |
| `CLERK_SECRET_KEY`                  | Clerk 私钥 | -         |

### 环境变量配置方法

1. **通过 `.env.local` 文件**：

   ```bash
   cp .env.example .env.local
   # 编辑 .env.local 文件
   ```
2. **通过 Docker Compose 环境变量**：

   ```yaml
   environment:
     - POSTGRES_URL=postgres://...
   ```
3. **通过外部环境变量文件**：

   ```yaml
   env_file:
     - .env.production
   ```

## 🗄️ 数据库管理

### 数据库迁移

```bash
# 生成迁移文件
docker compose exec app pnpm db:generate

# 应用迁移
docker compose exec app pnpm db:push

# 查看数据库状态
docker compose exec app pnpm db:studio
```

### 数据备份和恢复

#### 备份数据

```bash
# 创建数据库备份
docker compose exec postgres pg_dump -U postgres promptminder > backup.sql

# 或者备份整个数据卷
docker run --rm -v promptminder_postgres_data:/data -v $(pwd):/backup alpine tar czf /backup/postgres_backup.tar.gz -C /data .
```

#### 恢复数据

```bash
# 从 SQL 文件恢复
docker compose exec -T postgres psql -U postgres promptminder < backup.sql

# 或者恢复数据卷
docker run --rm -v promptminder_postgres_data:/data -v $(pwd):/backup alpine tar xzf /backup/postgres_backup.tar.gz -C /data
```

### 数据库维护

```bash
# 连接到数据库
docker compose exec postgres psql -U postgres promptminder

# 查看表结构
\dt

# 查看数据统计
SELECT 
  schemaname,
  tablename,
  attname,
  n_distinct,
  correlation
FROM pg_stats
WHERE tablename IN ('prompts', 'tags');
```

## 🔍 常见问题排查

### 1. 容器启动失败

**问题**: 容器无法启动或立即退出

**排查步骤**:

```bash
# 查看容器日志
docker compose logs app

# 查看容器状态
docker compose ps

# 进入容器调试
docker compose exec app sh
```

**常见原因**:

- 环境变量配置错误
- 端口被占用
- 数据库连接失败

### 2. 数据库连接问题

**问题**: 应用无法连接到数据库

**解决方案**:

```bash
# 检查数据库是否运行
docker compose exec postgres pg_isready -U postgres

# 测试连接
docker compose exec postgres psql -U postgres -c "SELECT version();"

# 检查网络连接
docker compose exec app nslookup postgres
```

### 3. 端口冲突

**问题**: 端口 3000 已被占用

**解决方案**:

```bash
# 查看端口使用情况
lsof -i :3000

# 修改 docker-compose.yml 中的端口映射
ports:
  - "3001:3000"  # 将主机端口改为 3001
```

### 4. 权限问题

**问题**: 文件权限或数据库权限错误

**解决方案**:

```bash
# 修复文件权限
sudo chown -R $USER:$USER .

# 重置数据库权限
docker compose exec postgres psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE promptminder TO postgres;"
```

### 5. 内存不足

**问题**: 构建或运行时内存不足

**解决方案**:

```bash
# 清理无用的 Docker 资源
docker system prune -a

# 增加 Docker 内存限制
# 在 Docker Desktop 设置中调整内存分配
```

## ⚡ 性能优化

### 1. 构建优化

**使用多阶段构建**（已在 Dockerfile 中实现）:

- 构建阶段：安装依赖和构建应用
- 运行阶段：只包含必要的文件

**减少镜像大小**:

```dockerfile
# 使用 Alpine Linux
FROM node:18-alpine

# 清理缓存
RUN apk add --no-cache && \
    rm -rf /var/cache/apk/*
```

### 2. 运行时优化

**Docker Compose 优化**:

```yaml
services:
  app:
    # 限制资源使用
    deploy:
      resources:
        limits:
          cpus: '1.0'
          memory: 1G
        reservations:
          cpus: '0.5'
          memory: 512M
  
    # 健康检查
    healthcheck:
      test: ["CMD", "wget", "--spider", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
```

### 3. 数据库优化

**PostgreSQL 配置优化**:

```yaml
postgres:
  environment:
    POSTGRES_INITDB_ARGS: "--data-checksums --encoding=UTF8"
  command: >
    postgres
    -c shared_preload_libraries=pg_stat_statements
    -c max_connections=200
    -c shared_buffers=256MB
    -c effective_cache_size=1GB
    -c work_mem=4MB
```

### 4. 缓存优化

**Docker 构建缓存**:

```bash
# 使用构建缓存
docker compose build --parallel

# 清理构建缓存（如果需要）
docker builder prune
```

## 📝 维护和监控

### 日志管理

```bash
# 查看实时日志
docker compose logs -f

# 查看特定服务日志
docker compose logs -f app

# 限制日志输出
docker compose logs --tail=100 app
```

### 容器监控

```bash
# 查看资源使用情况
docker stats

# 查看容器详细信息
docker compose exec app top
```

### 定期维护

```bash
# 创建维护脚本
cat > maintenance.sh << 'EOF'
#!/bin/bash

# 备份数据库
docker compose exec postgres pg_dump -U postgres promptminder > "backup_$(date +%Y%m%d_%H%M%S).sql"

# 清理无用镜像
docker image prune -f

# 更新应用
docker compose pull
docker compose up -d

echo "维护完成"
EOF

chmod +x maintenance.sh
```

## 🔐 安全建议

1. **使用强密码**: 数据库密码应足够复杂
2. **环境变量安全**: 不要在代码中硬编码敏感信息
3. **网络隔离**: 使用 Docker 网络隔离服务
4. **定期更新**: 保持 Docker 镜像和依赖项的最新状态
5. **备份策略**: 制定定期备份计划

## 📞 获取帮助

如果遇到问题，请：

1. 查看此文档的常见问题排查部分
2. 检查 Docker 和应用日志
3. 确认环境变量配置正确
4. 验证数据库连接

---

**部署完成后，访问 http://localhost:3000 即可使用 PromptMinder 应用！**
