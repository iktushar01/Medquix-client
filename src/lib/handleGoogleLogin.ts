// lib/handleGoogleLogin.ts
import { authClient } from "@/lib/auth-client";

export const handleGoogleLogin = async () => {
  try {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: process.env.NEXT_PUBLIC_BASE_URL,
      
    });
  } catch (error) {
    console.error("Google login failed:", error);
  }
};
