# ===== Stage 1: Build =====
FROM node:20.19.0-alpine AS builder

# Cài pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy file cấu hình để cache deps
COPY package.json pnpm-lock.yaml ./
RUN pnpm install

# Copy toàn bộ code
COPY . .

# Build Next.js (standalone)
RUN pnpm build && \
    cp -r dist/static dist/standalone/dist/

# ===== Stage 2: Runtime =====
FROM node:20.19.0-alpine

WORKDIR /app
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy package.json để cài production deps
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod

# Copy build standalone từ builder
COPY --from=builder /app/dist/standalone ./standalone

# Expose port
EXPOSE 3000

# Chạy app (tùy cấu hình bạn, giả sử chạy Next.js standalone)
CMD ["node", "standalone/server.js"]