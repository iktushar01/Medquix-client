// lib/handleGoogleLogin.ts
import { authClient } from "@/lib/auth-client";

export const handleGoogleLogin = async () => {
  try {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "http://localhost:3000",
    });
  } catch (error) {
    console.error("Google login failed:", error);
  }
};
