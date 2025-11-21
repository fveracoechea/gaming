import { type RouteConfig, prefix } from '@react-router/dev/routes';
import { flatRoutes } from '@react-router/fs-routes';

const routes = await flatRoutes({ rootDirectory: './routes' });
const resources = await flatRoutes({ rootDirectory: './resources' });

export default [...routes, ...prefix('resource', resources)] satisfies RouteConfig;
