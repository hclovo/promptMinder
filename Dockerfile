# 使用官方Node.js镜像作为构建环境
FROM node:18-alpine AS builder

# 设置工作目录
WORKDIR /app

# 配置pnpm清华镜像源
ENV PNPM_REGISTRY=https://registry.npmmirror.com
ENV COREPACK_NPM_REGISTRY=https://registry.npmmirror.com

# 复制包管理文件和锁定文件
COPY package.json pnpm-lock.yaml* ./

# 安装pnpm并构建依赖
RUN corepack enable && \
    pnpm config set registry ${PNPM_REGISTRY} && \
    pnpm install --frozen-lockfile

# 复制所有源代码
COPY . .

# 构建应用
RUN pnpm build

# 使用精简镜像作为运行时环境
FROM node:18-alpine

WORKDIR /app

# 从构建阶段复制必要文件
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json .

# 安装生产依赖
RUN corepack enable && \
    pnpm install --prod --frozen-lockfile

# 暴露端口
EXPOSE 3000

# 启动命令
CMD ["pnpm", "start"]

# 健康检查
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --spider http://localhost:3000/api/health || exit 1
