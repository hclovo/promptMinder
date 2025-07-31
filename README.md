# PromptMinder Docker 本地部署指南

PromptMinder 是一个基于 Next.js 和 PostgreSQL 的 Prompt 管理系统。本文档将指导您使用 Docker 在本地快速部署该应用。

## 📋 前置要求

- Docker 20.10.0+
- Docker Compose 2.0.0+
- 至少 2GB 可用内存

## 🚀 快速开始

### 方式一：使用 Docker Compose（推荐）

1. **克隆项目**

   ```bash
   git clone <your-repo-url>
   cd promptMinder
   ```
2. **创建环境变量文件**

   ```bash
   cp .env.example .env
   ```

   编辑 `.env` 文件，配置以下环境变量：

   ```env
   # 数据库配置
   POSTGRES_URL=postgres://postgres:your_password@localhost:5432/promptMinder

   # 应用配置
   NODE_ENV=production
   API_PORT=3000
   ENABLE_ANALYTICS=false

   # 数据库单独配置（可选）
   DB_HOST=postgres
   DB_PORT=5432
   DB_PASSWORD=your_password
   DB_NAME=promptMinder
   DB_USER=postgres
   ```
3. **创建 docker-compose.yml**

   ```yaml
   version: '3.8'

   services:
     postgres:
       image: postgres:15-alpine
       container_name: promptminder-db
       environment:
         POSTGRES_DB: promptMinder
         POSTGRES_USER: postgres
         POSTGRES_PASSWORD: your_password
       volumes:
         - postgres_data:/var/lib/postgresql/data
         - ./sql:/docker-entrypoint-initdb.d
       ports:
         - "5432:5432"
       networks:
         - promptminder-network

     app:
       build: .
       container_name: promptminder-app
       environment:
         POSTGRES_URL: postgres://postgres:your_password@postgres:5432/promptMinder
         NODE_ENV: production
         API_PORT: 3000
         ENABLE_ANALYTICS: false
       ports:
         - "3000:3000"
       depends_on:
         - postgres
       networks:
         - promptminder-network
       command: npm run start

   volumes:
     postgres_data:

   networks:
     promptminder-network:
       driver: bridge
   ```
4. **启动服务**

   ```bash
   docker-compose up -d
   ```
5. **初始化数据库**

   ```bash
   # 等待数据库启动完成后，运行数据库迁移
   docker-compose exec app npm run db:push
   ```
6. **访问应用**

   在浏览器中打开 `http://localhost:3000`

### 方式二：使用现有启动脚本

项目已提供 `start.sh` 脚本，您可以直接使用：

1. **修改启动脚本**

   编辑 `start.sh` 文件，更新数据库连接信息：

   ```bash
   docker build --no-cache -t promptminder:latest .

   docker run -d -p 3000:3000 \
       -e POSTGRES_URL=postgres://postgres:your_password@your_db_host:5432/promptMinder \
       -e NODE_ENV=production \
       --name promptminder \
       promptminder:latest \
       npm run start
   ```
2. **运行脚本**

   ```bash
   chmod +x start.sh
   ./start.sh
   ```

### 方式三：手动 Docker 构建

1. **构建镜像**

   ```bash
   docker build -t promptminder:latest .
   ```
2. **运行容器**

   ```bash
   docker run -d \
     --name promptminder \
     -p 3000:3000 \
     -e POSTGRES_URL=postgres://username:password@host:port/database \
     -e NODE_ENV=production \
     -e API_PORT=3000 \
     promptminder:latest
   ```

## 🔧 环境变量配置

| 变量名               | 必需 | 默认值      | 说明                        |
| -------------------- | ---- | ----------- | --------------------------- |
| `POSTGRES_URL`     | ✅   | -           | PostgreSQL 数据库连接字符串 |
| `NODE_ENV`         | ❌   | development | 运行环境                    |
| `API_PORT`         | ❌   | 3000        | 应用端口                    |
| `ENABLE_ANALYTICS` | ❌   | false       | 是否启用分析                |

## 🗄️ 数据库设置

### 本地 PostgreSQL

如果您有本地 PostgreSQL 实例：

```bash
# 创建数据库
createdb promptMinder

# 设置环境变量
export POSTGRES_URL="postgres://username:password@localhost:5432/promptMinder"
```

### Docker PostgreSQL

使用 Docker 运行 PostgreSQL：

```bash
docker run -d \
  --name postgres-promptminder \
  -e POSTGRES_DB=promptMinder \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=your_password \
  -p 5432:5432 \
  postgres:15-alpine
```

## 📊 数据库迁移

在应用首次启动后，需要运行数据库迁移：

```bash
# 使用 docker-compose
docker-compose exec app npm run db:push

# 或直接在容器中执行
docker exec promptminder npm run db:push
```

## 🔍 故障排除

### 常见问题

1. **端口冲突**

   ```bash
   # 检查端口占用
   lsof -i :3000

   # 修改端口映射
   docker run -p 8080:3000 ...
   ```
2. **数据库连接失败**

   ```bash
   # 检查数据库连接
   docker logs promptminder

   # 验证环境变量
   docker exec promptminder printenv | grep POSTGRES
   ```
3. **构建失败**

   ```bash
   # 清理缓存重新构建
   docker build --no-cache -t promptminder:latest .
   ```

### 日志查看

```bash
# 查看应用日志
docker logs promptminder

# 实时查看日志
docker logs -f promptminder

# 查看数据库日志
docker logs promptminder-db
```

## 🛠️ 开发模式

如需在开发模式下运行：

```bash
# 修改 docker run 命令
docker run -d \
  --name promptminder-dev \
  -p 3000:3000 \
  -v $(pwd):/app \
  -e POSTGRES_URL=your_database_url \
  -e NODE_ENV=development \
  promptminder:latest \
  npm run dev
```

## 🔄 更新和维护

### 更新应用

```bash
# 停止现有容器
docker stop promptminder
docker rm promptminder

# 重新构建和启动
docker build -t promptminder:latest .
./start.sh
```

### 备份数据

```bash
# 备份数据库
docker exec promptminder-db pg_dump -U postgres promptMinder > backup.sql

# 恢复数据库
docker exec -i promptminder-db psql -U postgres promptMinder < backup.sql
```
