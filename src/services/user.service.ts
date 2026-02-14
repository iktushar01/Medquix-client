
import { cookies } from "next/headers";


const AUTH_URL = process.env.AUTH_URL;

export const userService = {
  getSession: async function () {
    try {
      const cookieStore = await cookies();
      const localAppUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
      const res = await fetch(`${localAppUrl}/api/auth/get-session`, {
        headers: {
          cookie: cookieStore.toString(),
        },
        cache: "no-store",
      })
      const session = await res.json()
      console.log("Session response status:", res.status);
      console.log("Session cookies sent:", cookieStore.toString());
      console.log("Session data received:", session);
      if (session == null) {
        return { data: null, error: { message: "Something went wrong" } };
      }
      return { data: session, error: null };
    }
    catch (error) {
      console.error(error)
      return { data: null, error: { message: "Something went wrong" } };
    }
  }
}