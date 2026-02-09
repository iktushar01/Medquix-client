import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /*
   |--------------------------------------------------------------------------
   | SERVER ENV (never exposed to browser)
   |--------------------------------------------------------------------------
   */
  server: {
    BACKEND_URL: z.string().url(),
    AUTH_URL: z.string().url(),

    GOOGLE_CLIENT_ID: z.string(),
    GOOGLE_CLIENT_SECRET: z.string(),
  },

  /*
   |--------------------------------------------------------------------------
   | CLIENT ENV (must start with NEXT_PUBLIC_)
   |--------------------------------------------------------------------------
   */
  client: {
    NEXT_PUBLIC_API_URL: z.string().url(),
    NEXT_PUBLIC_APP_URL: z.string().url(),
    NEXT_PUBLIC_AUTH_CALLBACK_URL: z.string().url(),
  },

  /*
   |--------------------------------------------------------------------------
   | Runtime binding
   |--------------------------------------------------------------------------
   */
  runtimeEnv: {
    // server
    BACKEND_URL: process.env.BACKEND_URL,
    AUTH_URL: process.env.AUTH_URL,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,

    // client
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_AUTH_CALLBACK_URL:
      process.env.NEXT_PUBLIC_AUTH_CALLBACK_URL,
  },
});
