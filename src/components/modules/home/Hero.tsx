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
import { ArrowRight, BadgeCheck, PackageCheck, ShieldPlus, Store } from "lucide-react";

const slides = [
  {
    id: 1,
    eyebrow: "Trusted digital pharmacy",
    title: "Medicine ordering that feels modern, clear, and safe.",
    subtitle:
      "Browse essential OTC products, discover trusted sellers, and move from search to checkout with less friction.",
    image:
      "https://i.postimg.cc/MZ33FL7T/Pharmacist-Handing-Medication-to-Senior-Customer-jpg.webp",
    primaryCta: { label: "Shop Medicines", href: "/shop" },
    secondaryCta: { label: "Explore Journey", href: "#care-journey" },
  },
  {
    id: 2,
    eyebrow: "Fast everyday care",
    title: "From symptoms to solutions, organized around real needs.",
    subtitle:
      "Customers can shop by concern, compare medicines, and manage their orders through a cleaner store experience.",
    image:
      "https://i.postimg.cc/gc5j2YVf/vecteezy-medicine-and-health-concept-various-medicines-in-trolley-on-4418887.jpg",
    primaryCta: { label: "Browse Catalog", href: "/shop" },
    secondaryCta: { label: "See Orders", href: "/orders" },
  },
  {
    id: 3,
    eyebrow: "Built for platform roles",
    title: "Customers, sellers, and admins each get a focused workspace.",
    subtitle:
      "The platform supports smooth shopping on the front and cleaner operations behind the scenes for sellers and admins.",
    image: "https://i.postimg.cc/L5hVBH5j/Becoming-an-online-seller.jpg",
    primaryCta: { label: "Create Account", href: "/signup" },
    secondaryCta: { label: "Seller Area", href: "/seller/dashboard" },
  },
];

const quickStats = [
  { label: "Verified sellers", value: "120+" },
  { label: "Fast delivery", value: "24h" },
  { label: "Customer support", value: "7 days" },
];

const highlights = [
  { icon: BadgeCheck, label: "Trusted product flow" },
  { icon: ShieldPlus, label: "Protected role access" },
  { icon: PackageCheck, label: "Order-first experience" },
  { icon: Store, label: "Seller-ready tools" },
];

export default function HeroSlider() {
  return (
    <section className="relative overflow-hidden bg-[linear-gradient(180deg,var(--background)_0%,var(--muted)_100%)] py-6 md:py-10">
      <div className="absolute inset-0">
        <div className="absolute left-[8%] top-20 h-56 w-56 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute right-[8%] top-10 h-72 w-72 rounded-full bg-accent blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-muted blur-3xl" />
      </div>

      <div className="container relative mx-auto px-4">
        <Carousel opts={{ loop: true }} className="w-full">
          <CarouselContent>
            {slides.map((slide) => (
              <CarouselItem key={slide.id}>
                <div className="grid min-h-[78vh] items-center gap-10 rounded-[2rem] border border-border bg-card/90 p-6 shadow-[0_30px_80px_rgba(15,23,42,0.08)] backdrop-blur md:grid-cols-[1.05fr_0.95fr] md:p-10 lg:p-14">
                  <div className="order-2 space-y-8 md:order-1">
                    <div className="inline-flex items-center rounded-full border border-primary/15 bg-accent px-4 py-2 text-xs font-bold uppercase tracking-[0.25em] text-primary">
                      {slide.eyebrow}
                    </div>

                    <div className="max-w-2xl space-y-5">
                      <h1 className="font-serif text-4xl font-black leading-tight text-foreground sm:text-5xl lg:text-6xl">
                        {slide.title}
                      </h1>
                      <p className="max-w-xl text-base leading-8 text-muted-foreground sm:text-lg">
                        {slide.subtitle}
                      </p>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row">
                      <Link href={slide.primaryCta.href}>
                        <Button className="h-12 rounded-full px-7 text-sm font-semibold">
                          {slide.primaryCta.label}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                      <Link href={slide.secondaryCta.href}>
                        <Button
                          variant="outline"
                          className="h-12 rounded-full border-border bg-background/80 px-7 text-sm font-semibold text-foreground hover:bg-muted"
                        >
                          {slide.secondaryCta.label}
                        </Button>
                      </Link>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-3">
                      {quickStats.map((stat) => (
                        <div
                          key={stat.label}
                          className="rounded-3xl border border-border bg-background/80 px-5 py-4 shadow-sm"
                        >
                          <p className="text-2xl font-black text-foreground">{stat.value}</p>
                          <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="order-1 md:order-2">
                    <div className="relative mx-auto max-w-xl">
                      <div className="absolute -left-4 top-10 hidden h-24 w-24 rounded-[2rem] bg-primary/15 blur-2xl md:block" />
                      <div className="absolute -right-3 bottom-10 hidden h-28 w-28 rounded-full bg-accent blur-2xl md:block" />

                      <div className="relative overflow-hidden rounded-[2rem] border border-border bg-card p-3 shadow-[0_25px_60px_rgba(15,23,42,0.18)]">
                        <div className="relative aspect-[4/4.5] overflow-hidden rounded-[1.5rem]">
                          <Image
                            src={slide.image}
                            alt={slide.title}
                            fill
                            priority={slide.id === 1}
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 40vw"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/10 to-transparent" />
                        </div>

                        <div className="absolute bottom-7 left-7 right-7 rounded-[1.5rem] border border-border/70 bg-card/75 p-4 text-card-foreground backdrop-blur-md">
                          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                            Live highlights
                          </p>
                          <div className="mt-3 grid gap-3 sm:grid-cols-2">
                            {highlights.map((item) => {
                              const Icon = item.icon;

                              return (
                                <div
                                  key={item.label}
                                  className="flex items-center gap-3 rounded-2xl bg-background/70 px-3 py-3"
                                >
                                  <div className="rounded-xl bg-accent p-2 text-primary">
                                    <Icon className="h-4 w-4" />
                                  </div>
                                  <span className="text-sm font-medium">{item.label}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselPrevious className="left-2 hidden border-border bg-card/90 text-foreground shadow md:flex" />
          <CarouselNext className="right-2 hidden border-border bg-card/90 text-foreground shadow md:flex" />
        </Carousel>
      </div>
    </section>
  );
}
