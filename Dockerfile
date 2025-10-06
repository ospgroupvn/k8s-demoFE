# ===== Stage 1: Dependencies =====
FROM node:20.19.0-alpine AS deps
RUN apk add --no-cache libc6-compat

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy dependency files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# ===== Stage 2: Builder =====
FROM node:20.19.0-alpine AS builder

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build arguments
ARG NODE_VERSION
ARG BUILD_DATE
ARG COMMIT_SHA

# Set environment variables for build
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Build Next.js application
RUN pnpm build

# ===== Stage 3: Runtime =====
FROM node:20.19.0-alpine AS runner

WORKDIR /app

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built application
COPY --from=builder /app/dist/standalone ./
COPY --from=builder /app/dist/static ./dist/static

# Set correct permissions
RUN chown -R nextjs:nodejs /app
USER nextjs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })" || exit 1

# Environment variables
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Labels
LABEL org.opencontainers.image.title="BTTP Frontend"
LABEL org.opencontainers.image.description="Next.js Frontend Application"
LABEL org.opencontainers.image.version="${COMMIT_SHA}"
LABEL org.opencontainers.image.created="${BUILD_DATE}"

# Start the application
CMD ["node", "server.js"]
