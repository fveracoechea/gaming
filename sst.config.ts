/// <reference path="./.sst/platform/config.d.ts" />
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
    const authSecret = new sst.Secret('BETTER_AUTH_SECRET');

    const project = new railway.Project(
      'Gaming Tournaments',
      {
        description: 'A platform for gaming tournaments and events',
      },
      {
        protect: true,
      },
    );

    const env = new railway.Environment($app.stage, {
      name: $app.stage,
      projectId: project.id,
    });

    const db = new railway.Service('Postgres', {
      projectId: project.id,
      region: 'us-east4-eqdc4a',
      sourceImage: 'ghcr.io/railwayapp-templates/postgres-ssl:17',
    });

    const webapp = new railway.Service('WebApp', {
      projectId: project.id,
      region: 'us-east4-eqdc4a',
      sourceRepo: 'https://github.com/fveracoechea/gaming.git',
      sourceRepoBranch: 'main',
      rootDirectory: 'apps/web',
    });

    new railway.Variable('DATABASE_URL', {
      serviceId: webapp.id,
      environmentId: env.id,
      value: $interpolate`\${{${db.name}.DATABASE_URL}}`,
    });

    new railway.Variable('VITE_APP_URL', {
      serviceId: webapp.id,
      environmentId: env.id,
      value: '${{RAILWAY_PUBLIC_DOMAIN}}',
    });

    new railway.Variable('BETTER_AUTH_SECRET', {
      serviceId: webapp.id,
      environmentId: env.id,
      value: authSecret.value,
    });
  },
});
