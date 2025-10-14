import { createAuthClient } from "better-auth/react";
import { adminClient, usernameClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  plugins: [usernameClient(), adminClient()],
  baseURL: import.meta.env.VITE_SERVER_URL,
});
