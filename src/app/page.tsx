import HeroSlider from "@/components/home/Hero";
import { authClient } from "@/lib/auth-client";
import { cookies } from "next/headers";

export default async function Home() {
  const section = await authClient.getSession() 
  console.log(section)
  const cookieStore = await cookies();
  console.log(cookieStore)
  const res = await fetch("http://localhost:5000/api/auth/get-session", {
    headers: {
      cookie: cookieStore.toString()
    },
    cache: "no-store",
  })
  console.log(await res.json())

  const session = await res.json()
  console.log(session)
  return (
    <div>
      
      <HeroSlider />
    </div>
  );
}
