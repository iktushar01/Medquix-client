import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
  baseURL: (process.env.NEXT_PUBLIC_API_URL ||
    (typeof window !== "undefined" ? window.location.origin + "/api" : (process.env.NEXT_PUBLIC_APP_URL || "https://medquix-server.vercel.app/api"))) + "/auth",
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
      },
      phone: {
        type: "string",
        required: false,
      },
      status: {
        type: "string",
        required: false,
      },
    },
  },
})

