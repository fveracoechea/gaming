# Railway Environments with SST

This guide explains how to use Railway Environments with the Terraform provider in SST.

## Understanding Railway Environments

Railway Environments are isolated contexts within a Project where you deploy different versions
of your services.

**Structure:**

```
Railway Project
├── production environment
│   ├── web service
│   ├── api service
│   └── database service
├── staging environment
│   ├── web service
│   ├── api service
│   └── database service
└── development environment
    ├── web service
    ├── api service
    └── database service
```

Each environment has its own:

- Deployments
- Environment variables
- Domains
- Resource allocations

## Getting Environment IDs

Railway environments are created through the Railway dashboard or CLI. You need to get the
environment ID to use it in Terraform.

### Method 1: Railway CLI

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link to your project
railway link

# List environments and get IDs
railway environment
```

### Method 2: Railway Dashboard

1. Go to your project: https://railway.app/project/c70588af-aacb-4ceb-ad7c-87ed9b6bd325
2. Click on an environment (production, staging, etc.)
3. Look at the URL - the environment ID is in the URL path

### Method 3: Use Data Source (if available)

```typescript
// Get project info including environments
const project = await railway.getProject({
  id: 'c70588af-aacb-4ceb-ad7c-87ed9b6bd325',
});
```

## Using Environments in SST

### Example 1: Deploy Services to Specific Environments

```typescript
export default $config({
  app(input) {
    return {
      name: 'gaming',
      providers: { railway: '0.4.4' },
    };
  },
  async run() {
    const projectId = 'c70588af-aacb-4ceb-ad7c-87ed9b6bd325';

    // Your Railway environment IDs (get these from Railway dashboard)
    const environments = {
      production: 'prod-env-id-here',
      staging: 'staging-env-id-here',
      development: 'dev-env-id-here',
    };

    // Deploy web service to production environment
    const webProd = new railway.Service('web-production', {
      projectId: projectId,
      environmentId: environments.production,
      name: 'web',
      source: {
        repo: 'your-org/gaming',
        branch: 'main',
        rootDirectory: 'apps/web',
      },
    });

    // Deploy API service to production environment
    const apiProd = new railway.Service('api-production', {
      projectId: projectId,
      environmentId: environments.production,
      name: 'api',
      source: {
        repo: 'your-org/gaming',
        branch: 'main',
        rootDirectory: 'apps/server',
      },
    });

    // Deploy to staging environment with develop branch
    const webStaging = new railway.Service('web-staging', {
      projectId: projectId,
      environmentId: environments.staging,
      name: 'web',
      source: {
        repo: 'your-org/gaming',
        branch: 'develop',
        rootDirectory: 'apps/web',
      },
    });

    return {
      production: {
        web: webProd.id,
        api: apiProd.id,
      },
      staging: {
        web: webStaging.id,
      },
    };
  },
});
```

### Example 2: Environment-Specific Variables

```typescript
async run() {
  const projectId = 'c70588af-aacb-4ceb-ad7c-87ed9b6bd325';
  const prodEnvId = 'prod-env-id';
  const stagingEnvId = 'staging-env-id';

  // Production service
  const webProd = new railway.Service('web-prod', {
    projectId: projectId,
    environmentId: prodEnvId,
    name: 'web',
  });

  // Production environment variables
  new railway.Variable('web-prod-node-env', {
    projectId: projectId,
    environmentId: prodEnvId,
    serviceId: webProd.id,
    name: 'NODE_ENV',
    value: 'production',
  });

  new railway.Variable('web-prod-api-url', {
    projectId: projectId,
    environmentId: prodEnvId,
    serviceId: webProd.id,
    name: 'API_URL',
    value: 'https://api.yourdomain.com',
  });

  // Staging service
  const webStaging = new railway.Service('web-staging', {
    projectId: projectId,
    environmentId: stagingEnvId,
    name: 'web',
  });

  // Staging environment variables (different values)
  new railway.Variable('web-staging-node-env', {
    projectId: projectId,
    environmentId: stagingEnvId,
    serviceId: webStaging.id,
    name: 'NODE_ENV',
    value: 'staging',
  });

  new railway.Variable('web-staging-api-url', {
    projectId: projectId,
    environmentId: stagingEnvId,
    serviceId: webStaging.id,
    name: 'API_URL',
    value: 'https://api-staging.yourdomain.com',
  });
}
```

### Example 3: Map SST Stages to Railway Environments

This is a powerful pattern - use SST's stage concept to automatically deploy to the right
Railway environment:

```typescript
export default $config({
  app(input) {
    return {
      name: 'gaming',
      providers: { railway: '0.4.4' },
    };
  },
  async run() {
    const projectId = 'c70588af-aacb-4ceb-ad7c-87ed9b6bd325';

    // Map SST stages to Railway environment IDs
    const railwayEnvironments = {
      production: 'railway-prod-env-id',
      staging: 'railway-staging-env-id',
      dev: 'railway-dev-env-id',
    } as const;

    // Get current SST stage
    const stage = $app.stage as keyof typeof railwayEnvironments;
    const environmentId = railwayEnvironments[stage];

    if (!environmentId) {
      throw new Error(`No Railway environment configured for stage: ${stage}`);
    }

    // Get branch based on stage
    const branch =
      stage === 'production' ? 'main' : stage === 'staging' ? 'staging' : 'develop';

    // Deploy services to the appropriate environment
    const webService = new railway.Service(`web-${stage}`, {
      projectId: projectId,
      environmentId: environmentId,
      name: 'web',
      source: {
        repo: 'your-org/gaming',
        branch: branch,
        rootDirectory: 'apps/web',
      },
    });

    const apiService = new railway.Service(`api-${stage}`, {
      projectId: projectId,
      environmentId: environmentId,
      name: 'api',
      source: {
        repo: 'your-org/gaming',
        branch: branch,
        rootDirectory: 'apps/server',
      },
    });

    // Stage-specific environment variables
    new railway.Variable(`node-env-${stage}`, {
      projectId: projectId,
      environmentId: environmentId,
      serviceId: webService.id,
      name: 'NODE_ENV',
      value: stage,
    });

    return {
      stage: stage,
      environment: environmentId,
      services: {
        web: webService.id,
        api: apiService.id,
      },
    };
  },
});
```

**Deploy to different environments:**

```bash
# Deploy to development Railway environment
sst deploy --stage dev

# Deploy to staging Railway environment
sst deploy --stage staging

# Deploy to production Railway environment
sst deploy --stage production
```

### Example 4: Shared Database Across Environments

Sometimes you want to share resources (like a database) across environments:

```typescript
async run() {
  const projectId = 'c70588af-aacb-4ceb-ad7c-87ed9b6bd325';
  const sharedEnvId = 'shared-env-id'; // A dedicated "shared" environment
  const prodEnvId = 'prod-env-id';
  const stagingEnvId = 'staging-env-id';

  // Shared database service in dedicated environment
  const database = new railway.Service('shared-database', {
    projectId: projectId,
    environmentId: sharedEnvId,
    name: 'postgres',
    source: {
      image: 'postgres:16-alpine',
    },
  });

  // Get database URL (you'd need to configure this)
  const dbUrl = $interpolate`postgresql://user:pass@${database.id}.railway.internal:5432/db`;

  // Production services reference shared database
  const webProd = new railway.Service('web-prod', {
    projectId: projectId,
    environmentId: prodEnvId,
    name: 'web',
  });

  new railway.Variable('web-prod-db', {
    projectId: projectId,
    environmentId: prodEnvId,
    serviceId: webProd.id,
    name: 'DATABASE_URL',
    value: dbUrl,
  });

  // Staging services also reference the same database
  const webStaging = new railway.Service('web-staging', {
    projectId: projectId,
    environmentId: stagingEnvId,
    name: 'web',
  });

  new railway.Variable('web-staging-db', {
    projectId: projectId,
    environmentId: stagingEnvId,
    serviceId: webStaging.id,
    name: 'DATABASE_URL',
    value: dbUrl,
  });
}
```

### Example 5: Environment-Specific Custom Domains

```typescript
async run() {
  const projectId = 'c70588af-aacb-4ceb-ad7c-87ed9b6bd325';
  const prodEnvId = 'prod-env-id';
  const stagingEnvId = 'staging-env-id';

  // Production service
  const webProd = new railway.Service('web-prod', {
    projectId: projectId,
    environmentId: prodEnvId,
    name: 'web',
  });

  // Production domain
  new railway.CustomDomain('prod-domain', {
    projectId: projectId,
    environmentId: prodEnvId,
    serviceId: webProd.id,
    domain: 'app.yourdomain.com',
  });

  // Staging service
  const webStaging = new railway.Service('web-staging', {
    projectId: projectId,
    environmentId: stagingEnvId,
    name: 'web',
  });

  // Staging domain
  new railway.CustomDomain('staging-domain', {
    projectId: projectId,
    environmentId: stagingEnvId,
    serviceId: webStaging.id,
    domain: 'staging.yourdomain.com',
  });
}
```

## Best Practices

### 1. Use SST Secrets for Environment IDs

Instead of hardcoding environment IDs:

```typescript
async run() {
  // Store environment IDs as SST secrets
  const prodEnvId = new sst.Secret('RailwayProdEnvId');
  const stagingEnvId = new sst.Secret('RailwayStaginEnvId');

  const stage = $app.stage;
  const environmentId = stage === 'production' ? prodEnvId.value : stagingEnvId.value;

  new railway.Service('web', {
    projectId: 'project-id',
    environmentId: environmentId,
    name: 'web',
  });
}
```

Set the secrets:

```bash
sst secret set RailwayProdEnvId "prod-env-id-value"
sst secret set RailwayStagingEnvId "staging-env-id-value"
```

### 2. Create Reusable Helper Functions

```typescript
async run() {
  const projectId = 'c70588af-aacb-4ceb-ad7c-87ed9b6bd325';

  // Helper to get environment ID based on stage
  function getRailwayEnv(stage: string): string {
    const envMap: Record<string, string> = {
      production: 'prod-env-id',
      staging: 'staging-env-id',
      dev: 'dev-env-id',
    };
    return envMap[stage] || envMap.dev;
  }

  // Helper to create service with consistent naming
  function createRailwayService(
    name: string,
    config: { rootDirectory?: string; branch?: string }
  ) {
    const stage = $app.stage;
    return new railway.Service(`${name}-${stage}`, {
      projectId: projectId,
      environmentId: getRailwayEnv(stage),
      name: name,
      source: {
        repo: 'your-org/gaming',
        branch: config.branch || 'main',
        rootDirectory: config.rootDirectory,
      },
    });
  }

  // Use helpers
  const web = createRailwayService('web', { rootDirectory: 'apps/web' });
  const api = createRailwayService('api', { rootDirectory: 'apps/server' });
}
```

### 3. Environment Isolation Strategy

**Option A: Separate Railway Projects per Environment**

```
- gaming-production (Railway Project)
  - production (Railway Environment)
- gaming-staging (Railway Project)
  - staging (Railway Environment)
- gaming-dev (Railway Project)
  - development (Railway Environment)
```

**Option B: Single Railway Project with Multiple Environments** (Recommended)

```
- gaming (Railway Project)
  - production (Railway Environment)
  - staging (Railway Environment)
  - development (Railway Environment)
```

## Common Patterns

### Pattern 1: Preview Environments for PRs

Railway automatically creates preview environments for PRs. You can manage these
programmatically:

```typescript
async run() {
  const projectId = 'your-project-id';

  // Check if this is a PR deployment
  const isPR = process.env.RAILWAY_ENVIRONMENT_NAME?.startsWith('pr-');

  if (isPR) {
    // Use the PR's environment ID
    const prEnvId = process.env.RAILWAY_ENVIRONMENT_ID;

    new railway.Service('web-pr', {
      projectId: projectId,
      environmentId: prEnvId,
      name: 'web',
      source: {
        repo: 'your-org/gaming',
        branch: process.env.RAILWAY_GIT_BRANCH || 'main',
      },
    });
  }
}
```

### Pattern 2: Progressive Rollout

Deploy to environments in sequence:

```bash
# 1. Deploy to dev first
sst deploy --stage dev

# 2. Test, then promote to staging
sst deploy --stage staging

# 3. Test, then promote to production
sst deploy --stage production
```

## Troubleshooting

### Error: Environment not found

Make sure you're using the correct environment ID from Railway. Double-check in the Railway
dashboard.

### Services not appearing in Railway dashboard

The environment ID must match exactly. Check:

1. The project ID is correct
2. The environment exists in that project
3. Your Railway token has access to that environment

### Variables not updating

Railway environment variables require both `environmentId` and `serviceId`:

```typescript
new railway.Variable('my-var', {
  projectId: 'project-id',
  environmentId: 'env-id', // Required
  serviceId: service.id, // Required
  name: 'VAR_NAME',
  value: 'value',
});
```

## Summary

- Railway Environments = isolated contexts within a Project
- Use `environmentId` parameter on services, variables, and domains
- Map SST stages → Railway environments for automatic deployment
- Get environment IDs from Railway dashboard or CLI
- Use SST Secrets to store environment IDs securely
- One Railway Project with multiple environments is usually simpler than multiple projects

## Resources

- [Railway Environments Docs](https://docs.railway.app/guides/environments)
- [Railway CLI](https://docs.railway.app/guides/cli)
- [Railway Terraform Provider](https://registry.terraform.io/providers/terraform-community-providers/railway/latest/docs)
