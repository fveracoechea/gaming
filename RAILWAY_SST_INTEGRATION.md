# Railway Terraform Provider with SST

This guide shows how to use the Railway Terraform provider within SST to manage Railway
infrastructure.

## Setup

### 1. Add the Railway Provider

The Railway provider is already configured in `sst.config.ts`:

```typescript
export default $config({
  app(input) {
    return {
      name: 'gaming',
      providers: {
        railway: '0.4.4', // Railway provider version
      },
    };
  },
});
```

### 2. Authentication

Set your Railway API token as an environment variable:

```bash
export RAILWAY_TOKEN="your-railway-api-token"
```

You can get your token from [Railway Settings](https://railway.app/account/tokens).

## Basic Usage

### Current Implementation

Your current setup in `sst.config.ts`:

```typescript
export default $config({
  app(input) {
    return {
      name: 'gaming',
      removal: input?.stage === 'production' ? 'retain' : 'remove',
      protect: ['production'].includes(input?.stage),
      home: 'local',
      providers: { railway: '0.4.4' },
    };
  },
  async run() {
    // Create Railway provider instance with token
    new railway.Provider('railway', {
      token: process.env.RAILWAY_TOKEN,
    });

    // Create a service in an existing project
    new railway.Service('gaming-web', {
      projectId: 'c70588af-aacb-4ceb-ad7c-87ed9b6bd325',
      name: 'web-app',
    });
  },
});
```

## Advanced Examples

### 1. Create a Complete Project with Services

```typescript
async run() {
  // Create a new Railway project
  const project = new railway.Project('gaming-project', {
    name: 'Gaming Platform',
    description: 'Esports gaming platform infrastructure',
  });

  // Create a PostgreSQL database service
  const database = new railway.Service('database', {
    projectId: project.id,
    name: 'postgres',
    source: {
      image: 'postgres:16-alpine',
    },
  });

  // Create a Redis service
  const redis = new railway.Service('redis', {
    projectId: project.id,
    name: 'redis',
    source: {
      image: 'redis:7-alpine',
    },
  });

  // Create the web application service
  const webApp = new railway.Service('web-app', {
    projectId: project.id,
    name: 'web',
    source: {
      repo: 'your-org/gaming-web',
      branch: 'main',
    },
  });

  // Create the backend API service
  const apiServer = new railway.Service('api-server', {
    projectId: project.id,
    name: 'server',
    source: {
      repo: 'your-org/gaming-server',
      branch: 'main',
    },
  });
}
```

### 2. Environment-Specific Configuration

```typescript
async run() {
  const stage = $app.stage;

  // Create environment-specific project
  const project = new railway.Project(`gaming-${stage}`, {
    name: `Gaming Platform - ${stage}`,
    description: `${stage} environment`,
  });

  // Create service with stage-specific settings
  const service = new railway.Service(`web-${stage}`, {
    projectId: project.id,
    name: `web-${stage}`,
    source: {
      repo: 'your-org/gaming-web',
      branch: stage === 'production' ? 'main' : 'develop',
    },
  });

  return {
    projectId: project.id,
    serviceId: service.id,
  };
}
```

### 3. Service with Environment Variables

```typescript
async run() {
  const project = new railway.Project('gaming-project', {
    name: 'Gaming Platform',
  });

  // Get database connection details
  const dbUrl = $interpolate`postgresql://user:pass@host:5432/db`;

  // Create service with environment variables
  const service = new railway.Service('api-service', {
    projectId: project.id,
    name: 'api',
    source: {
      repo: 'your-org/gaming-api',
      branch: 'main',
    },
  });

  // Add environment variables using Railway variables
  new railway.Variable('db-url', {
    projectId: project.id,
    serviceId: service.id,
    name: 'DATABASE_URL',
    value: dbUrl,
  });

  new railway.Variable('node-env', {
    projectId: project.id,
    serviceId: service.id,
    name: 'NODE_ENV',
    value: 'production',
  });
}
```

### 4. Deploy with Custom Docker Image

```typescript
async run() {
  const project = new railway.Project('gaming-project', {
    name: 'Gaming Platform',
  });

  // Deploy from Docker image
  const service = new railway.Service('custom-service', {
    projectId: project.id,
    name: 'custom-app',
    source: {
      image: 'ghcr.io/your-org/gaming-app:latest',
    },
  });
}
```

### 5. Multiple Regions with Railway

```typescript
async run() {
  const project = new railway.Project('gaming-project', {
    name: 'Gaming Platform',
  });

  // Deploy to multiple regions (Railway automatically handles this)
  const usService = new railway.Service('web-us', {
    projectId: project.id,
    name: 'web-us-east',
    source: {
      repo: 'your-org/gaming-web',
      branch: 'main',
    },
  });

  const euService = new railway.Service('web-eu', {
    projectId: project.id,
    name: 'web-eu-west',
    source: {
      repo: 'your-org/gaming-web',
      branch: 'main',
    },
  });
}
```

### 6. Integration with AWS Resources

```typescript
async run() {
  // Create Railway project
  const railwayProject = new railway.Project('gaming-project', {
    name: 'Gaming Platform',
  });

  // Create Railway service
  const railwayService = new railway.Service('web-service', {
    projectId: railwayProject.id,
    name: 'web',
    source: {
      repo: 'your-org/gaming-web',
      branch: 'main',
    },
  });

  // Create AWS S3 bucket for static assets
  const bucket = new sst.aws.Bucket('GameAssets');

  // Share Railway service URL with AWS Lambda
  const api = new sst.aws.Function('ApiHandler', {
    handler: 'src/api.handler',
    environment: {
      RAILWAY_SERVICE_URL: $interpolate`https://${railwayService.name}.railway.app`,
      ASSETS_BUCKET: bucket.name,
    },
    link: [bucket],
  });

  return {
    railwayServiceId: railwayService.id,
    bucketName: bucket.name,
  };
}
```

### 7. Working with Existing Railway Project

If you already have a Railway project (like in your current setup):

```typescript
async run() {
  // Reference existing project
  const existingProjectId = 'c70588af-aacb-4ceb-ad7c-87ed9b6bd325';

  // Create new service in existing project
  const webService = new railway.Service('gaming-web', {
    projectId: existingProjectId,
    name: 'web-app',
    source: {
      repo: 'fveracoechea/gaming',
      branch: 'main',
      rootDirectory: 'apps/web',
    },
  });

  const serverService = new railway.Service('gaming-server', {
    projectId: existingProjectId,
    name: 'api-server',
    source: {
      repo: 'fveracoechea/gaming',
      branch: 'main',
      rootDirectory: 'apps/server',
    },
  });

  return {
    webServiceId: webService.id,
    serverServiceId: serverService.id,
  };
}
```

## Common Railway Resources

### Project

```typescript
const project = new railway.Project('my-project', {
  name: 'My App',
  description: 'Production application',
});
```

### Service (from Git)

```typescript
const service = new railway.Service('my-service', {
  projectId: project.id,
  name: 'api',
  source: {
    repo: 'org/repo',
    branch: 'main',
    rootDirectory: 'apps/api', // Optional: for monorepos
  },
});
```

### Service (from Docker)

```typescript
const service = new railway.Service('my-service', {
  projectId: project.id,
  name: 'worker',
  source: {
    image: 'redis:7-alpine',
  },
});
```

### Environment Variable

```typescript
const variable = new railway.Variable('api-key', {
  projectId: project.id,
  serviceId: service.id,
  name: 'API_KEY',
  value: 'secret-value',
});
```

### Custom Domain

```typescript
const domain = new railway.CustomDomain('my-domain', {
  projectId: project.id,
  serviceId: service.id,
  domain: 'app.example.com',
});
```

## Deployment Commands

```bash
# Deploy to development
sst deploy --stage dev

# Deploy to production
sst deploy --stage production

# Remove resources
sst remove --stage dev
```

## Environment Variables

### Required

```bash
export RAILWAY_TOKEN="your-railway-api-token"
```

### Optional (for Railway provider configuration)

You can also configure the provider in `sst.config.ts`:

```typescript
export default $config({
  app(input) {
    return {
      providers: {
        railway: {
          version: '0.4.4',
          // Optional: configure token here instead of env var
          // token: 'your-token'
        },
      },
    };
  },
});
```

## Best Practices

1. **Use Environment Variables for Secrets**: Always use environment variables for sensitive
   data like API tokens.

2. **Stage-Based Deployments**: Create separate Railway projects for different stages (dev,
   staging, production).

3. **Monorepo Support**: Use the `rootDirectory` property in the service source to deploy from
   specific directories in a monorepo.

4. **Resource Naming**: Use consistent naming conventions: `${app}-${service}-${stage}`.

5. **Output Important Values**: Return important IDs and URLs from your `run()` function for
   reference.

6. **Provider Instances**: You can create multiple Railway provider instances if needed:

```typescript
const railwayProd = new railway.Provider('railway-prod', {
  token: process.env.RAILWAY_PROD_TOKEN,
});

const railwayDev = new railway.Provider('railway-dev', {
  token: process.env.RAILWAY_DEV_TOKEN,
});
```

## Troubleshooting

### Authentication Errors

Make sure your Railway token is set:

```bash
echo $RAILWAY_TOKEN
```

### Project Not Found

Verify your project ID in the Railway dashboard.

### Service Deployment Failed

Check Railway logs in the Railway dashboard or CLI:

```bash
railway logs
```

## Resources

- [Railway Documentation](https://docs.railway.app/)
- [Railway Terraform Provider](https://registry.terraform.io/providers/terraform-community-providers/railway/latest/docs)
- [SST Providers Documentation](https://sst.dev/docs/providers)
- [Railway Dashboard](https://railway.app/dashboard)
- [Railway API Tokens](https://railway.app/account/tokens)
