import FeaturedMedicines from "@/components/modules/home/FeaturedMedicines";
import HeroSlider from "@/components/modules/home/Hero";
import ShopByConcern from "@/components/ui/ShopByConcern";
import { Testimonials } from "@/components/ui/Testimonials";
import { WhyChooseUs } from "@/components/ui/WhyChooseUs";
import { userService } from "@/services/user.service";
export const dynamic = "force-dynamic";

export default async function Home() {

  const { data } = await userService.getSession();
  console.log(data)
  return (
    <div>
      <HeroSlider />
      <FeaturedMedicines />
      <WhyChooseUs />
      <Testimonials />
    </div>
  );
}
