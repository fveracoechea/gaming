/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: 'gaming',
      removal: input?.stage === 'production' ? 'retain' : 'remove',
      protect: ['production'].includes(input?.stage),
      home: 'local',
      providers: {
        railway: '0.4.4',
      },
    };
  },
  async run() {
    const project = new railway.Project('gaming-platform', {
      name: 'Gaming Platform',
      description: 'Esports gaming platform infrastructure',
      defaultEnvironment: { name: 'dev' },
    });

    const env = new railway.Environment($app.stage, {
      projectId: project.id,
      name: $app.stage,
    });

    const db = new railway.Service(`database-service-${$app.stage}`, {
      name: `PostgreSQL Database - ${$app.stage}`,
      projectId: project.id,
      region: 'us-east4',
      sourceImage: 'ghcr.io/railwayapp-templates/postgres-ssl:17.6',
    });

    const webapp = new railway.Service(`webapp-service-${$app.stage}`, {
      name: `React Router WebApp - ${$app.stage}`,
      projectId: project.id,
      region: 'us-east4',
      sourceRepo: 'fveracoechea/gaming',
      sourceRepoBranch: 'main',
      rootDirectory: 'apps/web',
    });

    new railway.Variable('auth-secret-var', {
      environmentId: env.id,
      serviceId: webapp.id,
      name: 'BETTER_AUTH_SECRET',
      value: new sst.Secret('BETTER_AUTH_SECRET').value,
    });

    new railway.Variable('database-url-var', {
      environmentId: env.id,
      serviceId: webapp.id,
      name: 'DATABASE_URL',
      value: $interpolate`\${{${db.name}.DATABASE_URL}}`,
    });

    new railway.Variable('vite-app-url-var', {
      environmentId: env.id,
      serviceId: webapp.id,
      name: 'VITE_APP_URL',
      value: $interpolate`\${{${webapp.name}.RAILWAY_PUBLIC_DOMAIN}}`,
    });
  },
});
