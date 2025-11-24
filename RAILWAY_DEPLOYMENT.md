# Railway Deployment Guide for Monorepo

This monorepo contains multiple applications that can be deployed to Railway. Each app has its
own Dockerfile optimized for monorepo builds.

## Available Apps

- **Web App** (`apps/web`) - React Router frontend
- **Server** (`apps/server`) - Hono backend API

## Deployment Architecture

All Dockerfiles are located in `infra/` and build from the **monorepo root** as the build
context. This ensures all workspace dependencies are available during build.

## Deploying Multiple Services to Railway

### Method 1: Using Railway Dashboard (Recommended)

For each service you want to deploy:

1. **Create a new Railway service**
2. **Connect your GitHub repository**
3. **Configure the service:**
   - Go to **Settings → Build**
   - Set **Root Directory**: `.` (monorepo root)
   - Set **Dockerfile Path**:
     - For web: `infra/web.Dockerfile`
     - For server: `infra/server.Dockerfile`
   - Set **Watch Paths** (optional, to control when builds trigger):
     ```
     apps/web/**
     packages/**
     infra/web.Dockerfile
     ```

4. **Set Environment Variables** in Settings → Variables

### Method 2: Using railway.json per Service

You can create service-specific configuration by creating Railway services and setting the
config per service:

**For Web Service:**

```json
{
  "$schema": "https://railway.com/railway.schema.json",
  "build": {
    "builder": "DOCKERFILE",
    "dockerfilePath": "infra/web.Dockerfile",
    "watchPaths": [
      "apps/web/**",
      "packages/**",
      "infra/web.Dockerfile",
      "tsconfig*.json",
      "turbo.json"
    ]
  },
  "deploy": {
    "startCommand": "bun run web:start",
    "healthcheckPath": "/",
    "healthcheckTimeout": 100
  }
}
```

**For Server Service:**

```json
{
  "$schema": "https://railway.com/railway.schema.json",
  "build": {
    "builder": "DOCKERFILE",
    "dockerfilePath": "infra/server.Dockerfile",
    "watchPaths": [
      "apps/server/**",
      "packages/api/**",
      "packages/auth/**",
      "packages/db/**",
      "infra/server.Dockerfile"
    ]
  },
  "deploy": {
    "startCommand": "bun run apps/server/src/index.ts",
    "healthcheckPath": "/health",
    "healthcheckTimeout": 100
  }
}
```

> **Note:** Railway will use dashboard settings over `railway.json` if both are present.

## Environment Variables

### Web App

```env
DATABASE_URL=postgresql://...
BETTER_AUTH_SECRET=...
BETTER_AUTH_URL=https://your-app.railway.app
NODE_ENV=production
```

### Server

```env
DATABASE_URL=postgresql://...
PORT=3001
NODE_ENV=production
```

## Build Context Structure

All Dockerfiles expect this structure:

```
/app
├── package.json           # Root package.json with workspace config
├── bun.lock              # Lockfile
├── bunfig.toml           # Bun config
├── turbo.json            # Turborepo config
├── tsconfig.json         # Root TS config
├── tsconfig.base.json    # Base TS config
├── apps/
│   ├── web/              # Frontend app
│   └── server/           # Backend app
└── packages/             # Shared workspace packages
    ├── api/
    ├── auth/
    ├── db/
    ├── ui/
    └── zod/
```

## Dockerfile Architecture

Each Dockerfile uses a 3-stage build:

1. **Stage 1 (dependencies)**: Installs all dependencies with full workspace context
2. **Stage 2 (builder)**: Builds the specific app with access to all packages
3. **Stage 3 (runner)**: Creates lean production image with only runtime needs

This ensures:

- ✅ All workspace dependencies resolve correctly
- ✅ Minimal final image size
- ✅ Fast rebuilds with layer caching
- ✅ Consistent builds across environments

## Adding a New App

To add a new deployable app:

1. **Create the app** in `apps/your-app/`
2. **Create a Dockerfile** in `infra/your-app.Dockerfile` following the pattern:
   ```dockerfile
   # Stage 1: Dependencies (copy relevant package.json files)
   # Stage 2: Builder (copy source and build)
   # Stage 3: Runner (copy runtime artifacts)
   ```
3. **Create a Railway service** and point it to your Dockerfile
4. **Configure environment variables** in Railway dashboard

## Troubleshooting

### Build fails with "file not found"

- Ensure Railway's **Root Directory** is set to `.` (monorepo root)
- Check that the Dockerfile path is relative to root (e.g., `infra/web.Dockerfile`)

### Workspace dependencies not found

- Verify all relevant `package.json` files are copied in Stage 1
- Ensure `COPY packages ./packages` is in Stage 2

### Build is slow

- Check that `node_modules` and build outputs are in `.dockerignore`
- Use Railway's build cache (enabled by default)

## Testing Locally

Test builds exactly as Railway will build them:

```bash
# From monorepo root
docker build -f infra/web.Dockerfile -t test-web .
docker build -f infra/server.Dockerfile -t test-server .

# Run the containers
docker run -p 3000:3000 test-web
docker run -p 3001:3001 test-server
```

## Performance Tips

1. **Use watchPaths** to avoid rebuilding when unrelated files change
2. **Minimize packages copied** - only copy what each app needs
3. **Use Railway's Redis** for caching if needed
4. **Enable buildkit** for faster builds (Railway uses this by default)

---

**Last Updated:** 2025-11-24
