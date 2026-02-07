import HeroSlider from "@/components/home/Hero";
import { authClient } from "@/lib/auth-client";

export default async function Home() {
  const section = await authClient.getSession() 
  console.log(section)
  return (
    <div>
      
      <HeroSlider />
    </div>
  );
}
