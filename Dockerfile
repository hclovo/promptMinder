# 使用官方Node.js镜像作为构建环境
FROM docker.m.daocloud.io/library/node:18-alpine AS builder

# 设置工作目录
WORKDIR /app

# 配置pnpm清华镜像源
ENV PNPM_REGISTRY=https://registry.npmmirror.com
ENV COREPACK_NPM_REGISTRY=https://registry.npmmirror.com
ENV POSTGRES_URL=postgres://postgres:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/promptMinder

# 复制包管理文件和锁定文件
COPY package.json pnpm-lock.yaml* ./

# 安装pnpm并构建依赖
RUN corepack enable && \
    pnpm config set registry ${PNPM_REGISTRY} && \
    pnpm install

# 复制所有源代码
COPY . .

# 使用精简镜像作为运行时环境
FROM builder

WORKDIR /app

# 从构建阶段复制必要文件
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json .
COPY --from=builder /app/pnpm-lock.yaml .
COPY --from=builder /app/server ./server
COPY --from=builder /app/lib ./lib

# 移除硬编码的数据库连接信息，使用环境变量占位符

# 安装生产依赖
RUN corepack enable && \
    pnpm config set registry https://registry.npmmirror.com && \
    pnpm install --prod && \
    npm install --save-dev mini-css-extract-plugin

# 暴露端口
EXPOSE 3000

