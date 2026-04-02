import FeaturedMedicines from "@/components/modules/home/FeaturedMedicines";
import CareJourney from "@/components/modules/home/CareJourney";
import HeroSlider from "@/components/modules/home/Hero";
import ShopByConcern from "@/components/ui/ShopByConcern";
import { Testimonials } from "@/components/ui/Testimonials";
import { WhyChooseUs } from "@/components/ui/WhyChooseUs";
export const dynamic = "force-dynamic";

export default async function Home() {
  return (
    <div className="overflow-hidden bg-background">
      <HeroSlider />
      <ShopByConcern />
      <FeaturedMedicines />
      <CareJourney />
      <WhyChooseUs />
      <Testimonials />
    </div>
  );
}
