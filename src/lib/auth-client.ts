// src/lib/auth-client.ts
import { createAuthClient } from "better-auth/react";
// import { BACKEND_BASE_URL } from "@/constants";

export const authClient = createAuthClient({
    baseURL: import.meta.env.BETTER_AUTH_URL,
    fetchOptions: {
        credentials: "include", // ensures the session cookie flows cross-origin
    },
});

export const { signIn, signUp, signOut, useSession } = authClient;