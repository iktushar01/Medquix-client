import HeroSlider from "@/components/modules/home/Hero";
import { userService } from "@/services/user.service";

export default async function Home() {

const {data} = await userService.getSession();
console.log(data)
  return (
    <div>
      <HeroSlider />
    </div>
  );
}
