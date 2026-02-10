"use client";

import Image from "next/image";
import Link from "next/link";
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
    image: "https://i.postimg.cc/MZ33FL7T/Pharmacist-Handing-Medication-to-Senior-Customer-jpg.webp",
    ctaText: "Shop Medicines",
    ctaLink: "/shop",
  },
  {
    id: 2,
    title: "Order Medicines in Minutes",
    subtitle: "Browse, add to cart, and checkout with cash on delivery",
    image: "https://i.postimg.cc/gc5j2YVf/vecteezy-medicine-and-health-concept-various-medicines-in-trolley-on-4418887.jpg",
    ctaText: "Browse Shop",
    ctaLink: "/shop",
  },
  {
    id: 3,
    title: "Sell Medicines on MedQuix",
    subtitle: "Manage inventory, orders, and stock with ease",
    image: "https://i.postimg.cc/L5hVBH5j/Becoming-an-online-seller.jpg",
    ctaText: "Become a Seller",
    ctaLink: "/register",
  },
];

export default function HeroSlider() {
  return (
    <section className="w-full">
      <Carousel
        opts={{ loop: true }}
        className="relative w-full overflow-hidden"
      >
        <CarouselContent>
          {slides.map((slide) => (
            <CarouselItem key={slide.id}>
              {/* Hero Container */}
              <div className="relative h-[60vh] md:h-[75vh] w-full flex items-center justify-center">

                {/* 1. Main Background Image */}
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  priority={slide.id === 1} // Load first image immediately
                  className="object-cover"
                />

                {/* 2. Dark Overlay Layer (for text readability) */}
                <div className="absolute inset-0 bg-black/50 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

                {/* 3. Text Content */}
                <div className="relative z-10 text-center text-white max-w-3xl px-6">
                  <h1 className="text-4xl md:text-6xl font-extrabold mb-4 tracking-tight drop-shadow-md">
                    {slide.title}
                  </h1>
                  <p className="text-lg md:text-xl mb-8 text-gray-100 drop-shadow-sm font-medium">
                    {slide.subtitle}
                  </p>
                  <Link href={slide.ctaLink}>
                    <Button
                      size="lg"
                      className="bg-emerald-600 hover:bg-emerald-700 text-white border-none px-8 py-6 text-lg rounded-full transition-all hover:scale-105"
                    >
                      {slide.ctaText}
                    </Button>
                  </Link>
                </div>

              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Navigation Arrows (Styled to be more visible) */}
        <CarouselPrevious className="hidden md:flex left-8 bg-white/20 hover:bg-white/40 border-none text-white h-12 w-12" />
        <CarouselNext className="hidden md:flex right-8 bg-white/20 hover:bg-white/40 border-none text-white h-12 w-12" />
      </Carousel>
    </section>
  );
}