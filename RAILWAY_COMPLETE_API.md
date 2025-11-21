# Railway Provider - Complete API Reference

Based on the actual TypeScript definitions, here's the complete Railway Terraform provider API
available in SST.

## Available Resources

The Railway provider includes these resources:

1. **`railway.Provider`** - Provider configuration
2. **`railway.Project`** - Railway project container
3. **`railway.Environment`** - Environment within a project ✨
4. **`railway.Service`** - Service deployment
5. **`railway.Variable`** - Service-specific environment variable
6. **`railway.SharedVariable`** - Environment-wide shared variable
7. **`railway.CustomDomain`** - Custom domain mapping
8. **`railway.ServiceDomain`** - Service domain configuration
9. **`railway.DeploymentTrigger`** - Trigger for deployments
10. **`railway.TcpProxy`** - TCP proxy configuration
11. **`railway.VariableCollection`** - Collection of variables

## 1. railway.Environment

**Create and manage Railway environments programmatically!**

### Definition

```typescript
new railway.Environment(name: string, args: {
  projectId: string;
  name?: string;
}, opts?: ResourceOptions)
```

### Properties

- `projectId` (required) - ID of the project
- `name` (optional) - Name of the environment

### Example: Create Environments Programmatically

```typescript
export default $config({
  app(input) {
    return {
      name: 'gaming',
      providers: { railway: '0.4.4' },
    };
  },
  async run() {
    // Create a Railway project
    const project = new railway.Project('gaming-project', {
      name: 'Gaming Platform',
    });

    // Create production environment
    const prodEnv = new railway.Environment('production', {
      projectId: project.id,
      name: 'production',
    });

    // Create staging environment
    const stagingEnv = new railway.Environment('staging', {
      projectId: project.id,
      name: 'staging',
    });

    // Create development environment
    const devEnv = new railway.Environment('development', {
      projectId: project.id,
      name: 'development',
    });

    // Create services in each environment
    new railway.Service('web-prod', {
      projectId: project.id,
      environmentId: prodEnv.id,
      name: 'web',
      sourceRepo: 'your-org/gaming',
      sourceRepoBranch: 'main',
      rootDirectory: 'apps/web',
    });

    new railway.Service('web-staging', {
      projectId: project.id,
      environmentId: stagingEnv.id,
      name: 'web',
      sourceRepo: 'your-org/gaming',
      sourceRepoBranch: 'develop',
      rootDirectory: 'apps/web',
    });

    return {
      projectId: project.id,
      environments: {
        production: prodEnv.id,
        staging: stagingEnv.id,
        development: devEnv.id,
      },
    };
  },
});
```

### Example: Dynamic Environment Creation Based on SST Stage

```typescript
async run() {
  const project = new railway.Project('gaming-project', {
    name: 'Gaming Platform',
  });

  const stage = $app.stage;

  // Create environment for current stage
  const environment = new railway.Environment(`env-${stage}`, {
    projectId: project.id,
    name: stage,
  });

  // Deploy service to this environment
  new railway.Service(`web-${stage}`, {
    projectId: project.id,
    environmentId: environment.id,
    name: 'web',
    sourceRepo: 'your-org/gaming',
    sourceRepoBranch: stage === 'production' ? 'main' : 'develop',
  });

  return {
    environmentId: environment.id,
    environmentName: environment.name,
  };
}
```

## 2. railway.Service

Deploy services from Git repos or Docker images.

### Definition

```typescript
new railway.Service(name: string, args: {
  projectId: string;
  environmentId?: string;
  name?: string;
  sourceRepo?: string;
  sourceRepoBranch?: string;
  sourceImage?: string;
  rootDirectory?: string;
  configPath?: string;
  cronSchedule?: string;
  numReplicas?: number;
  region?: string;
  volume?: { mountPath: string; volumeId: string };
}, opts?: ResourceOptions)
```

### Key Properties

- `projectId` (required) - Project ID
- `environmentId` (optional) - Environment ID (if not using default)
- `sourceRepo` - Git repository (conflicts with `sourceImage`)
- `sourceRepoBranch` - Git branch (required if using `sourceRepo`)
- `sourceImage` - Docker image (conflicts with Git source)
- `rootDirectory` - Subdirectory for monorepos
- `configPath` - Path to railway.json config
- `cronSchedule` - Cron expression for scheduled jobs
- `numReplicas` - Number of replicas (default: 1)
- `region` - Deployment region (default: us-west1)

### Example: Git Source

```typescript
const webService = new railway.Service('web', {
  projectId: project.id,
  environmentId: environment.id,
  name: 'web',
  sourceRepo: 'fveracoechea/gaming',
  sourceRepoBranch: 'main',
  rootDirectory: 'apps/web',
  region: 'us-west1',
  numReplicas: 2,
});
```

### Example: Docker Image

```typescript
const redisService = new railway.Service('redis', {
  projectId: project.id,
  environmentId: environment.id,
  name: 'redis',
  sourceImage: 'redis:7-alpine',
});
```

### Example: Private Docker Registry

```typescript
const appService = new railway.Service('private-app', {
  projectId: project.id,
  environmentId: environment.id,
  sourceImage: 'ghcr.io/your-org/app:latest',
  sourceImageRegistryUsername: 'your-username',
  sourceImageRegistryPassword: $secret('GITHUB_TOKEN'),
});
```

### Example: Cron Job Service

```typescript
const cronService = new railway.Service('daily-job', {
  projectId: project.id,
  environmentId: environment.id,
  name: 'daily-sync',
  sourceRepo: 'your-org/gaming',
  sourceRepoBranch: 'main',
  cronSchedule: '0 2 * * *', // Run at 2 AM daily
});
```

## 3. railway.Variable

Service-specific environment variables.

### Definition

```typescript
new railway.Variable(name: string, args: {
  projectId: string;
  environmentId: string;
  serviceId: string;
  name?: string;
  value: string;
}, opts?: ResourceOptions)
```

### Properties

- `projectId` (required) - Project ID
- `environmentId` (required) - Environment ID
- `serviceId` (required) - Service ID
- `name` (optional) - Variable name
- `value` (required) - Variable value

### Example

```typescript
const service = new railway.Service('api', {
  projectId: project.id,
  environmentId: environment.id,
  name: 'api',
});

// Add environment variables to the service
new railway.Variable('database-url', {
  projectId: project.id,
  environmentId: environment.id,
  serviceId: service.id,
  name: 'DATABASE_URL',
  value: 'postgresql://...',
});

new railway.Variable('node-env', {
  projectId: project.id,
  environmentId: environment.id,
  serviceId: service.id,
  name: 'NODE_ENV',
  value: 'production',
});
```

## 4. railway.SharedVariable

Environment-wide variables shared across all services in an environment.

### Definition

```typescript
new railway.SharedVariable(name: string, args: {
  projectId: string;
  environmentId: string;
  name?: string;
  value: string;
}, opts?: ResourceOptions)
```

### Properties

- `projectId` (required) - Project ID
- `environmentId` (required) - Environment ID
- `name` (optional) - Variable name
- `value` (required) - Variable value

### Example

```typescript
const environment = new railway.Environment('production', {
  projectId: project.id,
  name: 'production',
});

// Create shared variables accessible by ALL services in this environment
new railway.SharedVariable('shared-api-key', {
  projectId: project.id,
  environmentId: environment.id,
  name: 'API_KEY',
  value: 'shared-secret-key',
});

new railway.SharedVariable('shared-region', {
  projectId: project.id,
  environmentId: environment.id,
  name: 'AWS_REGION',
  value: 'us-west-2',
});

// All services in this environment will have access to these variables
const webService = new railway.Service('web', {
  projectId: project.id,
  environmentId: environment.id,
  name: 'web',
});

const apiService = new railway.Service('api', {
  projectId: project.id,
  environmentId: environment.id,
  name: 'api',
});
// Both web and api services can access API_KEY and AWS_REGION
```

## 5. railway.CustomDomain

Map custom domains to services.

### Definition

```typescript
new railway.CustomDomain(name: string, args: {
  projectId: string;
  environmentId: string;
  serviceId: string;
  domain: string;
}, opts?: ResourceOptions)
```

### Example

```typescript
const service = new railway.Service('web', {
  projectId: project.id,
  environmentId: environment.id,
  name: 'web',
});

// Add custom domain
new railway.CustomDomain('main-domain', {
  projectId: project.id,
  environmentId: environment.id,
  serviceId: service.id,
  domain: 'app.yourdomain.com',
});
```

## 6. railway.ServiceDomain

Configure service domain settings.

### Example

```typescript
new railway.ServiceDomain('web-domain', {
  projectId: project.id,
  environmentId: environment.id,
  serviceId: service.id,
  // Additional domain configuration
});
```

## 7. railway.DeploymentTrigger

Trigger redeployments programmatically.

### Example

```typescript
new railway.DeploymentTrigger('redeploy', {
  projectId: project.id,
  environmentId: environment.id,
  serviceId: service.id,
});
```

## Complete Example: Full Stack Application

Here's a complete example using all the resources:

```typescript
/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: 'gaming',
      removal: input?.stage === 'production' ? 'retain' : 'remove',
      home: 'local',
      providers: { railway: '0.4.4' },
    };
  },
  async run() {
    const stage = $app.stage;

    // Create Railway project
    const project = new railway.Project('gaming-project', {
      name: 'Gaming Platform',
      description: 'Esports tournament platform',
    });

    // Create environment for this stage
    const environment = new railway.Environment(`env-${stage}`, {
      projectId: project.id,
      name: stage,
    });

    // Shared variables for all services
    new railway.SharedVariable('shared-region', {
      projectId: project.id,
      environmentId: environment.id,
      name: 'REGION',
      value: 'us-west-2',
    });

    // Database service
    const database = new railway.Service('database', {
      projectId: project.id,
      environmentId: environment.id,
      name: 'postgres',
      sourceImage: 'postgres:16-alpine',
    });

    // Redis service
    const redis = new railway.Service('redis', {
      projectId: project.id,
      environmentId: environment.id,
      name: 'redis',
      sourceImage: 'redis:7-alpine',
    });

    // API service
    const apiService = new railway.Service('api', {
      projectId: project.id,
      environmentId: environment.id,
      name: 'api',
      sourceRepo: 'fveracoechea/gaming',
      sourceRepoBranch: stage === 'production' ? 'main' : 'develop',
      rootDirectory: 'apps/server',
      region: 'us-west1',
    });

    // API environment variables
    new railway.Variable('api-port', {
      projectId: project.id,
      environmentId: environment.id,
      serviceId: apiService.id,
      name: 'PORT',
      value: '3000',
    });

    new railway.Variable('api-db-url', {
      projectId: project.id,
      environmentId: environment.id,
      serviceId: apiService.id,
      name: 'DATABASE_URL',
      value: $interpolate`postgresql://postgres:password@${database.id}:5432/gaming`,
    });

    new railway.Variable('api-redis-url', {
      projectId: project.id,
      environmentId: environment.id,
      serviceId: apiService.id,
      name: 'REDIS_URL',
      value: $interpolate`redis://${redis.id}:6379`,
    });

    // Web service
    const webService = new railway.Service('web', {
      projectId: project.id,
      environmentId: environment.id,
      name: 'web',
      sourceRepo: 'fveracoechea/gaming',
      sourceRepoBranch: stage === 'production' ? 'main' : 'develop',
      rootDirectory: 'apps/web',
      region: 'us-west1',
      numReplicas: stage === 'production' ? 2 : 1,
    });

    // Web environment variables
    new railway.Variable('web-api-url', {
      projectId: project.id,
      environmentId: environment.id,
      serviceId: webService.id,
      name: 'API_URL',
      value: $interpolate`https://${apiService.id}.railway.app`,
    });

    // Custom domains (production only)
    if (stage === 'production') {
      new railway.CustomDomain('api-domain', {
        projectId: project.id,
        environmentId: environment.id,
        serviceId: apiService.id,
        domain: 'api.yourdomain.com',
      });

      new railway.CustomDomain('web-domain', {
        projectId: project.id,
        environmentId: environment.id,
        serviceId: webService.id,
        domain: 'app.yourdomain.com',
      });
    }

    // Cron job service
    const cronService = new railway.Service('cron-job', {
      projectId: project.id,
      environmentId: environment.id,
      name: 'daily-sync',
      sourceRepo: 'fveracoechea/gaming',
      sourceRepoBranch: 'main',
      rootDirectory: 'apps/cron',
      cronSchedule: '0 3 * * *', // 3 AM daily
    });

    return {
      project: project.id,
      environment: environment.id,
      services: {
        database: database.id,
        redis: redis.id,
        api: apiService.id,
        web: webService.id,
        cron: cronService.id,
      },
    };
  },
});
```

## Deployment Commands

```bash
# Deploy to development
sst deploy --stage dev

# Deploy to staging
sst deploy --stage staging

# Deploy to production
sst deploy --stage production

# Remove development environment
sst remove --stage dev
```

## Key Differences Between Variable Types

### `railway.Variable`

- **Scope**: Single service
- **Usage**: Service-specific configuration
- **Requires**: projectId + environmentId + serviceId
- **Example**: Database connection string for one service

### `railway.SharedVariable`

- **Scope**: All services in an environment
- **Usage**: Environment-wide configuration
- **Requires**: projectId + environmentId (no serviceId)
- **Example**: API keys, region settings, shared secrets

## Best Practices

1. **Create environments programmatically** using `railway.Environment`
2. **Use SharedVariable** for values common across services
3. **Use Variable** for service-specific configuration
4. **Map SST stages to Railway environments** for consistency
5. **Use numReplicas > 1** for production services
6. **Leverage rootDirectory** for monorepo deployments
7. **Set custom domains** only in production
8. **Use cron services** for scheduled tasks instead of external schedulers

## Summary

The Railway provider is much more powerful than initially documented! Key discoveries:

✅ **`railway.Environment`** - Create environments programmatically!  
✅ **`railway.SharedVariable`** - Share variables across all services in an environment  
✅ **`railway.Variable`** - Service-specific variables  
✅ **`railway.Service`** - Full control over deployments, regions, replicas, cron jobs  
✅ **Complete infrastructure as code** - No manual Railway dashboard configuration needed

You can now fully automate your Railway infrastructure with SST! 🚀
