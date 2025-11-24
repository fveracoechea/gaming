# Stage 1: Install dependencies for the entire monorepo
FROM oven/bun:1.3 AS dependencies
WORKDIR /app

# Copy workspace configuration files first
COPY package.json bun.lock bunfig.toml ./
COPY turbo.json ./

# Copy all package.json files to install dependencies
COPY apps/web/package.json ./apps/web/
COPY packages/api/package.json ./packages/api/
COPY packages/auth/package.json ./packages/auth/
COPY packages/db/package.json ./packages/db/
COPY packages/ui/package.json ./packages/ui/
COPY packages/zod/package.json ./packages/zod/

# Install all dependencies (including workspace packages)
RUN bun install --frozen-lockfile

# Stage 2: Build the application
FROM oven/bun:1.3 AS builder
WORKDIR /app

# Copy installed dependencies from previous stage
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=dependencies /app/package.json ./package.json
COPY --from=dependencies /app/bun.lock ./bun.lock

# Copy all source code (needed for workspace dependencies)
COPY apps/web ./apps/web
COPY packages ./packages
COPY turbo.json ./

# Build the web app
RUN bun run web:build

# Stage 3: Production runtime
FROM oven/bun:1.3 AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copy necessary files for runtime
COPY --from=builder /app/package.json ./
COPY --from=builder /app/bun.lock ./
COPY --from=builder /app/apps/web/package.json ./apps/web/
COPY --from=builder /app/apps/web/build ./apps/web/build
COPY --from=builder /app/node_modules ./node_modules

# Copy workspace packages (needed at runtime)
COPY --from=builder /app/packages ./packages

EXPOSE 3000

CMD ["bun", "run", "web:start"]
