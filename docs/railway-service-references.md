# Sharing Variables Between Railway Services

This guide explains how to pass the `DATABASE_URL` from a database service to your React app
(or any other service) in Railway using SST.

## The Solution

Railway provides **service reference syntax** to share variables between services:

```typescript
// Reference format: ${{ServiceName.VARIABLE_NAME}}
value: '${{PosgreSQL Database.DATABASE_URL}}';
```

## Complete Example

```typescript
async run() {
  const project = new railway.Project('gaming-platform', {
    name: 'Gaming Platform',
  });

  const environment = new railway.Environment($app.stage, {
    projectId: project.id,
    name: $app.stage,
  });

  // 1. Create database service
  const db = new railway.Service('database', {
    name: 'PosgreSQL Database',  // ← This name is used in the reference!
    projectId: project.id,
    environmentId: environment.id,
    sourceImage: 'ghcr.io/railwayapp-templates/postgres-ssl:17.6',
  });

  // 2. Create React app service
  const reactApp = new railway.Service('react-app', {
    name: 'React Router WebApp',
    projectId: project.id,
    environmentId: environment.id,
    sourceRepo: 'fveracoechea/gaming',
    sourceRepoBranch: 'main',
    rootDirectory: 'apps/web',
  });

  // 3. Pass DATABASE_URL to React app using service reference
  new railway.Variable('react-app-db-url', {
    projectId: project.id,
    environmentId: environment.id,
    serviceId: reactApp.id,
    name: 'DATABASE_URL',
    // Reference the DATABASE_URL from the database service
    value: '${{PosgreSQL Database.DATABASE_URL}}',
    //       └─────────┬──────────┘└────┬────┘
    //          Service Name        Variable Name
  });
}
```

## How Railway Service References Work

### Syntax

```
${{ServiceName.VARIABLE_NAME}}
```

### Rules

1. **Service Name**: Must match the `name` property of the service (not the resource name)
2. **Variable Name**: The environment variable you want to reference
3. **Automatic Variables**: Railway automatically creates certain variables like `DATABASE_URL`
   for database services
4. **Runtime Resolution**: Railway resolves these references when the service starts

### Example References

```typescript
// Reference database URL
'${{PosgreSQL Database.DATABASE_URL}}';

// Reference Redis URL
'${{Redis Cache.REDIS_URL}}';

// Reference API service URL
'${{API Server.RAILWAY_PUBLIC_DOMAIN}}';

// Reference custom variable
'${{API Server.API_KEY}}';
```

## Alternative Approaches

### Approach 1: Service References (Recommended) ✅

**Pros:**

- Railway manages the actual values
- Works with Railway's automatic variables
- Updates automatically if database credentials change
- Type-safe at deployment time

```typescript
new railway.Variable('db-connection', {
  projectId: project.id,
  environmentId: environment.id,
  serviceId: appService.id,
  name: 'DATABASE_URL',
  value: '${{PostgreSQL.DATABASE_URL}}',
});
```

### Approach 2: SharedVariable (For Environment-Wide Access) ✅

If ALL services need the same variable:

```typescript
// Create database
const db = new railway.Service('database', {
  name: 'PostgreSQL',
  projectId: project.id,
  environmentId: environment.id,
  sourceImage: 'postgres:16-alpine',
});

// Share the DATABASE_URL across ALL services in this environment
new railway.SharedVariable('shared-db-url', {
  projectId: project.id,
  environmentId: environment.id,
  name: 'DATABASE_URL',
  value: '${{PostgreSQL.DATABASE_URL}}',
});

// Now ALL services in this environment have DATABASE_URL automatically
const api = new railway.Service('api', { ... });
const web = new railway.Service('web', { ... });
const worker = new railway.Service('worker', { ... });
// All three services above have access to DATABASE_URL
```

### Approach 3: Hardcoded Connection String ❌

**Not recommended** - credentials may change:

```typescript
new railway.Variable('db-url', {
  projectId: project.id,
  environmentId: environment.id,
  serviceId: appService.id,
  name: 'DATABASE_URL',
  value: 'postgresql://user:pass@host:5432/db', // Don't do this!
});
```

### Approach 4: Railway Internal DNS 🤔

**May work but not guaranteed:**

```typescript
new railway.Variable('db-url', {
  projectId: project.id,
  environmentId: environment.id,
  serviceId: appService.id,
  name: 'DATABASE_URL',
  value: $interpolate`postgresql://postgres:password@${db.id}.railway.internal:5432/railway`,
});
```

## Railway's Automatic Variables

Railway automatically creates these variables for certain service types:

### PostgreSQL Services

- `DATABASE_URL` - Full connection string
- `PGHOST` - Database host
- `PGPORT` - Database port
- `PGUSER` - Database user
- `PGPASSWORD` - Database password
- `PGDATABASE` - Database name

### Redis Services

- `REDIS_URL` - Full Redis connection string

### All Services

- `RAILWAY_PUBLIC_DOMAIN` - Public domain of the service
- `RAILWAY_PRIVATE_DOMAIN` - Private internal domain
- `RAILWAY_ENVIRONMENT_NAME` - Name of the environment
- `RAILWAY_SERVICE_NAME` - Name of the service

## Complete Multi-Service Example

```typescript
async run() {
  const project = new railway.Project('gaming-platform', {
    name: 'Gaming Platform',
  });

  const environment = new railway.Environment($app.stage, {
    projectId: project.id,
    name: $app.stage,
  });

  // Database service
  const db = new railway.Service('database', {
    name: 'PostgreSQL',
    projectId: project.id,
    environmentId: environment.id,
    sourceImage: 'postgres:16-alpine',
  });

  // Redis service
  const redis = new railway.Service('redis', {
    name: 'Redis',
    projectId: project.id,
    environmentId: environment.id,
    sourceImage: 'redis:7-alpine',
  });

  // Backend API service
  const api = new railway.Service('api', {
    name: 'API',
    projectId: project.id,
    environmentId: environment.id,
    sourceRepo: 'fveracoechea/gaming',
    sourceRepoBranch: 'main',
    rootDirectory: 'apps/server',
  });

  // API needs both database and redis
  new railway.Variable('api-db', {
    projectId: project.id,
    environmentId: environment.id,
    serviceId: api.id,
    name: 'DATABASE_URL',
    value: '${{PostgreSQL.DATABASE_URL}}',
  });

  new railway.Variable('api-redis', {
    projectId: project.id,
    environmentId: environment.id,
    serviceId: api.id,
    name: 'REDIS_URL',
    value: '${{Redis.REDIS_URL}}',
  });

  // Frontend React app
  const web = new railway.Service('web', {
    name: 'Web',
    projectId: project.id,
    environmentId: environment.id,
    sourceRepo: 'fveracoechea/gaming',
    sourceRepoBranch: 'main',
    rootDirectory: 'apps/web',
  });

  // Web needs to know the API URL
  new railway.Variable('web-api-url', {
    projectId: project.id,
    environmentId: environment.id,
    serviceId: web.id,
    name: 'API_URL',
    value: '${{API.RAILWAY_PUBLIC_DOMAIN}}',
  });

  // If web also needs direct database access (e.g., for SSR)
  new railway.Variable('web-db', {
    projectId: project.id,
    environmentId: environment.id,
    serviceId: web.id,
    name: 'DATABASE_URL',
    value: '${{PostgreSQL.DATABASE_URL}}',
  });
}
```

## Common Issues & Solutions

### Issue 1: "Service name not found"

**Problem:** The service reference doesn't resolve.

**Solution:** Make sure the service name in the reference matches the `name` property:

```typescript
const db = new railway.Service('database', {
  name: 'PostgreSQL', // ← Use THIS name in references
  // ...
});

// Correct ✅
value: '${{PostgreSQL.DATABASE_URL}}';

// Wrong ❌
value: '${{database.DATABASE_URL}}';
```

### Issue 2: "Variable not available"

**Problem:** The referenced variable doesn't exist.

**Solution:** Check that:

1. The variable is automatically created (like `DATABASE_URL` for Postgres)
2. Or you've explicitly created it on the source service

```typescript
// Create a custom variable on the database service
new railway.Variable('db-custom-var', {
  projectId: project.id,
  environmentId: environment.id,
  serviceId: db.id,
  name: 'CUSTOM_VALUE',
  value: 'some-value',
});

// Now you can reference it
new railway.Variable('app-custom', {
  projectId: project.id,
  environmentId: environment.id,
  serviceId: app.id,
  name: 'DB_CUSTOM',
  value: '${{PostgreSQL.CUSTOM_VALUE}}',
});
```

### Issue 3: Services in different environments

**Problem:** Can't reference variables across environments.

**Solution:** Service references only work within the same environment. Use different
approaches:

```typescript
// Option A: Use SharedVariable if applicable
// Option B: Duplicate the variable value in each environment
// Option C: Use external secret management (AWS Secrets Manager, etc.)
```

### Issue 4: Circular dependencies

**Problem:** Service A needs Service B's URL, and Service B needs Service A's URL.

**Solution:** Use service discovery or avoid circular dependencies:

```typescript
// Instead of hardcoding both ways, use Railway's internal DNS
// Services can discover each other via:
// - RAILWAY_PRIVATE_DOMAIN
// - Or Railway's internal networking
```

## Best Practices

1. **Use Service References for Dynamic Values**
   - Database URLs
   - Redis URLs
   - Service domains

2. **Use SharedVariable for Common Configuration**
   - API keys shared by all services
   - Region settings
   - Feature flags

3. **Use Regular Variable for Service-Specific Config**
   - Service-specific API keys
   - Service-specific ports
   - Service-specific feature toggles

4. **Name Services Clearly**

   ```typescript
   // Good ✅
   name: 'PostgreSQL Database';
   name: 'Redis Cache';
   name: 'API Server';

   // Bad ❌
   name: 'db';
   name: 'r';
   name: 'api';
   ```

5. **Document Your References**
   ```typescript
   new railway.Variable('web-db-url', {
     projectId: project.id,
     environmentId: environment.id,
     serviceId: web.id,
     name: 'DATABASE_URL',
     // Reference the PostgreSQL service's automatic DATABASE_URL variable
     value: '${{PostgreSQL Database.DATABASE_URL}}',
   });
   ```

## Summary

✅ **Use `${{ServiceName.VARIABLE_NAME}}`** syntax to reference variables between services  
✅ **Service name** must match the `name` property, not the resource name  
✅ **Railway auto-creates** variables like `DATABASE_URL` for database services  
✅ **SharedVariable** for environment-wide variables  
✅ **Variable** for service-specific configuration  
✅ **References only work** within the same environment

This approach is type-safe, automatically updates when credentials change, and is the
Railway-recommended way to share configuration! 🚀
