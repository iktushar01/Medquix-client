import HeroSlider from "@/components/modules/home/Hero";
import { Testimonials } from "@/components/ui/Testimonials";
import { WhyChooseUs } from "@/components/ui/WhyChooseUs";
import { userService } from "@/services/user.service";

export default async function Home() {

const {data} = await userService.getSession();
console.log(data)
  return (
    <div>
      <HeroSlider />
      <WhyChooseUs />
      <Testimonials />
    </div>
  );
}
