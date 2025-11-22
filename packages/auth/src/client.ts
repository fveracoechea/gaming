import { adminClient, usernameClient } from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';
import { Resource } from 'sst';

export const authClient = createAuthClient({
  plugins: [usernameClient(), adminClient()],
  baseURL: env.VITE_AUTH_URL,
});
