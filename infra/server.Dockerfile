# Stage 1: Install dependencies for the entire monorepo
FROM oven/bun:1.3 AS dependencies
WORKDIR /app

# Copy workspace configuration files first
COPY package.json bun.lock bunfig.toml ./
COPY turbo.json ./
COPY tsconfig.json tsconfig.base.json ./

# Copy all package.json files to install dependencies
COPY apps/server/package.json ./apps/server/
COPY packages/api/package.json ./packages/api/
COPY packages/auth/package.json ./packages/auth/
COPY packages/db/package.json ./packages/db/
COPY packages/zod/package.json ./packages/zod/

# Install all dependencies (including workspace packages)
RUN bun install --frozen-lockfile

# Stage 2: Build the application
FROM oven/bun:1.3 AS builder
WORKDIR /app

# Copy everything from dependencies stage (includes all node_modules and config files)
COPY --from=dependencies /app ./

# Copy all source code (needed for workspace dependencies)
COPY apps/server ./apps/server
COPY packages ./packages

# Build the server (if you have a build step, uncomment below)
# RUN bun run server:build

# Stage 3: Production runtime
FROM oven/bun:1.3 AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copy necessary files for runtime
COPY --from=builder /app/package.json ./
COPY --from=builder /app/bun.lock ./
COPY --from=builder /app/apps/server ./apps/server
COPY --from=builder /app/node_modules ./node_modules

# Copy workspace packages (needed at runtime)
COPY --from=builder /app/packages ./packages

EXPOSE 3001

CMD ["bun", "run", "apps/server/src/index.ts"]
