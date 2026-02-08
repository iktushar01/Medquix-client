"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const slides = [
  {
    id: 1,
    title: "Your Trusted Online Medicine Shop 💊",
    subtitle: "Safe & reliable OTC medicines, delivered to your doorstep",
    image: "https://i.postimg.cc/d0nWYf3Y/logo.png",
    ctaText: "Shop Medicines",
    ctaLink: "/shop",
  },
  {
    id: 2,
    title: "Order Medicines in Minutes",
    subtitle: "Browse, add to cart, and checkout with cash on delivery",
    image: "https://i.postimg.cc/d0nWYf3Y/logo.png",
    ctaText: "Browse Shop",
    ctaLink: "/shop",
  },
  {
    id: 3,
    title: "Sell Medicines on MediStore",
    subtitle: "Manage inventory, orders, and stock with ease",
    image: "https://i.postimg.cc/d0nWYf3Y/logo.png",
    ctaText: "Become a Seller",
    ctaLink: "/register",
  },
];



export default function HeroSlider() {
  return (
    <section className="w-full">
      <Carousel className="relative">
        <CarouselContent>
          {slides.map((slide) => (
            <CarouselItem key={slide.id}>
              <div className="relative h-[70vh] w-full flex items-center justify-center bg-gradient-to-r from-emerald-600 to-teal-500 text-white">
                
                {/* Text */}
                <div className="z-10 text-center max-w-2xl px-4">
                  <h1 className="text-4xl md:text-5xl font-bold mb-4">
                    {slide.title}
                  </h1>
                  <p className="text-lg mb-6">
                    {slide.subtitle}
                  </p>
                  <Button size="lg" className="bg-white text-emerald-600 hover:bg-gray-100">
                    Shop Medicines
                  </Button>
                </div>

                {/* Background image (optional logo branding) */}
                <Image
                  src={slide.image}
                  alt="Hero Image"
                  width={300}
                  height={300}
                  className="absolute bottom-10 right-10 opacity-20"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious className="left-4" />
        <CarouselNext className="right-4" />
      </Carousel>
    </section>
  );
}
