/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: 'gaming',
      removal: input?.stage === 'production' ? 'retain' : 'remove',
      protect: ['production'].includes(input?.stage),
      home: 'local',
      providers: {
        railway: {
          version: '0.4.4',
          token: new sst.Secret('RAILWAY_TOKEN').value,
        },
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

    // Database service
    const db = new railway.Service('database', {
      name: 'PosgreSQL Database',
      projectId: project.id,
      region: 'us-east1',
      sourceImage: 'ghcr.io/railwayapp-templates/postgres-ssl:17.6',
    });

    // React app service
    const reactApp = new railway.Service('react-app', {
      name: 'React Router WebApp',
      projectId: project.id,
      region: 'us-east1',
      sourceRepo: 'fveracoechea/gaming',
      sourceRepoBranch: 'main',
      rootDirectory: 'apps/web',
    });

    new railway.Variable('database-url', {
      environmentId: env.id,
      serviceId: reactApp.id,
      name: 'DATABASE_URL',
      value: $interpolate`\${{${db.name}.DATABASE_URL}}`,
    });

    return {
      projectId: project.id,
      environmentId: env.id,
      databaseId: db.id,
      reactAppId: reactApp.id,
    };
  },
});
